var request = require('request');
var apiOptions = {
    server: "https://studela.herokuapp.com"
};

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

module.exports.index = function(req, res) {
    var requestOptions, path;
    path = '/api/index';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json:{},
            qs:{},
    };
    request(
            requestOptions, 
            function(err, response, body){
                res.render('index', {
                    title:'Studela',
                    description: 'The biggest online students resource center',
                    results:body,
                    error: err,
             });
            }
    );
};
var getFacultyDetails = function(req, res, responseBody) {
    var requestOptions, path;
    path = '/api/faculty/' + req.params.id;
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

module.exports.faculty_list = function(req, res) {
    var requestOptions, path;
    path = '/api/faculties';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json:{},
            qs:{},
    };
    request(
            requestOptions, 
            function(err, response, body){
                res.render('faculty-list', {
                    title:'Studela',
                    faculties:body,
             });
            }
    );
};
module.exports.faculty_detail = function(req, res) {
    getFacultyDetails(req, res, function(req, res, details) {
        res.render('faculty-details', {
            title: 'Studela',
            faculty: details.faculty,
            department: details.department,
    });
    })
};
module.exports.faculty_create_get = function(req, res) {
    res.render('faculty-form', {title:'Studela'})
};
module.exports.faculty_create_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/faculty/create";
    postdata = {
        faculty_code: req.body.faculty_code,
        faculty_name: req.body.faculty_name,
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/faculty/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.faculty_update_get = function(req, res) {
    getFacultyDetails(req, res, function(req, res, details) {
        res.render('faculty-form', {
            title:'Studela',
            faculty: details.faculty
        })
    })
};
module.exports.faculty_update_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/faculty/" + req.params.id + "/update";
    postdata = {
        faculty_code: req.body.faculty_code,
        faculty_name: req.body.faculty_name,
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/faculty/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.faculty_delete_get = function(req, res) {
    getFacultyDetails(req, res, function(req, res, details) {
        res.render('faculty-delete', {
            title: 'Studela',
            faculty: details.faculty,
            department: details.department,
        })
    })
};
module.exports.faculty_delete_post = function(req, res) {
    var requestOptions, path, id;
    id = req.params.id;
    path = "/api/faculty/" + id + "/delete";
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

