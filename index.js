var express = require('express');
var http = require('http');
var path = require('path');

//load students route
var students = require('./routes/repositories'); 
var app = express();

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', students.index);
app.get('/portal', students.add);
app.get('/index', students.index); 

app.post('/authenticate', students.list);
app.post('/bookings', students.save);
app.post('/search', students.save);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});