var Faculty = require('../models/faculties');
var Department = require('../models/departments');
var Course = require('../models/courses');
var Resource = require('../models/resources');

var async = require('async');
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.resource_list = function(req, res) {
    Resource
      .find()
      .populate('course')
      .exec(function (err, resource_list) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, resource_list);
    });
};
module.exports.resource_detail = function(req, res) {
    async.parallel({
        resource: function(callback) {
            Resource
              .findById(req.params.id)
              .populate('course')
              .exec(callback);
        },
        
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    });
};

module.exports.resource_create_get = function(req, res) {
    async.parallel({
        courses: function(callback) {
            Course
              .find()
              .populate('department')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return; 
        }
        sendJsonResponse(res, 200, results)
    });
};

module.exports.resource_create_post = function(req, res) {
    req.sanitize('resource_name').escape();
    req.sanitize('resource_desc').escape();
    req.sanitize('resource_details').escape();
    req.sanitize('resource_name').trim();
    req.sanitize('resource_desc').trim();
    req.sanitize('course').escape();

    var resource = new Resource(
        {   resource_name: req.body.resource_name,
            resource_desc: req.body.resource_desc,
            resource_details: req.body.resource_details,
            course: req.body.course,
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        course: function(callback) {
            Course.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        console.log(errors);
        sendJsonResponse(res, 200, results);
    })
    } else {
        resource.save(function(err) {
                      if (err) {
                          sendJsonResponse(res, 400, err);
                          return;
                      }
                      sendJsonResponse(res, 201, resource);
                  });
              }
};
module.exports.resource_update_get = function(req, res) {
    async.parallel({
        resource: function(callback) {
            Resource
              .findById(req.params.id)
              .populate('course')
              .exec(callback);
        },
        courses: function(callback) {
            Course
              .find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    });
};
module.exports.resource_update_post = function(req, res) {
    req.sanitize('resource_name').escape();
    req.sanitize('resource_desc').escape();
    req.sanitize('resource_details').escape();
    req.sanitize('resource_name').trim();
    req.sanitize('resource_desc').trim();
    req.sanitize('course').escape();

    var resource = new Resource(
        {   resource_name: req.body.resource_name,
            resource_desc: req.body.resource_desc,
            resource_details: req.body.resource_details,
            course: req.body.course,
            _id: req.params.id,
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        course: function(callback) {
            Course.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        console.log(errors);
        sendJsonResponse(res, 200, results);
    })
    } else {
        Resource
          .findByIdAndUpdate(req.params.id, resource, {}, function (err, thisres) {
            if (err) {
                sendJsonResponse(res, 400, err); 
                return; 
            }
            sendJsonResponse(res, 201, resource);
            
        });
    }
};
module.exports.resource_delete_post = function(req, res) {
    Resource
      .findByIdAndRemove(req.params.id, function deleteResource (err){
        if(err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 204, null);
      });   
};
