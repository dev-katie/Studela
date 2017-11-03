var mongoose = require ('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/Studela';
if (process.env.NODE_ENV === 'production'){
    //dbURI = 'mongodb://katie:katie@ds149724.mlab.com:49724/loca8r';
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error '+ err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//for nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//for app termination
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

//for heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

require('./courses');
require('./faculties');
require('./departments');
require('./resources');


