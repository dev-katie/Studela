var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};
/* if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://loca8r.herokuapp.com";
} */

//catching errors
var _showError = function (req, res, status){
    var title, content;
    if (status ===404){
            title = "404, page not found";
            content = "Oh dear. Looks like we cant find this page";
    } else {
            title= status + ", something's wrong";
            content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('generic-text',{
            title:title,
            content:content
    });
};

var getCourseDetails = function(req, res, responseBody) {
    var requestOptions, path;
    path = '/api/course/' + req.params.id;
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            qs:{}
    };
    request (
            requestOptions,
            function(err, response, body){
                    if (response.statusCode === 200){
                        responseBody(req, res, body);
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};

module.exports.course_list = function(req, res) {
    var requestOptions, path;
    path = '/api/courses';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json:{},
            qs:{},
    };
    request(
            requestOptions, 
            function(err, response, body){
                res.render('course-list', {
                    title:'Studela',
                    courses:body,
             });
            }
    );
};
module.exports.course_detail = function(req, res) {
    getCourseDetails(req, res, function(req, res, details) {
        res.render('course-details', {
            title: 'Studela',
            resources: details.resource,
            course: details.course,

    });
    })
};
module.exports.course_create_get = function(req, res) {
    var requestOptions, path;
    path = '/api/course/create';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            qs:{}
    };
    request (
            requestOptions,
            function(err, response, body){
                    if (response.statusCode === 200){
                        res.render('course-form', {title:'Studela', departments:body.department})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};
module.exports.course_create_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/course/create";
    postdata = {
        course_code: req.body.course_code,
        course_name: req.body.course_name,
        department: req.body.department
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/course/' + body._id);
            } else {
                console.log(response);
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.course_update_get = function(req, res) {
    var requestOptions, path;
    path = '/api/course/' + req.params.id + '/update';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            qs:{}
    };
    request (
            requestOptions,
            function(err, response, body){
                    if (response.statusCode === 200){
                        res.render('course-form', {title:'Studela', departments:body.departments, course:body.course})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};
module.exports.course_update_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/course/" + req.params.id + "/update";
    postdata = {
        course_code: req.body.course_code,
        course_name: req.body.course_name,
        department: req.body.department
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/course/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.course_delete_get = function(req, res) {
    getCourseDetails(req, res, function(req, res, details) {
        res.render('course-delete', {
            title: 'Studela',
            resources: details.resource,
            courses: details.course,
        })
    })
};
module.exports.course_delete_post = function(req, res) {
    var requestOptions, path, id;
    id = req.params.id;
    path = "/api/course/" + id + "/delete";
   requestOptions = {
       url:apiOptions.server + path,
       method: "POST",
       json:{}
   };
   request (
       requestOptions, function (err, response, body){
           if (response.statusCode ===204){
               res.redirect ('/');
           } else {
               _showError (req, res, response.statusCode);
           }
       }
   );
};