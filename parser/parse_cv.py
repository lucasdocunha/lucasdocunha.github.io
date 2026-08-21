#!/usr/bin/env python3
"""
parse_cv.py — LaTeX CV → structured JSON parser

Extracts professional data from a LaTeX resume and writes JSON files
that the website consumes from src/data/.

Usage:
    python parser/parse_cv.py [path/to/resume.tex] [output_dir]

Defaults:
    input:  cv/resume.tex
    output: src/data/

This parser uses regex to extract LaTeX commands. It is designed to be
adapted to your specific LaTeX template — adjust the patterns below
to match your command names and document structure.
"""

import json
import os
import re
import sys
from pathlib import Path


def clean_latex(text: str) -> str:
    """Remove common LaTeX formatting from a string."""
    # Remove comments
    text = re.sub(r'(?<!\\)%.*', '', text)
    # Remove common commands, keeping content
    text = re.sub(r'\\textbf\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\textit\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\emph\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\href\{[^}]*\}\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\url\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', text)  # generic single-arg
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Unescape
    text = text.replace('\\&', '&').replace('\\%', '%').replace('\\_', '_')
    text = text.replace('\\#', '#').replace('\\$', '$')
    return text


def extract_command(tex: str, command: str) -> str | None:
    """Extract the first argument of a \\command{...}."""
    pattern = rf'\\{re.escape(command)}\{{([^}}]*)\}}'
    match = re.search(pattern, tex)
    return clean_latex(match.group(1)) if match else None


def extract_all_commands(tex: str, command: str) -> list[str]:
    """Extract all arguments of repeated \\command{...} calls."""
    pattern = rf'\\{re.escape(command)}\{{([^}}]*)\}}'
    return [clean_latex(m) for m in re.findall(pattern, tex)]


def parse_profile(tex: str) -> dict:
    return {
        "name": extract_command(tex, "name") or "[YOUR NAME]",
        "headline": extract_command(tex, "headline") or "Computer Science · Machine Learning · Research",
        "tagline": extract_command(tex, "tagline") or "Computer Scientist & Machine Learning Researcher",
        "description": extract_command(tex, "description")
            or "Computer Science researcher and Machine Learning developer.",
        "location": extract_command(tex, "location") or "[YOUR LOCATION]",
        "email": extract_command(tex, "email") or "[YOUR EMAIL]",
        "cvUrl": "/cv/resume.pdf",
        "socials": [
            {"label": "LinkedIn", "url": extract_command(tex, "linkedin") or "[LINKEDIN URL]", "icon": "linkedin"},
            {"label": "GitHub", "url": extract_command(tex, "github") or "[GITHUB URL]", "icon": "github"},
            {"label": "Google Scholar", "url": extract_command(tex, "scholar") or "[SCHOLAR URL]", "icon": "scholar"},
            {"label": "Email", "url": f"mailto:{extract_command(tex, 'email') or '[YOUR EMAIL]'}", "icon": "mail"},
        ],
    }


def parse_experience(tex: str) -> list[dict]:
    """Parse \\experience blocks with nested \\responsibility and \\tech."""
    experiences = []
    # Find all \experience{...}{...}{...}{...}{...} blocks
    exp_pattern = r'\\experience\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}'
    matches = re.finditer(exp_pattern, tex, re.DOTALL)

    for i, m in enumerate(matches):
        # Look for \responsibility and \tech after this match, before the next
        start = m.end()
        next_match = re.search(exp_pattern, tex[start:], re.DOTALL)
        end = start + next_match.start() if next_match else len(tex)
        block = tex[start:end]

        responsibilities = extract_all_commands(block, "responsibility")
        tech_str = extract_command(block, "tech") or ""
        technologies = [t.strip() for t in tech_str.split(",") if t.strip()]

        experiences.append({
            "id": f"exp-{i+1}",
            "role": clean_latex(m.group(1)),
            "company": clean_latex(m.group(2)),
            "period": clean_latex(m.group(3)),
            "location": clean_latex(m.group(4)),
            "description": clean_latex(m.group(5)),
            "responsibilities": responsibilities,
            "technologies": technologies,
            "projects": [],
        })

    return experiences


def parse_education(tex: str) -> list[dict]:
    edu_pattern = r'\\education\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}'
    matches = re.finditer(edu_pattern, tex, re.DOTALL)
    return [
        {
            "degree": clean_latex(m.group(1)),
            "institution": clean_latex(m.group(2)),
            "period": clean_latex(m.group(3)),
            "description": clean_latex(m.group(4)),
        }
        for m in matches
    ]


