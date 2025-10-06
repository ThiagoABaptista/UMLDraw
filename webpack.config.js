const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/webview/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Limpa o diretório de output antes de cada build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/icons',
          to: 'assets/icons',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.gitkeep'] // Ignora arquivos vazios se houver
          }
        },
        {
          from: 'src/assets/images',
          to: 'assets/images',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]'
        }
      }
    ]
  },
  devtool: 'source-map'
};