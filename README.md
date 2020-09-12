# Simplit

minimal parser for literate programming in `.js`, `.css`, `.html`.  easily extended for any programming language.  it scans a directory for files with the name  `file.js.md` or `file.html.md`, finds all the code fences matching the extension type, and concatenates them into a file named ie. `file.html`, `file.js` (the file is by default written next to the `.md` src).

---

## Use

1. `npm install -g simplit`
1. `cd somewhere`
1. `simplit`

you can additionally configure where it reads from and writes to;

- `simplit <src-path> <build-path>`

if a src path but not a build path is included, the src path will be used as the build path.

---

## Examples

this repo contains two example projects in [/examples](./examples).  clone this repo to give it a try


