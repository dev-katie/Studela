var express = require('express');
var router = express.Router();

var ctrlFaculty = require('../controllers/facultyController');
var ctrlDepartment = require('../controllers/departmentController');
var ctrlCourse = require('../controllers/courseController');
var ctrlResource = require('../controllers/resourceController');

/* GET home page. */
router.get('/', ctrlFaculty.index);

/// FACULTY ROUTES ///

router.get('/faculty/create', ctrlFaculty.faculty_create_get);
router.post('/faculty/create', ctrlFaculty.faculty_create_post);
router.get('/faculty/:id/delete', ctrlFaculty.faculty_delete_get);
router.post('/faculty/:id/delete', ctrlFaculty.faculty_delete_post);
router.get('/faculty/:id/update', ctrlFaculty.faculty_update_get);
router.post('/faculty/:id/update', ctrlFaculty.faculty_update_post);
router.get('/faculty/:id', ctrlFaculty.faculty_detail);
router.get('/faculties', ctrlFaculty.faculty_list);

/// DEPT ROUTES ///

router.get('/department/create', ctrlDepartment.department_create_get);
router.post('/department/create', ctrlDepartment.department_create_post);
router.get('/department/:id/delete', ctrlDepartment.department_delete_get);
router.post('/department/:id/delete', ctrlDepartment.department_delete_post);
router.get('/department/:id/update', ctrlDepartment.department_update_get);
router.post('/department/:id/update', ctrlDepartment.department_update_post);
router.get('/department/:id', ctrlDepartment.department_detail);
router.get('/departments', ctrlDepartment.department_list);

 /// COURSE ROUTES ///

router.get('/course/create', ctrlCourse.course_create_get);
router.post('/course/create', ctrlCourse.course_create_post);
router.get('/course/:id/delete', ctrlCourse.course_delete_get);
router.post('/course/:id/delete', ctrlCourse.course_delete_post);
router.get('/course/:id/update', ctrlCourse.course_update_get);
router.post('/course/:id/update', ctrlCourse.course_update_post);
router.get('/course/:id', ctrlCourse.course_detail);
router.get('/courses', ctrlCourse.course_list);

 /// RESOURCE ROUTES ///

router.get('/resource/create', ctrlResource.resource_create_get);
router.post('/resource/create', ctrlResource.resource_create_post);
router.get('/resource/:id/delete', ctrlResource.resource_delete_get);
router.post('/resource/:id/delete', ctrlResource.resource_delete_post);
router.get('/resource/:id/update', ctrlResource.resource_update_get);
router.post('/resource/:id/update', ctrlResource.resource_update_post);
router.get('/resource/:id', ctrlResource.resource_detail);
router.get('/resources', ctrlResource.resource_list);


module.exports = router;
