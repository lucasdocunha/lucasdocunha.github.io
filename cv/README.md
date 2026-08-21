# CV LaTeX Source

Place your LaTeX resume here as `resume.tex`.

The GitHub Actions workflow in `.github/workflows/sync-cv.yml` will:
1. Detect changes to `resume.tex` on push
2. Run `python parser/parse_cv.py` to extract structured data
3. Generate JSON files in `src/data/`
4. Commit the updated JSON back to the repo
5. Trigger a deploy

## Expected LaTeX commands

The parser looks for these commands in your `.tex` file:

```latex
\name{Your Name}
\headline{Computer Science \& Machine Learning}
\email{you@example.com}
\location{City, Country}
\linkedin{https://linkedin.com/in/yourprofile}
\github{https://github.com/yourusername}
\scholar{https://scholar.google.com/yourprofile}

% Experience entries
\experience{Role}{Company}{Period}{Location}{Description}
\responsibility{Key responsibility text}
\tech{Python, TensorFlow, OpenCV}

% Education
\education{Degree}{Institution}{Period}{Description}

% Publications
\publication{Paper Title}{Authors}{Year}{Venue}{DOI}{Abstract}
\pubtag{Computer Vision}
```

If your LaTeX uses different command names, adjust the regex patterns in
`parser/parse_cv.py` accordingly.
