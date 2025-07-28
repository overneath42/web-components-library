/// <reference types="vitest/config" />

import { resolve } from "path";
import { defineConfig } from "vite";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

/**
 * Automatically discovers all component directories under `src/components`.
 * A directory is considered a component if it contains an `index.ts` file.
 * @returns {Record<string, string>} An object where keys are component folder names
 * and values are the absolute paths to their `index.ts` entry file.
 */
function getComponentEntries() {
  const componentsDir = resolve(__dirname, "src/components");
  const entries: Record<string, string> = {};

  try {
    const items = readdirSync(componentsDir);

    for (const item of items) {
      const itemPath = join(componentsDir, item);
      const indexPath = join(itemPath, "index.ts");

      // Check if it's a directory and has an index.ts file.
      if (statSync(itemPath).isDirectory() && existsSync(indexPath)) {
        entries[item] = indexPath;
      }
    }
  } catch (error) {
    // This will catch errors like if the `src/components` directory doesn't exist.
    console.warn("Could not read components directory:", error);
  }

  return entries;
}

export default defineConfig({
  build: {
    // The output directory for the build.
    outDir: "dist",
    // Clean the output directory before each build.
    emptyOutDir: true,
    // We are not building a single library, but multiple components,
    // so we configure Rollup directly.
    rollupOptions: {
      // Define multiple entry points. The key (e.g., 'alert-component')
      // will be used as the '[name]' placeholder in the output settings.
      input: getComponentEntries(),

      output: {
        // This is the key to achieving your desired output structure.
        // '[name]' is replaced by the entry key (the component's folder name).
        // This places the compiled JavaScript file inside a folder named after the component.
        // e.g., 'dist/component-one/index.js'
        entryFileNames: "[name]/index.js",

        // This configures the output for assets like CSS.
        // When your `index.ts` imports `index.css`, Vite treats the CSS as an asset
        // of that entry point. '[name]' will again be the component's folder name.
        // This places the processed CSS file in the same component-named folder.
        // e.g., 'dist/component-one/index.css'
        assetFileNames: "[name]/index.css",

        // We use 'es' module format for modern web components.
        format: "es",
      },
    },
    // We want to minify the output in production builds.
    // This is optional, but recommended for production.
    minify: process.env.NODE_ENV === "production",
    // Vite's cssCodeSplit is true by default, which is what we need
    // to generate separate CSS files for each entry point that imports CSS.
  },
});
