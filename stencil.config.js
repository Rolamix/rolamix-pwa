const sass = require('@stencil/sass');
const postcss = require('@stencil/postcss');
const cssvariables = require('postcss-css-variables');
const postcssimport = require('postcss-import');
const postcssreport = require('postcss-reporter');

exports.config = {
  namespace: 'rmx',
  srcDir: 'src',
  logLevel: 'info',
  flags: { prerender: true },
  buildEs5: true,
  buildStats: true,
  enableCache: false,
  hashFileNames: true,
  hashedFileNameLength: 12,
  // globalStyle: 'src/global/app.css', // don't use this if you can keep from it.
  globalScript: 'src/global/index.ts',
  // bundles: [
  //   { components: ['app-home', 'etc'] },
  // ],
  // copy: [
  //   { src: 'docs-content' }
  // ],
  plugins: [
    postcss({
      // Transform css-variable usages to use fallbacks for older browsers
      plugins: [
        postcssimport({
          skipDuplicates: true,
          path: [
            'src/styles/'
          ]
        }),
        cssvariables({
          preserve: true,
        }),
        postcssreport(),
      ]
    }),
    sass({
      injectGlobalPaths: [ ] // SASS variables, mixins & functions only.
    }),
  ],
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
        globIgnores: [
          '**/build/rmx/svg/*',
          '**/index.html' // caching this causes '/' to be cached too.. for future reference :muscle:.
        ]
      }
    }
  ],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
