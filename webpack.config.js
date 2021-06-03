const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PRODUCTION_MODE = 'production';
const DEVELOPMENT_MODE = 'development';
const isProduction = process.env.NODE_ENV === PRODUCTION_MODE;

const generateHtmlPlugins = (templateDir) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles.map((item) => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
};

const htmlPlugins = generateHtmlPlugins('./src/html/views');

const config = {
  mode: isProduction ? PRODUCTION_MODE : DEVELOPMENT_MODE,
  target: 'web',
  entry: ['./src/js/index.js', './src/styles/main.scss'],
  output: {
    filename: './js/bundle.js',
    assetModuleFilename: (pathData) => {
      return pathData.filename.replace('src/', '');
    },
    clean: true,
  },
  stats: {
    children: true,
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
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
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        type: 'asset/source',
      },
      {
        test: /\.svg/,
        include: path.resolve(__dirname, 'src/icons'),
        type: 'asset/source',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './style.bundle.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/favicon',
          to: './favicon',
        },
        {
          from: './src/images',
          to: './images',
        },
        {
          from: './src/icons',
          to: './icons',
        },
      ],
    }),
  ].concat(htmlPlugins),
};

module.exports = config;
