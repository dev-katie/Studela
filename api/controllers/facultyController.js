var Faculty = require('../models/faculties');
var Department = require('../models/departments');
var Course = require('../models/courses');
var Resource = require('../models/resources');

var async = require('async');
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.index = function(req, res) {
    async.parallel({
        faculty_count: function(callback) {
            Faculty.count(callback);
        },
        department_count: function(callback) {
            Department.count(callback);
        },
        course_count: function(callback) {
            Course.count(callback);
        },
        resource_count: function(callback) {
            Resource.count(callback);
        },
    }, function(err, results) {
        if(err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    });
}

module.exports.faculty_list = function(req, res, next) {
    Faculty
      .find()
      .populate('faculty')
      .exec(function (err, faculty_list) {
          if (err) {
              return next(err);
          }
          sendJsonResponse(res, 200, faculty_list);
      })
};

module.exports.faculty_detail = function (req, res) {
    async.parallel ({
        faculty: function(callback) {
            Faculty
              .findById(req.params.id)
              .populate('department')
              .exec(callback);
        }, 
        department: function(callback) {
            Department
              .find({ 'faculty': req.params.id})
              .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            sendJsonResponse (res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, results);
    });
};

module.exports.faculty_create_post = function(req, res, next) {
    req.checkBody('faculty_code', 'Enter faculty code').notEmpty();
    req.checkBody('faculty_name', 'Enter faculty name').notEmpty();

    req.sanitize('faculty_name').escape();
    req.sanitize('faculty_code').escape();
    req.sanitize('faculty_code').trim();
    req.sanitize('faculty_code').trim();

    var errors = req.validationErrors();

    var faculty = new Faculty (
        { faculty_code: req.body.faculty_code,
          faculty_name: req.body.faculty_name,  
        });

    if (errors) {
        sendJsonResponse(res, 404, errors);
        return;
    } else {
        faculty.save(function(err) {
            if (err){
                return next(err);
            }
            sendJsonResponse(res, 201, faculty);
        });
    }
};

module.exports.faculty_delete_post = function(req, res) {
    //req.checkBody('facultyid', 'Faculty id must exist').notEmpty();
    
    async.parallel({
        faculty: function(callback) {
            Faculty
              .findById(req.params.id)
              .exec(callback)
        },
        department: function(callback) {
            Department
              .find ({'faculty': req.params.id } )
              .exec(callback)
        }, 
    }, function(err, results) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        if (results.department.length > 0) {
            console.log(req.params.id);
            sendJsonResponse(res, 404, {'message': 'delete departments under this faculty first'});
            return;
        } else {
            Faculty
              .findByIdAndRemove(req.params.id, function deleteFaculty(err) {
                  if (err) {
                      sendJsonResponse(res, 400, err);
                  }
                  sendJsonResponse(res, 204, null);
              });
        }

    });
}

module.exports.faculty_update_post = function(req, res) {
    req.checkBody('faculty_code', 'Enter faculty code').notEmpty();
    req.checkBody('faculty_name', 'Enter faculty name').notEmpty();

    req.sanitize('faculty_name').escape();
    req.sanitize('faculty_code').escape();
    req.sanitize('faculty_code').trim();
    req.sanitize('faculty_code').trim();

    var errors = req.validationErrors();

    var faculty = new Faculty (
        { faculty_code: req.body.faculty_code,
          faculty_name: req.body.faculty_name,  
          _id:req.params.id 
        });

    if (errors) {
        sendJsonResponse(res, 404, errors);
        return;
    } else {
        Faculty
          .findByIdAndUpdate(req.params.id, faculty, {}, function (err, thisfaculty) {
            if (err) {
                sendJsonResponse(res, 400, err); 
                return; 
            }
            sendJsonResponse(res, 201, faculty);
            
        });
    }
};
