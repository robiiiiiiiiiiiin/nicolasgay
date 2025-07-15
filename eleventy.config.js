import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
    // Configure dotenv based on NODE_ENV
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
        dotenv.config({ path: '.env.dev' });
    } else if (isProduction) {
        dotenv.config({ path: '.env.prod' });
    } else {
        // Fallback to dev
        dotenv.config({ path: '.env.dev' });
        dotenv.config(); // This will load .env if .env.local doesn't exist
    }
    
    // ****************************************************************** BASE CONFIG ********************** //
    // Order matters, put this at the top of your configuration file.
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.addPassthroughCopy("src/public");
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