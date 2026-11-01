#!/usr/bin/env python3
"""Build the static site.

Pages live in src/pages/*.html with a short front-matter block. Each page is
wrapped in src/layout.html, and {{> name}} pulls in src/partials/name.html.
Output is plain static HTML written into Mapdeltahq/, which is what Vercel
serves, so deployment is unchanged. Run:  python3 scripts/build.py
"""
import html
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "Mapdeltahq"
BASE = "https://www.mapdeltahq.com"

NAV = [
    ("how", "/how-it-works/", "How It Works"),
    ("services", "/services/", "Services"),
    ("who", "/who-we-help/", "Who We Help"),
    ("about", "/about/", "About"),
    ("contact", "/contact/", "Contact"),
]

ORGANIZATION = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MapDelta",
    "url": BASE + "/",
    "logo": BASE + "/apple-touch-icon.png",
    "email": "ayman@mapdeltahq.com",
    "description": "Managed retailer deduction investigation and recovery operations for consumer-goods suppliers.",
    "address": {"@type": "PostalAddress", "addressCountry": "IN"},
    "areaServed": "US",
}


def parse(path):
    text = path.read_text()
    meta, body = {}, text
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()
        body = text[m.end():]
    return meta, body


def partials(text, depth=0):
    def include(m):
        return partials((SRC / "partials" / f"{m.group(1)}.html").read_text(), depth + 1)
    if depth > 5:
        raise RecursionError("partials nested too deeply")
    return re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", include, text)


def nav_links(active):
    current = ' aria-current="page"'
    return "\n".join(
        f'<a href="{href}"{current if key == active else ""}>{label}</a>' for key, href, label in NAV
    )


def faq_schema(body):
    items = re.findall(r"<summary>(.*?)</summary>\s*<div class=\"faq-a\">(.*?)</div>", body, re.S)
    def strip(s):
        s = re.sub(r'<span class="num">.*?</span>', "", s)
        return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s))).strip()
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}}
            for q, a in items
        ],
    }


def build():
    layout = (SRC / "layout.html").read_text()
    sitemap = []
    for page in sorted((SRC / "pages").glob("*.html")):
        meta, body = parse(page)
        body = partials(body)
        url_path = meta["path"]
        schemas = [ORGANIZATION] if url_path == "/" else []
        if meta.get("schema") == "faq":
            schemas.append(faq_schema(body))
        ld = "\n".join(
            f'  <script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>' for s in schemas
        )
        robots = meta.get("robots", "index, follow")
        out = partials(layout)
        values = {
            "title": meta["title"],
            "description": meta["description"],
            "canonical": BASE + url_path,
            "robots": robots,
            "jsonld": ld,
            "body_class": meta.get("body", ""),
            "nav": nav_links(meta.get("nav", "")),
            "content": body.strip(),
        }
        for key, value in values.items():
            out = out.replace("{{" + key + "}}", value)
        leftover = re.findall(r"\{\{[^}]*\}\}", out)
        if leftover:
            raise ValueError(f"{page.name}: unfilled placeholders {leftover}")
        target = OUT / "404.html" if url_path == "/404.html" else OUT / url_path.strip("/") / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(out)
        if "noindex" not in robots:
            sitemap.append((url_path, meta.get("priority", "0.7")))
        print("built", target.relative_to(ROOT))

    today = date.today().isoformat()
    urls = "\n".join(
        f"  <url><loc>{BASE}{p}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>" for p, pr in sitemap
    )
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n'
    )
    print("built Mapdeltahq/sitemap.xml with", len(sitemap), "urls")


if __name__ == "__main__":
    build()
