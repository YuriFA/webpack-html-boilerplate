module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 0,
      features: {
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
  ],
}
