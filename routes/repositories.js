var pg = require('pg');
var path = require('path');

var conString = "postgres://yqfrgfwebgjeby:0b40cae17f0905ff8080cd0b4985b2bb8fab9a10fa6776cb77ae270204acf549@ec2-50-17-201-204.compute-1.amazonaws.com:5432/dbr7k1utsb8hb3";

exports.index = function(req, res){
    res.render('index');
};
exports.add = function(req, res){
    res.render('addstudent', {message : null});
};



exports.list = function(req, res){
  pg.connect(conString, function (err, con, done) {

       
     con.query('SELECT * FROM student',function(err,rows)     {
        console.log(rows);
            
        if(err)
           console.log("Error Selecting : %s ",err );
        else{
          res.send(JSON.parse(JSON.stringify(rows.rows)));
        }        
                           
        });       
    });
  
};

exports.edit = function(req, res){
  var id = req.body.id; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE id = ' + id;
     con.query(sql,function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            else
              res.render('viewstudent',{page_title:"View Student",data: rows.rows});                           
         });
                 
    }); 
};
