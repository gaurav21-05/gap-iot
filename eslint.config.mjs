import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable specific rules (set to "off")
      "no-unused-vars": "off", // Example: Disable unused variables warning
      "@typescript-eslint/no-explicit-any": "off", // Example: Disable TypeScript's any warning
      // Or set to "warn" instead of "error" to reduce severity
      "react/prop-types": "warn",
    },
  },
  
];

export default eslintConfig;
