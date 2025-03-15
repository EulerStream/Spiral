import {defineConfig} from 'vite';
import * as path from "node:path";
import react from '@vitejs/plugin-react-swc';
import * as fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));
const qualifiedName = pkg.name.split("/")[1];
const libName = qualifiedName.split("-").map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)).join("");

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Your plugin entry
      name: "SpiralPlugin", // Name of the global variable
      fileName: `${libName}-${pkg.version}.plugin`, // Output file name
      formats: ["iife"], // Bundle into a single Immediately Invoked Function Expression
    },
    outDir: "./build/dist",
    rollupOptions: {
      output: {
        format: "iife", // Ensures everything is in one file
        inlineDynamicImports: true, // Inlines all dynamic imports
        entryFileNames: `${libName}-${pkg.version}.plugin.js`, // Output file name
      },
    },
  },
});
