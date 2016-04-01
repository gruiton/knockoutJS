var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('goaltracker', ['goals']);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
	res.send('It Works!');
});

app.get('/goals', function(req, res){	
	db.goals.find(function(err, docs){
		if(err){
			res.send(err);
		} else{
			console.log('Getting Goals...');
			res.json(docs);
		}
	});
});

app.post('/goals', function(req, res){
	db.goals.insert(req.body, function(err, docs){
		if(err){
			res.send(err);
		} else{
			console.log('Adding Goals...');
			res.json(docs);
		}
	});
});

app.post('/goals/:id', function(req, res){
	db.goals.findAndModify({
		query: {_id: mongojs.ObjectId(req.params.id)}, 
		update: { 
			$set: {
				name: req.body.name,
				type: req.body.type,
				deadline: req.body.deadline
			}
		},
		new: true
	},
	function(err, docs){
		if(err){
			console.log("update: " + err);
			res.send(err);
		} else{
			console.log('Updating Goals...');
			res.json(docs);
		}
	})
});

app.post('/goals/:id', function(req, res){
	db.goals.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, docs){
		if(err){
			console.log("delete: " + err);
			res.send(err);
		} else{
			console.log('Removing Goals...');
			res.json(docs);
		}
	});
});

app.listen(3000);
console.log('Running on port 3000...');