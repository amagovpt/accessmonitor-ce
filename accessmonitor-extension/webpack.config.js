const path = require("path");
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
    mode: "production",
    entry: {
        background: './src/background.js',
        content: './src/content/content.ts',
        sidepanel: './src/sidepanel/sidepanel.js'
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
          keep_classnames: true, 
        },
      })],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".jsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
              test: /\.ts$/,
              loader: 'ts-loader'
            },
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: { noEmit: false },
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new CopyPlugin({
            patterns: [
                { from: 'node_modules/@qualweb/qw-page/dist/qw-page.bundle.js', to: 'qwPage.js' },
                { from: 'node_modules/@qualweb/util/dist/__webpack/util.bundle.js', to: 'util.js' },
                { from: 'node_modules/@qualweb/act-rules/dist/__webpack/act.bundle.js', to: 'act.js' },
                { from: 'node_modules/@qualweb/wcag-techniques/dist/__webpack/wcag.bundle.js', to: 'wcag.js' },
                { from: 'node_modules/@qualweb/best-practices/dist/__webpack/bp.bundle.js', to: 'bp.js' },
                { from: 'src/sidepanel/evaluate.js', to: 'sidepanel/evaluate.js' },
                { from: 'src/sidepanel/middleware.js', to: 'sidepanel/middleware.js' },
                { from: 'src/sidepanel/highlight.js', to: 'sidepanel/highlight.js' },
                { from: 'src/sidepanel/sidepanel.html', to: 'sidepanel/sidepanel.html', transform: { transformer: transformHtml, cache: true } },
                { from: 'public/fonts/AMA.ttf', to: 'public/fonts/AMA.ttf' },
                { from: 'public/fonts/AMA.woff', to: 'public/fonts/AMA.woff' },
                { from: 'manifest.json', to: 'manifest.json' }
            ],
        }),
    ],
};

function transformHtml(content) {
    return ejs.render(content.toString(), {
        ...process.env,
    });
}

module.exports = config;
