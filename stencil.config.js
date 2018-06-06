const sass = require('@stencil/sass');
const postcss = require('@stencil/postcss');
const cssvariables = require('postcss-css-variables');

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
  globalScript: 'src/global/index.ts',
  plugins: [
    postcss({
      // Transform css-variable usages to use fallbacks for older browsers
      plugins: [cssvariables({
        preserve: true,
      })]
    }),
    sass({
      injectGlobalPaths: [ ] // SASS variables, mixins & functions only.
    }),
  ],
  // hashFileNames: true,
  // hashedFileNameLength: 8,
  outputTargets: [
    {
      type: 'www',
      console: console,
      logLevel: 'debug',
      serviceWorker: {
        swSrc: 'src/sw.js',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png,svg,jpg,jpeg}'
        ],
      }
    }
  ],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
