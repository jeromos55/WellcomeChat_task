var cluster = require('cluster'); 
var numCPUs = require('os').cpus().length; 
var express = require('express');

var app = express();


if (cluster.isMaster) {  
    for (var i = 0; i < numCPUs; i++) {
        // Create a worker
        console.log('Forking process number '+i+'...');
        cluster.fork();
    }
} else {

    // Workers share the TCP connection in this server
    var app = express();

    console.log('Worker '+process.pid+' started and finished');

    // All workers use this port
    app.listen(3000);
}
    // restarting worker if died 
cluster.on('exit', function(worker, code, signal) {  
    console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
    cluster.fork();
});



app.get('/', function (req, res) {

    var user_ua = req.headers['user-agent'];
    var user_ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress;
    var worker_pid = process.pid;
    var worker_id = cluster.worker.id;

    var user_info = {
        User_Agent: user_ua,
        User_IP: user_ip ,
        Worker_process_id: worker_pid,
        Worker_id: worker_id,
    }; 
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user_info, null, 3));

    });
