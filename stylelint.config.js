module.exports = {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'no-descending-specificity': null,
    'declaration-colon-newline-after': null,
    'value-list-comma-newline-after': null,
    'at-rule-empty-line-before': null,
    'selector-list-comma-newline-after': null,
    'color-hex-case': null,
    'rule-empty-line-before': null,
    'color-hex-length': null,
    'number-leading-zero': null,
    'number-no-trailing-zeros': null,
    'property-no-unknown': null
  }
}
