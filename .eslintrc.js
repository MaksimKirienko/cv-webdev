module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
    'space-before-function-paren': 'off',
    'template-curly-spacing': 'off',
    'no-console': 'off',
    'no-trailing-spaces': 'off',
    'arrow-parens': 'off',
    'vue/max-attributes-per-line': 'off',
    'singleline-html-element-content-newline': 'off',
    'import/no-named-as-default': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
