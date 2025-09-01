import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import * as esbuild from 'esbuild';

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
    // JavaScript will be bundled by esbuild, so we don't need to copy individual files
    // eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
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

        // Error handling options
        sharpOptions: {
            failOnError: false, // Don't fail the build on image processing errors
        },

        // Transform hook to handle errors gracefully
        transformOnRequest: false, // Process images at build time, not on request
        
        // Custom error handling
        onError: function(error, outputPath) {
            console.warn(`[11ty/eleventy-img] Warning: Failed to process image: ${outputPath}`);
            console.warn(`Error: ${error.message}`);
            // Return a fallback image path or null to skip
            return null;
        },
    });

    // ****************************************************************** CUSTOM SHORTCODES ********************** //
    // Safe image shortcode with fallback
    eleventyConfig.addShortcode("safeImage", function(src, alt, classes = "", fallbackSrc = "/public/img/image_not_found.jpg") {
        if (!src) {
            return `<img src="${fallbackSrc}" alt="${alt}" class="${classes}" data-error="missing-src">`;
        }
        
        // Add https: prefix if it's a Contentful URL without protocol
        const imageSrc = src.startsWith('//') ? `https:${src}` : src;
        
        return `<img src="${imageSrc}" alt="${alt}" class="${classes}" onerror="this.src='${fallbackSrc}'; this.setAttribute('data-error', 'load-failed');">`;
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
        // ****************************************************************** CSS PROCESSING ********************** //
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

        // ****************************************************************** JAVASCRIPT BUNDLING ********************** //
        const jsOutputDir = './_site/js';
        if (!fs.existsSync(jsOutputDir)) {
            fs.mkdirSync(jsOutputDir, { recursive: true });
        }

        // Simple build - let separate esbuild process handle watching
        await esbuild.build({
            entryPoints: ['src/assets/js/main.js'],
            bundle: true,
            outfile: './_site/js/bundle.js',
            format: 'iife',
            minify: isProduction,
            sourcemap: isDevelopment,
        });
    });

    // ****************************************************************** ERROR HANDLING ********************** //
    // Don't let image processing errors stop the build
    eleventyConfig.addGlobalData("buildErrorsFallback", {
        imageNotFound: "/public/img/image_not_found.jpg"
    });

    // More lenient build behavior
    eleventyConfig.setQuietMode(false); // Show warnings
};

export const config = {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
};