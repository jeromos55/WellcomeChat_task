var cluster = require('cluster'); 
var numCPUs = require('os').cpus().length; 
var express = require('express');
//var app = express();



var user_info = [
	{ id: 1 },
	{ ua: 1234 },
	{ ip: 1234 },
	{ uuid: 1234 },
]; 


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

    app.get('/', function (req, res) {
        res.send(user_info);
        //res.send("Number of processors: "+numCPUs);
    });

    // All workers use this port
    app.listen(8080);
}

cluster.on('exit', function(worker, code, signal) {  
    console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
    cluster.fork();
});


// app.listen(3000, function(){
// 		console.log('Listening on port 3000...');
// });