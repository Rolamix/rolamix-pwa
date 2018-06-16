const sass = require('@stencil/sass');
const postcss = require('@stencil/postcss');
const cssvariables = require('postcss-css-variables');
const postcssimport = require('postcss-import');
const postcssreport = require('postcss-reporter');

// I think we can get off sass completely and use postcss plugins
// https://pawelgrzybek.com/from-sass-to-postcss/

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
  globalStyle: 'src/styles/global.scss', // The file contents injected into the page header - NOT referenced by url.
  globalScript: 'src/global/index.ts',
  // bundles: [
  //   { components: ['app-home', 'etc'] },
  // ],
  copy: [
    { src: 'assets-svg/*.svg', dest: 'build/rmx/svg/' }
  ],
  plugins: [
    postcss({
      plugins: [
        // We should probably add postcss-url
        postcssimport({ // be skimpy on repeated imports
          skipDuplicates: true,
          path: [
            'src/styles/'
          ]
        }),
        // Transform css-variable usages to use fallbacks for older browsers
        cssvariables({
          preserve: true,
        }),
        postcssreport(),
      ]
    }),
    sass({
      injectGlobalPaths: [ ], // Inject @ top of every scss file. SASS variables, mixins & functions only.
      includePaths: [
        'src/styles/',
      ]
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
    },
    {
      type: 'stats',
      file: 'stats.json'
    }
  ],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
