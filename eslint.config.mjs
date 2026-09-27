import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Firebase Hosting's deploy staging directory. The CLI copies the whole
    // build into it, so linting it means linting Turbopack's own output —
    // thousands of errors in generated chunks that no one can act on.
    ".firebase/**",
  ]),
]);

export default eslintConfig;