def parse_publications(tex: str) -> list[dict]:
    pub_pattern = r'\\publication\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}'
    matches = re.finditer(pub_pattern, tex, re.DOTALL)
    publications = []

    for i, m in enumerate(matches):
        start = m.end()
        next_match = re.search(pub_pattern, tex[start:], re.DOTALL)
        end = start + next_match.start() if next_match else len(tex)
        block = tex[start:end]

        tags = extract_all_commands(block, "pubtag")
        authors = [a.strip() for a in m.group(2).split(" and ") if a.strip()]

        publications.append({
            "id": f"pub-{i+1}",
            "title": clean_latex(m.group(1)),
            "authors": authors,
            "year": clean_latex(m.group(3)),
            "venue": clean_latex(m.group(4)),
            "doi": clean_latex(m.group(5)),
            "link": f"https://doi.org/{clean_latex(m.group(5))}" if m.group(5).strip() else "",
            "abstract": clean_latex(m.group(6)),
            "tags": tags,
        })

    return publications


def parse_skills(tex: str) -> list[dict]:
    """Parse \\skillcategory{name}{icon}{comma-separated skills}."""
    pattern = r'\\skillcategory\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}'
    matches = re.finditer(pattern, tex, re.DOTALL)
    return [
        {
            "name": clean_latex(m.group(1)),
            "icon": clean_latex(m.group(2)),
            "skills": [s.strip() for s in m.group(3).split(",") if s.strip()],
        }
        for m in matches
    ]


def parse_projects(tex: str) -> list[dict]:
    pattern = r'\\project\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}'
    matches = re.finditer(pattern, tex, re.DOTALL)
    projects = []

    for i, m in enumerate(matches):
        start = m.end()
        next_match = re.search(pattern, tex[start:], re.DOTALL)
        end = start + next_match.start() if next_match else len(tex)
        block = tex[start:end]

        github = extract_command(block, "projectgithub") or ""
        demo = extract_command(block, "projectdemo") or ""
        tech_str = extract_command(block, "projecttech") or ""
        technologies = [t.strip() for t in tech_str.split(",") if t.strip()]

        projects.append({
            "id": f"proj-{i+1}",
            "title": clean_latex(m.group(1)),
            "description": clean_latex(m.group(2)),
            "category": clean_latex(m.group(3)),
            "technologies": technologies,
            "github": github,
            "demo": demo,
            "featured": False,
        })

    return projects


def parse_research(tex: str) -> dict:
    lines = []
    line_pattern = r'\\researchline\{([^}]*)\}\{([^}]*)\}'
    for m in re.finditer(line_pattern, tex, re.DOTALL):
        lines.append({
            "area": clean_latex(m.group(1)),
            "description": clean_latex(m.group(2)),
        })

    return {
        "lines": lines,
        "projects": [],
        "publications": [],
        "futureInterests": extract_all_commands(tex, "futureinterest"),
    }


def parse_about(tex: str) -> dict:
    return {
        "summary": extract_command(tex, "aboutsummary") or "",
        "highlights": [],
        "interests": extract_all_commands(tex, "interest"),
        "goals": extract_command(tex, "goals") or "",
    }


def parse_contact(tex: str) -> dict:
    email = extract_command(tex, "email") or "[YOUR EMAIL]"
    return {
        "email": email,
        "socials": [
            {"label": "LinkedIn", "url": extract_command(tex, "linkedin") or "[LINKEDIN URL]", "icon": "linkedin"},
            {"label": "GitHub", "url": extract_command(tex, "github") or "[GITHUB URL]", "icon": "github"},
            {"label": "Google Scholar", "url": extract_command(tex, "scholar") or "[SCHOLAR URL]", "icon": "scholar"},
            {"label": "Email", "url": f"mailto:{email}", "icon": "mail"},
        ],
    }


def write_json(data: dict, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"  ✓ {path}")


def main():
    # Resolve paths
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    tex_path = Path(sys.argv[1]) if len(sys.argv) > 1 else project_root / "cv" / "resume.tex"
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else project_root / "src" / "data"

    if not tex_path.exists():
        print(f"Error: LaTeX file not found at {tex_path}", file=sys.stderr)
        print(f"Place your resume.tex in the cv/ directory.", file=sys.stderr)
        sys.exit(1)

    print(f"Parsing: {tex_path}")
    tex = tex_path.read_text(encoding="utf-8")

    # Parse all sections
    profile = parse_profile(tex)
    education = parse_education(tex)
    about = parse_about(tex)
    experience = parse_experience(tex)
    research = parse_research(tex)
    projects = parse_projects(tex)
    publications = parse_publications(tex)
    skills = parse_skills(tex)
    contact = parse_contact(tex)

    # Write JSON files
    print(f"Writing to: {output_dir}")
    write_json(profile, output_dir / "profile.json")
    write_json(education, output_dir / "education.json")
    write_json(about, output_dir / "about.json")
    write_json(experience, output_dir / "experience.json")
    write_json(research, output_dir / "research.json")
    write_json(projects, output_dir / "projects.json")
    write_json(publications, output_dir / "publications.json")
    write_json(skills, output_dir / "skills.json")
    write_json(contact, output_dir / "contact.json")

    print("\nDone! JSON data files generated successfully.")


if __name__ == "__main__":
    main()
