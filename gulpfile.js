var gulp = require('gulp');
var rg = require('rangle-gulp');

var karmaVendorFiles = [
  'client/bower_components/lodash/dist/lodash.min.js',
  'client/bower_components/angular/angular.min.js',
  'client/bower_components/angular-mocks/angular-mocks.js',
  'client/bower_components/sinon-chai/lib/sinon-chai.js',
  'client/bower_components/koast-angular/dist/koast.js', // remove
  'client/custom_components/*.js' // remove
];

rg.setLogLevel('info');

gulp.task('karma', rg.karma({
  vendor: karmaVendorFiles
}));

gulp.task('karma-ci', rg.karma({
  vendor: karmaVendorFiles,
  karmaConf: 'client/testing/karma-ci.conf.js'
}));

gulp.task('karma-watch', rg.karmaWatch({
  vendor: karmaVendorFiles
}));

gulp.task('mocha', rg.mocha());

gulp.task('lint', rg.jshint());

gulp.task('beautify', rg.beautify({
  files: []
}));

gulp.task('concat', rg.concatAndUglify({
  name: 'brained',
  dist: 'client/dist/'
}));

gulp.task('dev', rg.nodemon({
  // script: 'examples/basic-express/server/app.js',
  onChange: ['lint'] // or ['lint', 'karma']
}));

gulp.task('test', ['karma', 'mocha']);

gulp.task('default', ['lint', 'concat', 'mocha', 'karma']);