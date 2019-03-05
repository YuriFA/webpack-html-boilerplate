const path = require('path')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const alias = require('./config/webpack/alias')

const PRODUCTION_MODE = 'production'
const isProduction = process.env.NODE_ENV === PRODUCTION_MODE

const generateHtmlPlugins = templateDir => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))

  return templateFiles.map(item => {
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views')

const config = {
  entry: ['./src/js/index.js', './src/styles/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: true,
      }),
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        include: path.resolve(__dirname, 'src/styles'),
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProduction ? '/[folder]/[name].[ext]' : '[path][name].[ext]', // TODO: fix paths
              // outputPath: 'images',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.bundle.css',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/fonts',
        to: './fonts',
      },
      {
        from: './src/favicon',
        to: './favicon',
      },
      {
        from: './src/icons',
        to: './icons',
      },
      {
        from: './src/docs',
        to: './docs',
      },
    ]),
    ...htmlPlugins,
  ],
}

module.exports = (env, { mode }) => {
  if (mode === PRODUCTION_MODE) {
    config.plugins.push(new CleanWebpackPlugin())
  }

  return config
}
