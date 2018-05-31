const sass = require('@stencil/sass');

exports.config = {
  namespace: 'app',
  flags: { prerender: true },
  // bundles: [
  //   { components: ['app-home', 'etc'] },
  // ],
  // copy: [
  //   { src: 'docs-content' }
  // ],
  enableCache: false,
  srcDir: 'src',
  // globalStyle: 'src/global/app.css', // don't use this if you can keep from it.
  globalScript: 'src/global/app.ts',
  plugins: [
    sass()
  ],
  // hashFileNames: true,
  // hashedFileNameLength: 8,
  outputTargets: [
    {
      type: 'www',
      console: console,
      serviceWorker: {
        swSrc: 'src/sw.js',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png,svg,jpg}'
        ],
      }
    }
  ],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
