const sass = require('@stencil/sass');

exports.config = {
  serviceWorker: {
    swSrc: 'src/sw.js',
    globPatterns: [
      '**/*.{js,css,json,html,ico,png}'
    ],
  },
  globalStyle: 'src/global/app.css',
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
