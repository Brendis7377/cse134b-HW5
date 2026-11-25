# My Eleventy Exercise

For this part of HW5, I used Eleventy to build my Home and About Me pages.
Both pages use the same footer, so I only have to edit
`src/_includes/footer.njk` to update it on both pages.

## How to Preview My Pages

From the main HW5 folder, run:

```bash
cd ssg-exercise
npm ci
npx eleventy
npx eleventy --serve
```

Keep the preview server running and open these pages:

- [Home](http://localhost:8080/index.html)
- [About Me](http://localhost:8080/about.html)

If the terminal shows a different port, use that number in both links.