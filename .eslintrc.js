module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: ".",
    project: ["./tsconfig.json"]
  },
  rules: {
    "no-underscore-dangle": "off"
  }
}
