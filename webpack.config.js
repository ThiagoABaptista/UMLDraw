const path = require('path');

module.exports = {
  entry: './src/webview/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/icons',
          to: 'assets/icons',
          noErrorOnMissing: true
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
        test: /\.(svg|png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ]
  },
  externals: {
    // Configura as dependências como externas para serem carregadas via CDN
    'html2canvas': 'html2canvas',
    'jspdf': 'jspdf',
    'jspdf-autotable': 'jspdf-autotable'
  },
  devtool: 'source-map'
};