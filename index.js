var cluster = require('cluster'); 
var numCPUs = require('os').cpus().length; 
var express = require('express');

var app = express();




// app.get('/', function(req, res) {
// 	res.send("Number of processors: "+numCPUs);
// 	//res.json(numCPUs);
// });

// var cluster_isMaster = cluster.isMaster;
// console.log('Master: ' + cluster_isMaster);



if (cluster.isMaster) {  
    for (var i = 0; i < numCPUs; i++) {
        // Create a worker
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    // Workers share the TCP connection in this server
    var app = express();

    console.log(`Worker ${process.pid} started and finished`);

    

    // All workers use this port
    app.listen(8080);
}

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


    var user_uuid = 0; // this is fake number yet :)

    var user_info = [
        { 'User-Agent': user_ua },
        { "User-IP": user_ip },
        { uuid: user_uuid },
    ]; 

        
        
        res.json(user_info);
    });
