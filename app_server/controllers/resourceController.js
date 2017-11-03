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

var getResourceDetails = function(req, res, responseBody) {
    var requestOptions, path;
    path = '/api/resource/' + req.params.id;
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

module.exports.resource_list = function(req, res) {
    var requestOptions, path;
    path = '/api/resources';
    requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json:{},
            qs:{},
    };
    request(
            requestOptions, 
            function(err, response, body){
                res.render('resource-list', {
                    title:'Studela',
                    resources:body,
             });
            }
    );
};
module.exports.resource_detail = function(req, res) {
    getResourceDetails(req, res, function(req, res, details) {
        res.render('resource-details', {
            title: 'Studela',
            resource: details.resource,
        });
    })
};
module.exports.resource_create_get = function(req, res) {
    var requestOptions, path;
    path = '/api/resource/create';
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
                        res.render('resource-form', {title:'Studela', courses:body.courses})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};
module.exports.resource_create_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/resource/create";
    postdata = {
        resource_name: req.body.resource_name,
        resource_desc: req.body.resource_desc,
        resource_details: req.body.resource_details,
        course: req.body.course
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/resource/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.resource_update_get = function(req, res) {
    var requestOptions, path;
    path = '/api/resource/' + req.params.id + '/update';
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
                        res.render('resource-form', {title:'Studela', courses:body.courses, resource:body.resource})
                    } else {
                            _showError(req, res, response.statusCode);
                    }
            }
    )
};
module.exports.resource_update_post = function(req, res) {
    var requestOptions, path, postdata;
    path = "/api/resource/" + req.params.id + "/update";
    postdata = {
        resource_name: req.body.resource_name,
        resource_desc: req.body.resource_desc,
        resource_details: req.body.resource_details,
        course: req.body.course
    };
    requestOptions = {
        url:apiOptions.server + path,
        method: "POST",
        json:postdata
    };
    request (
        requestOptions, function (err, response, body){
            if (response.statusCode ===201){
                res.redirect ('/resource/' + body._id);
            } else {
                _showError (req, res, response.statusCode);
            }
        }
    );
};
module.exports.resource_delete_get = function(req, res) {
    getResourceDetails(req, res, function(req, res, details) {
        res.render('resource-delete', {
            title: 'Studela',
            resource: details.resource,
        })
    })
};
module.exports.resource_delete_post = function(req, res) {
    var requestOptions, path, id;
    id = req.params.id;
    path = "/api/resource/" + id + "/delete";
   requestOptions = {
       url:apiOptions.server + path,
       method: "POST",
       json:{}
   };
   request (
       requestOptions, function (err, response, body){
           if (response.statusCode ===204){
               res.redirect ('/resources');
           } else {
               _showError (req, res, response.statusCode);
           }
       }
   ); 
};