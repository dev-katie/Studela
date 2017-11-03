var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = "https://studela.herokuapp.com";
} 


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
 
var getDeptDetails = function(req, res, responseBody) {
    var requestOptions, path;
    path = '/api/department/' + req.params.id;
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


module.exports.department_list = function(req, res) {
    var requestOptions, path;
    path = '/api/departments';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json:{},
            qs:{},
    };
    request(
            requestOptions, 
            function(err, response, body){
                res.render('dept-list', {
                    title:'Studela',
                    dept:body,
             });
            }
    );
};
module.exports.department_detail = function(req, res) {
    getDeptDetails(req, res, function(req, res, details) {
        res.render('dept-details', {
            title: 'Studela',
            //faculty: details.faculty,
            department: details.department,
            courses: details.courses,

    });
    })
};
module.exports.department_create_get = function(req, res) {
    var requestOptions, path;
    path = '/api/department/create';
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
                        res.render('dept-form', {title:'Studela', faculties:body.faculty})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
    
};
module.exports.department_create_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/department/create";
    postdata = {
        department_code: req.body.department_code,
        department_name: req.body.department_name,
        faculty: req.body.faculty
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/department/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.department_update_get = function(req, res) {
    var requestOptions, path;
    path = '/api/department/' + req.params.id + '/update';
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
                        res.render('dept-form', {title:'Studela', faculties:body.faculties, department:body.department})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};
module.exports.department_update_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/department/" + req.params.id + "/update";
    postdata = {
        department_code: req.body.department_code,
        department_name: req.body.department_name,
        faculty: req.body.faculty
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/department/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.department_delete_get = function(req, res) {
    getDeptDetails(req, res, function(req, res, details) {
        res.render('dept-delete', {
            title: 'Studela',
            department: details.department,
            courses: details.course,
        })
    })
};
module.exports.department_delete_post = function(req, res) {
    var requestOptions, path, id;
    id = req.params.id;
    path = "/api/department/" + id + "/delete";
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