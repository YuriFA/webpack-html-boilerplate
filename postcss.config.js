module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 0,
      features: {
        // https://github.com/csstools/postcss-preset-env/blob/d7652b1e6196e8f55bf3f0aac4ac090fec7ed54e/src/lib/plugins-by-id.js#L36
        'custom-properties': { preserve: false },
      },
    }),
    require('cssnano')({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
    require('postcss-inline-svg')({
      path: './src/',
    }),
    require('postcss-pxtorem')({
      rootValue: 10,
      selectorBlackList: ['body'],
    }),
  ],
};
