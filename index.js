var express = require('express');
var http = require('http');
var path = require('path');

//load students route
var students = require('./routes/repositories'); 
var session = require('express-session');
var app = express();

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'AdeyemoAdeoluwaUCA'}));

app.get('/', students.index);
app.get('/portal', students.portal);
app.get('/index', students.index); 
app.get('/logout', students.logout);

app.post('/authenticate', students.authenticate);
app.post('/search', students.search);
app.post('/attended', students.attended);


//Android Consumption
app.post('/queue', students.queue);
app.post('/booking', students.booking);
app.get('/queue', students.queue);
app.get('/booking', students.booking);
app.post('/searchbooking', students.attended);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});