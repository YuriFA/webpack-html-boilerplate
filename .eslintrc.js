// const alias = require('./webpack/alias')

const config = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
  // settings: {
  //   'import/resolver': {
  //     webpack: {
  //       config: {
  //         resolve: {
  //           alias: alias,
  //         },
  //       },
  //     },
  //   },
  // },
}

module.exports = config
