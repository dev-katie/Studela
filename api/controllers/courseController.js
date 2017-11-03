var Faculty = require('../models/faculties');
var Department = require('../models/departments');
var Course = require('../models/courses');
var Resource = require('../models/resources');

var async = require('async');
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.course_list = function(req, res){
    Course
      .find()
      .populate('department')
      .exec(function (err, course_list) {
          if (err) {
              sendJsonResponse(res, 400, err);
              return;
          }
          sendJsonResponse(res, 200, course_list);
      });
};
module.exports.course_detail = function(req, res){
    async.parallel({
        course: function(callback){
            Course
              .findById(req.params.id)
              .populate('department')
              .exec(callback);
        },
        resource: function(callback) {
            Resource
              .find({'course' : req.params.id})
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

module.exports.course_create_get = function(req, res) {
    async.parallel({
        department: function(callback) {
            Department.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return; 
        }
        sendJsonResponse(res, 200, results)
    });
};

module.exports.course_create_post = function(req, res){
     
    req.sanitize('course_code').escape();
    req.sanitize('course_name').escape();
    req.sanitize('course_code').trim();
    req.sanitize('course_name').trim();
    req.sanitize('department').escape();

    var course = new Course(
        {   course_code: req.body.course_code,
            course_name: req.body.course_name,
            department: req.body.department,
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        department: function(callback) {
            Department.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    })
    } else {
        Course
          .findOne({ 'course_code': req.body.course_code })
          .exec( function(err, found_course) {
              if(err) {
                  sendJsonResponse(res, 400, err);
                  return;
              }
              if (found_course) {
                  res.redirect(found_course.url);
              } else {
                  course.save(function(err) {
                      if (err) {
                          sendJsonResponse(res, 400, err);
                          return;
                      }
                      sendJsonResponse(res, 201, course);
                  });
              }
          });
    }
   
};
module.exports.course_delete_post = function(req, res){
    async.parallel({
        courses: function(callback) {
            Course
              .findById(req.params.id)
              .exec(callback);
        },
        resources: function(callback) {
            Resource
              .find({ 'course':req.params.id })
              .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        } else {
            if (results.resources.length > 0) {
                sendJsonResponse(res, 400, {'message':'delete resources first'});
                return;
            } else {
                Course.findByIdAndRemove(req.params.id, function deleteCourse (err){
                    if(err) {
                        sendJsonResponse(res, 400, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                })
            }
        }
    })
};
module.exports.course_update_get = function(req, res) {
    async.parallel({
        course: function(callback) {
            Course
              .findById(req.params.id)
              .populate('department')
              .exec(callback);
        },
        departments: function(callback) {
            Department
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
module.exports.course_update_post = function(req, res){
    req.sanitize('course_code').escape();
    req.sanitize('course_name').escape();
    req.sanitize('course_code').trim();
    req.sanitize('course_name').trim();
    req.sanitize('department').escape();

    var course = new Course(
        {   course_code: req.body.course_code,
            course_name: req.body.course_name,
            department: req.body.department,
            _id: req.params.id
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        department: function(callback) {
            Department.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    })
    } else {
        Course
        .findByIdAndUpdate(req.params.id, course, {}, function (err, thiscourse) {
            if (err) {
                sendJsonResponse(res, 400, err); 
                return; 
            }
            sendJsonResponse(res, 201, course);
            
        });
    }
   
};