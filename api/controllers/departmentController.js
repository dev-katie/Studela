var Faculty = require('../models/faculties');
var Department = require('../models/departments');
var Course = require('../models/courses');
var Resource = require('../models/resources');

var async = require('async');
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.department_list = function(req, res) {
    Department
      .find()
      .populate('faculty')
      .exec(function (err, dept_list) {
          if (err) {
              sendJsonResponse(res, 400, err);
              return;
          }
          sendJsonResponse(res, 200, dept_list);
      });
};

module.exports.department_detail = function(req, res) {
    async.parallel({
        department: function(callback) {
            Department
              .findById(req.params.id)
              .populate('faculty')
              .exec(callback);
        },
        courses: function(callback) {
            Course
              .find({ 'department': req.params.id })
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

module.exports.department_create_get = function(req, res) {
    async.parallel({
        faculty: function(callback) {
            Faculty.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        sendJsonResponse(res, 200, results)
    });
};

module.exports.department_create_post = function (req, res) { 
    req.sanitize('department_code').escape();
    req.sanitize('department_name').escape();
    req.sanitize('department_code').trim();
    req.sanitize('department_name').trim();
    req.sanitize('faculty').escape();

    var department = new Department(
        {   department_code: req.body.department_code,
            department_name: req.body.department_name,
            faculty: req.body.faculty,
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        faculty: function(callback) {
            Faculty.find(callback);
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
        Department
          .findOne({ 'department_code': req.body.department_code })
          .exec( function(err, found_dept) {
              if(err) {
                  sendJsonResponse(res, 400, err);
                  return;
              }
              if (found_dept) {
                  res.redirect(found_dept.url);
              } else {
                  department.save(function(err) {
                      if (err) {
                          sendJsonResponse(res, 400, err);
                          return;
                      }
                      sendJsonResponse(res, 201, department);
                      //console.log(department);
                  });
              }
          });
    }
    
};

module.exports.department_update_get = function(req, res) {
    async.parallel({
        department: function(callback) {
            Department
              .findById(req.params.id)
              .populate('faculty')
              .exec(callback);
        },
        faculties: function(callback) {
            Faculty
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
module.exports.department_update_post = function(req, res) {
    req.sanitize('department_code').escape();
    req.sanitize('department_name').escape();
    req.sanitize('department_code').trim();
    req.sanitize('department_name').trim();
    req.sanitize('faculty').escape();

    var department = new Department(
        {   department_code: req.body.department_code,
            department_name: req.body.department_name,
            faculty: req.body.faculty,
            _id:req.params.id            
        });
    var errors = req.validationErrors();
    if (errors) {
        async.parallel({
        faculty: function(callback) {
            Faculty.find(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    })
    } else {
        Department
        .findByIdAndUpdate(req.params.id, department, {}, function (err, thisdept) {
            if (err) {
                sendJsonResponse(res, 400, err); 
                return; 
            }
            sendJsonResponse(res, 201, department);
            
        });
    }
    
};
module.exports.department_delete_post = function(req, res) {   
    async.parallel({
        department: function(callback) {
            Department
              .findById(req.params.id)
              .exec(callback);
        },
        courses: function(callback) {
            Course
              .find({ 'department':req.params.id })
              .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        } else {
            if (results.courses.length > 0) {
                sendJsonResponse(res, 400, {'message':'delete courses first'});
                return;
            } else {
                Department.findByIdAndRemove(req.params.id, function deleteDepartment (err){
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


