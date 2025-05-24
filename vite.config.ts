import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // monacoEditorPlugin({
    //   languageWorkers: ['editorWorkerService', 'json', "typescript", "html" ], // Add the languages you need
    // }),
  ],
})
