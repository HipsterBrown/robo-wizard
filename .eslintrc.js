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
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", "tsx"]
    },
    "import/resolver": {
      typescript: {}
    },
    "import/extensions": [".ts", ".tsx"]
  },
  rules: {
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never"
      }
    ]
  }
}
