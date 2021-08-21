module.exports =  {
  parser:  '@typescript-eslint/parser',
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript'
  ],
  plugins: [
    'import'
  ],
  rules: {
    "import/newline-after-import": ["error", { "count": 1 }],
    "@typescript-eslint/no-explicit-any": "off",
    "curly": ['error', 'all'],
    "brace-style": ["error", "1tbs"],
    "@typescript-eslint/semi": ["error", "never"],
    "react/jsx-filename-extension": ["off"],
    "no-param-reassign": ["off"]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ],
        extensions: ['.ts', '.js', '.json']
      }
    }
  }
}