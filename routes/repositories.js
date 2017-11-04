var pg = require('pg');
var path = require('path');
var session = require('express-session');
var sess;

var conString = "postgres://iegknwvdcghvhk:1af24d4dab8c65a68d000915223da5fa2c2e173325d5a260a005101616023cf6@ec2-54-83-48-188.compute-1.amazonaws.com:5432/d1p72638a6lg0q";

exports.index = function(req, res){
	sess = req.session;
	if(sess.username) 
		redirect('portal')
	else		
    	res.render('index', {message : req.message == null ? "" : req.message });
};
exports.portal = function(req, res){
	sess = req.session;
	if(sess.username) {

	pg.connect(conString, function (err, con, done) {       
     con.query('SELECT * FROM student WHERE attended = 0 &&  arrival_time >= now()',function(err,rows)     {
        console.log(rows);            
        if(err)
           console.log("Error Selecting : %s ",err );
        else{
        	res.render('portal', {message : JSON.parse(JSON.stringify(rows.rows)) });
        }        
                           
        });       
    });

	}
	else {
	    res.redirect('index');
	}
    
};





exports.authenticate = function(req, res){
  var username = req.body.username;
  var password = req.body.password; 
  sess = req.session;

  if(username == "admin" && password == "12345678" ){
  	  sess.username= username
      res.redirect('portal');
  }
  else
      res.render('index', {message : "Invalid username / password"});               
  
};

exports.search = function(req, res){
  var id = req.body.search_term; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE attended = 0 &&  arrival_time >= now() && verification_code like %'+ id + '% or card_no like &' + id + '& ';
     con.query(sql,function(err,rows)
        {            
            if(err)
                console.log("Error Selecting : %s ",err );
            else
              res.render('portal', {message : JSON.parse(JSON.stringify(rows.rows)) });                         
         });
                 
    }); 
};

exports.logout = function(req, res){
  req.session.destroy(function(err) {
  if(err) 
    console.log(err);
   else 
    res.redirect('index');  
  }); 
  
};


//Android Consumption
exports.attended = function(req, res){
  var id = req.body.id; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = "Update student set attended = 1 WHERE verification_code = '" + id + "'" ;
     con.query(sql,function(err,rows)
        {            
            if(err)
                console.log("Error Selecting : %s ",err );
            else
              res.redirect('portal');
         });
                 
    }); 
};

exports.queue = function(req, res){
  var id = req.body.id; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE attended = 0 &&  arrival_time >= now()';
     con.query(sql,function(err,rows)
      {            
          if (err){
            console.log(err);
            res.send( {responseDescription: err , responseCode : "-01"});       
         }
         else
            res.send( {responseDescription: rows , responseCode : "00"});                      
      });
                 
    }); 
};


exports.booking = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));    
    
    pg.connect(conString, function (err, con, done) {

        var sql ="INSERT INTO student (id,verification_code,card_no,phone_no,attended,arrival_time) values( DEFAULT,'"+input.verification_code+"', '"+input.card_no +"','"+input.phone_no+"', 0, now() )";
        var query = con.query(sql, function(err, rows)
        {  
         if (err){
            console.log(err);
            res.send( {responseDescription: err , responseCode : "-01"});       
         }
         else
            res.send( {responseDescription:"Record Inserted Successfully!", responseCode : "00"});       
        });
        
    
    });
};

exports.searchbooking = function(req, res){
  var id = req.body.id; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE attended = 0 &&  arrival_time >= now() && verification_code like %'+ id + '% or card_no like &' + id + '& ';
     con.query(sql,function(err,rows)
     {            
            if (err){
            console.log(err);
            res.send( {responseDescription: err , responseCode : "-01"});       
         }
         else
            res.send( {responseDescription: rows, responseCode : "00"});                         
     });
                 
    }); 
};