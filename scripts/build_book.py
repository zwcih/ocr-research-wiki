#!/usr/bin/env python3
"""Build a deterministic, print-friendly Markdown volume from the public wiki."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "build" / "ocr-research-wiki.md"

sections = [
    ("导言", [CONTENT / "purpose.md", CONTENT / "wiki" / "overview.md"]),
    ("基础概念", sorted((CONTENT / "wiki" / "concepts").glob("*.md"))),
    ("专题综述", sorted((CONTENT / "wiki" / "synthesis").glob("*.md"))),
    ("比较研究", sorted((CONTENT / "wiki" / "comparisons").glob("*.md"))),
    ("论文精读", sorted((CONTENT / "wiki" / "sources").glob("*.md"))),
    ("研究者与机构", sorted((CONTENT / "wiki" / "entities").glob("*.md"))),
]


def clean(text: str) -> str:
    text = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)
    text = re.sub(r"!\[\[([^]|]+)(?:\|[^]]+)?\]\]", r"[插图：\1]", text)
    text = re.sub(r"\[\[([^]|]+)\|([^]]+)\]\]", r"\2", text)
    text = re.sub(r"\[\[([^]]+)\]\]", r"\1", text)
    # Each source page becomes a subsection under its volume chapter.
    text = re.sub(r"(?m)^(#{1,5}) ", lambda m: "#" + m.group(1) + " ", text)
    return text.strip()

parts = [
    "---\n",
    "title: OCR 与文档智能研究 Wiki\n",
    "subtitle: 公开中文研究知识库\n",
    "lang: zh-CN\n",
    "---\n\n",
]
for title, files in sections:
    existing = [p for p in files if p.exists()]
    if not existing:
        continue
    parts.append(f"# {title}\n\n")
    for p in existing:
        parts.append(clean(p.read_text(encoding="utf-8")))
        parts.append("\n\n\\newpage\n\n")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("".join(parts), encoding="utf-8")
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
