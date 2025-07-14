import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
    // Configure dotenv
    dotenv.config();
    
    // ****************************************************************** BASE CONFIG ********************** //
    // Order matters, put this at the top of your configuration file.
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // output image formats
        formats: ["avif", "webp", "auto"],

        // output image widths
        widths: [460, 1024, 2048, "auto"],

        // optional, attributes assigned on <img> nodes override these values
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                decoding: "async",
            },
            pictureAttributes: {}
        },
    });

    // ****************************************************************** TAILWIND ********************** //
    const postcssConfig = [
        //compile tailwind
        tailwindcss()
    ]
    if (process.env.ENV === 'production') {
        //minify tailwind css
        postcssConfig.push(cssnano({ preset: 'default' }));
    }
    const processor = postcss(postcssConfig);

    eleventyConfig.on('eleventy.before', async () => {
        const tailwindInputPath = path.resolve('./src/assets/style/bundle.css');
        const tailwindOutputPath = './_site/bundle.css';

        const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
        const outputDir = path.dirname(tailwindOutputPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await processor.process(cssContent, {
            from: tailwindInputPath,
            to: tailwindOutputPath,
        });

        fs.writeFileSync(tailwindOutputPath, result.css);
    });
};

export const config = {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
};