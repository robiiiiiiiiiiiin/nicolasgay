# Test 11ty 🦝🎈
Could be a "Base 11ty" in a near future.

## 📝 Todo
- Optimisation des images récupérées depuis Contentful
- Add JS minification
- 404

## 💿 Installation and build / run
1. Clone the repo
2. Run `npm i`
3. Run `npm run watch` or `npm run build`

## 👾 How it works
### Styling
The project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
### JS
At the moment, every file in the `src/assets/js` folder are simply copied in the build directory using `addPassthroughCopy()` in `eleventy.config.js`.
### Image optimisation
`eleventyImageTransformPlugin` automatically generates multiple image sizes and formats (webp, abif, jpg) at build time.  
When you use an `<img>` tag, it will automatically generate a `<picture>` element with the full srcset etc.
  
Images fetched from Contentful should not be handled by `eleventyImageTransformPlugin`. To do this, you need to add `eleventy:ignore` to the `<img>` tag.
### Environment variables
The project uses dotenv to set environment variables.  
The variable is set in the `package.json` scripts.
.env.dev is loaded when running `npm run watch` and `.env.prod` is loaded when running `npm run build`.  
The code is not minified in dev mode, etc
### Data fetching
The data files are in the `src/_data` folder.  
This project uses Contentful as a headless CMS. The [contentful JS library](https://github.com/contentful/contentful.js) is used to fetch the data.  
  
You need to add thos data in `.env.local`
```
CONTENTFUL_SPACE=...
CONTENTFUL_ACCESSTOKEN=...
```
