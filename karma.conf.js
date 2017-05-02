const webpackConfig = require('./webpack.config.js');
webpackConfig.entry = null;

module.exports = function(config) {
  config.set({
    
    // ... normal karma configuration
    frameworks: ['jasmine'],

    reporters: ['kjhtml'],

    port: 9876,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers : ['Chrome'],

    singleRun: false,

    autoWatchBatchDelay: 300,


    files: [
      './spec/entry.spec.js'
    ],

    preprocessors: {
      './spec/entry.spec.js': ['webpack'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      //stats: 'errors-only'
      //noInfo: true
    }

  });
};