'use strict';

var koast = require('koast');
koast.config.loadConfiguration()
  .then(function(x){
    koast.serve();
  })
  .fail(function (err) {
    console.log('problems?', err);
  }); // Default to NODE_ENV or 'local'

