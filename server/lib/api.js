/* global exports, require */

'use strict';

var koast = require('koast');
var moment = require('moment');
var _ = require('underscore');
var connection = koast.db.getConnectionNow();
var mapper = koast.mongoMapper.makeMapper(connection);


function isAdmin (data, req) {
  return req.user && req.user.data.isAdmin;
}

function isOwner (data, req) {
  return req.user && (data.owner === req.user.data.username);
}

function isEditor (data, req) {
  return req.user && _.contains(data.editors || [], req.user.data.username);
}

function isPublic (data, req) {
  return data.published;
}

function canEdit (data, req) {
  return isOwner(data, req) || isEditor(data, req) || isAdmin(data, req);
}

function canSee (data, req) {
  return canEdit(data, req) || isPublic(data, req);
}

mapper.queryDecorator = function(query, req, res) {
  // if (req.method !== 'GET') {
  //   query.owner = req.user.username;
  // }
};

mapper.options.filter = function(result, req) {
  if (req.method === 'GET') {
    return canSee(result, req);
  } else {
    return canEdit(result, req);
  }
};

mapper.options.annotator = function(result, req) {
  result.meta = result.meta || {};
  result.meta.can = {
    edit : canEdit(result.data, req)
  };
};

var awsConfig = koast.config.getConfig('aws');
var s3conf = awsConfig.s3;

s3conf.makeKey =  function (req) {
  var fileName = req.files.attachment.file.originalFilename;
  fileName = moment.utc().format('YYYY-MM-DD-hh-mm-ss-') + fileName;
  return 'uploadedImages/' + req.user.data.username + '/' + fileName;
};

s3conf.respond = function (req, res, key) {
  res.send(200, {
    file: {
      url: awsConfig.baseUrl + key
    }
  });
};

var routes = [
  ['get', 'presentations', mapper.get('presentations')],
  ['get', 'presentations/:owner/:slug', mapper.get('presentations')],
  ['put', 'presentations/:owner/:slug', mapper.put('presentations')],
  ['delete', 'presentations/:owner/:slug', mapper.delete('presentations')],
  ['post', 'presentations', mapper.post('presentations')],
  ['post', 'uploadImage', koast.aws.makeS3FileUploader(awsConfig.global, s3conf)]
];

exports.routes = _.map(routes, function(route) {  
  return {method: route[0], route: route[1], handler: route[2]};
});