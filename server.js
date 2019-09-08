
var port = process.env.PORT || 8080;
// var dbusername = process.env.DBUSERNAME;
// var dbpassword = process.env.DBPASSWORD;
// var dbnumber = process.env.DBNUMBER;
// var dbname = process.env.DBNAME;



const mongoose = require('mongoose');

// const url = 'mongodb://' + dbusername + ':' + dbpassword + '@ds1' + dbnumber + '.mlab.com:' + dbnumber + '/' + dbname;
const url = 'mongodb://Kostas23:Corazon2393@ds159216.mlab.com:59216/testcrypto4';


const express = require('express');
const async  = require('async');
const bodyparser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Schema = mongoose.Schema;

const app = express();


app.set('view engine', 'ejs');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set(('views', path.join(__dirname, 'views')));

var sess;

setInterval(function () {
  var shell = require('shelljs');
  shell.exec("python downloadcryptos.py", function (code, stdout, stderr) {
    console.log(stderr);

    strArr = stdout.split('\n');
    strArr2 = strArr.splice(0, 3);
    strArr.forEach(function (item) {
    })

  })
}, 
1000 * 60 * 60 * 24 * 7);
// 70000);



app.get('/', function (req, res) {
  res.render('index');
})



app.get('/prices', function (req, res) {
  sess = req.session;
  if (sess.crypto || sess.crypto == "") {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.collection(sess.crypto, function (err, collection) {
        if (err) throw err;
        collection.find({}).sort({ title: 1 }).toArray(function (err, result) {



          if (err) throw err;
          var monthyears = [];
          var years = [];
          result.forEach(function (item) {
            monthyears.push({ year: item.title.substring(0, 4), month: item.title.substring(5, 7) });
          })
          monthyears.forEach(function (item) {
            if (!years.includes(item.year)) {
              years.push(item.year);
            }
          })
          console.log(result);
          res.render('crypto', { data: monthyears, years: years, crypto: sess.crypto, cryptonames: sess.cryptos });
          result.forEach(function (item) {
          })
          db.close();
        });
      });
    });
  }
  else {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.listCollections().toArray(function (err, result) {
        if (err) throw err;
        var cr = [];
        result.forEach(function (item) {
          if (!item.name.toString().includes("system")) {
            cr.push(item.name);
          }
        })
        cr.forEach(function (item) {
        })

        res.render('crypto', { cryptonames: cr, data: '' });
        result.forEach(function (item) {
        })
        db.close();
      });

    });
  }
});

app.post('/prices', function (req, res) {
  sess = req.session;
  sess.crypto = req.body.crypto;
  sess.cryptos = req.body.cryptos;
  res.end('done');
})

app.get('/dates', function (req, res) {
  sess = req.session;
  if (sess.aggregation == "max") {
    if(sess.monthtitle.includes("/")){


    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    res.render('dates', { data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }else{
    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    console.log(sess.resultArray);
    res.render('everydates', { graphData: sess.graphData,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }
  } else {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.collection(sess.crypto, function (err, collection) {
        if (err) throw err;
        if(sess.monthtitle.includes("/")){
        // collection.find({ 'title': sess.monthtitle }).toArray(function (err, result) {
        //   if (err) throw err;
        //   datesArr = [];
        //   // console.log(result);
        //   result.forEach(function (item) {
        //     item.dates.forEach(function (item2) {
        //       // item2.date.setDate(item2.date.getDate()-1);
        //       datesArr.push(item2);

        //     })
        //   })
        //   sess.result = datesArr;
          collection.aggregate([
            {'$match':{'title': sess.monthtitle}},
            {'$unwind':'$dates'},
            {'$project':
              { 'date':'$dates.date',
              'high':'$dates.high',
              'open':'$dates.open',
              'close':'$dates.close',
              'low':'$dates.low',
              'volume':'$dates.volume',
              'marketcap' : '$dates.marketcap',
              'highlow': {'$subtract':['$dates.high','$dates.low']},
              'openclose': {'$subtract':['$dates.open','$dates.close']}
            }
          }
            
          ]).toArray(function(err,aggreRes){
            console.log(aggreRes);

            sess.result = aggreRes;
            res.render('dates', { data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text });
          db.close();
          })
          // console.log(sess.result);
          // res.render('dates', { data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text });
          // db.close();
        // });
      }else{
        // collection.find({ 'title': { "$regex": sess.monthtitle, "$options": "i" } }).sort({'title':1}).toArray(function (err, result) {
        //   if (err) throw err;
        //   datesArr = [];
        //   // console.log(result);
        //   result.forEach(function (item) {
        //     item.dates.forEach(function (item2) {
        //       // item2.date.setDate(item2.date.getDate()-1);
        //       if(item2.marketcap==""){
        //         item2.marketcap=0;
        //       }
              
        //       datesArr.push(item2);

        //     })
        //   })
        //   sess.result = datesArr;
          // console.log(avghighs);
          // console.log(sess.result);
        //   console.log(sess.monthtitle);
        collection.aggregate([
          {'$match':{ 'title': { "$regex": sess.monthtitle, "$options": "i" } }},
          {'$unwind':'$dates'},
          {'$project':
            { 'date':'$dates.date',
            'high':'$dates.high',
            'open':'$dates.open',
            'close':'$dates.close',
            'low':'$dates.low',
            'volume':'$dates.volume',
            'marketcap' : '$dates.marketcap',
            'highlow': {'$subtract':['$dates.high','$dates.low']},
            'openclose': {'$subtract':['$dates.open','$dates.close']}
          }
        }
          
        ]).sort({"_id.month":1}).toArray(function(err,aggreRes){
          console.log(aggreRes);

          sess.result = aggreRes;
          collection.aggregate([
            { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
            {"$unwind":"$dates"},
            { "$group": {
              "_id": { 
                  "year": { "$year": "$dates.date" },
                  "month": { "$month": "$dates.date" }
              },
              "high": { "$avg": "$dates.high"  },
              "open": { "$avg": "$dates.open"},
              "close": {"$avg":"$dates.close"},
              "low": {"$avg":"$dates.low"},
              "volume": {"$avg":"$dates.volume"},
              "cap": {"$avg":"$dates.marketcap"},
              'highlow': {'$avg':{'$subtract':['$dates.high','$dates.low']}},
              'openclose': {'$avg':{'$subtract':['$dates.open','$dates.close']}}
          }}

        ]).sort({"_id.month":1}).toArray(function(err,result1){
          console.log(result1);
          sess.graphData = result1;
          res.render('everydates', { graphData:sess.graphData,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});

        });

          // res.render('everydates', { graphData:sess.graphData,allData : sess.resultArray,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});
          db.close();
        });
      }
      });
    });

  }
})

app.post('/dates', function (req, res) {
  sess = req.session;
  sess.monthtitle = req.body.title;
  sess.aggregation = '';
  sess.dates = '';
  res.end('done');
})

app.post('/aggre', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;

  if (sess.aggregation == 'max') {


    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, max: { $max: {$subtract: col}} } },
            { $project: { max: 1, _id: 0 } }
            
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.max;
            })
            res.end('done');
          });
        });
      });
    
      

    }else{
      var col = '$dates.' + req.body.column;

      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, max: { $max: col } } },
            { $project: { max: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.max;
            })
            res.end('done');
          });
        });
      });
    }
  } else if (sess.aggregation == 'min') {

    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, max: { $max: {$subtract: col}} } },
            { $project: { max: 1, _id: 0 } }
            
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.max;
            })
            res.end('done');
          });
        });
      });
    
      

    }else{
      var col = '$dates.' + req.body.column;

      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, min: { $min: col } } },
            { $project: { min: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.min;
            })
            res.end('done');
          });
        });
      });
    }
  } else {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, avg: { $avg: {$subtract: col}} } },
            { $project: { avg: 1, _id: 0 } }
            
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.avg;
            })
            res.end('done');
          });
        });
      });
    
      

    }else{
      var col = '$dates.' + req.body.column;

      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        mongoose.connection.db.collection(sess.crypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.monthtitle } },
            { $unwind: '$dates' },
            { $group: { _id: null, avg: { $avg: col } } },
            { $project: { avg: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
  
            arrRes.forEach(function (item) {
              sess.dates = item.avg;
            })
            res.end('done');
          });
        });
      });
    }
  }
})

app.post('/aggreeverydate', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;


          
          if (sess.aggregation == 'max') {


            if(sess.column.includes("/")){
              var columns = sess.column.split("/");
              var col = [];
              columns.forEach(function(item){
                col.push("$dates." + item);
              })
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, max: { $max: {$subtract: col}} } },
                    { $project: { max: 1, _id: 0 } }
                    
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.max;
                    })
                    res.end('done');
                  });
                });
              });
            
              
        
            }else{
              var col = '$dates.' + req.body.column;
        
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, max: { $max: col } } },
                    { $project: { max: 1, _id: 0 } }
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.max;
                    })
                    res.end('done');
                  });
                });
              });
            }
          } else if (sess.aggregation == 'min') {
        
            if(sess.column.includes("/")){
              var columns = sess.column.split("/");
              var col = [];
              columns.forEach(function(item){
                col.push("$dates." + item);
              })
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, max: { $max: {$subtract: col}} } },
                    { $project: { max: 1, _id: 0 } }
                    
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.max;
                    })
                    res.end('done');
                  });
                });
              });
            
              
        
            }else{
              var col = '$dates.' + req.body.column;
        
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, min: { $min: col } } },
                    { $project: { min: 1, _id: 0 } }
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.min;
                    })
                    res.end('done');
                  });
                });
              });
            }
          } else {
            if(sess.column.includes("/")){
              var columns = sess.column.split("/");
              var col = [];
              columns.forEach(function(item){
                col.push("$dates." + item);
              })
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, avg: { $avg: {$subtract: col}} } },
                    { $project: { avg: 1, _id: 0 } }
                    
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.avg;
                    })
                    res.end('done');
                  });
                });
              });
            
              
        
            }else{
              var col = '$dates.' + req.body.column;
        
              mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
          
                mongoose.connection.db.collection(sess.crypto, function (err, collection) {
                  if (err) throw err;
                  collection.aggregate([
                    { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
                    { $unwind: '$dates' },
                    { $group: { _id: null, avg: { $avg: col } } },
                    { $project: { avg: 1, _id: 0 } }
          
                  ]).toArray(function (err, arrRes) {
          
                    arrRes.forEach(function (item) {
                      sess.dates = item.avg;
                    })
                    res.end('done');
                  });
                });
              });
            }
          }
})

app.get('/datasets', function (req, res) {
  sess = req.session;
  if (sess.dataset || sess.dataset == "") {

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.find({}).sort({ title: 1 }).toArray(function (err, result) {
          if (err) throw err;
          var monthyears = [];
          var years = [];
          result.forEach(function (item) {
            monthyears.push({ year: item.title.substring(0, 4), month: item.title.substring(5, 7) });
          })
          monthyears.forEach(function (item) {
            if (!years.includes(item.year)) {
              years.push(item.year);
            }
          })
          res.render('datasets', { data: monthyears, years: years, crypto: sess.dataset });
          result.forEach(function (item) {
          })
          db.close();
        });

      });

    });



  }
  else {

    res.render('datasets', { data: '', crypto: '' });

  }
});

app.post('/datasets', function (req, res) {
  sess = req.session;
  sess.dataset = req.body.crypto;

  res.end('done');
})

app.get('/ethdatasetdates', function (req, res) {
  sess = req.session;
  if (sess.aggregation == "max") {
    if(sess.monthtitle.includes("/")){


    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    res.render('ethdatasetdates', { data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }else{
    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    console.log(sess.resultArray);
    res.render('ethdataseteverydates', { graphData: sess.graphData,data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }
  } else {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        if(sess.monthtitle.includes("/")){
        collection.find({ 'title': sess.monthtitle }).toArray(function (err, result) {
          if (err) throw err;
          datesArr = [];
          // console.log(result);
          result.forEach(function (item) {
            item.dates.forEach(function (item2) {
              // item2.date.setDate(item2.date.getDate()-1);
              datesArr.push(item2);

            })
          })
          sess.result = datesArr;
          res.render('ethdatasetdates', { data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text });
          db.close();
        });
      }else{
        collection.find({ 'title': { "$regex": sess.monthtitle, "$options": "i" } }).sort({'title':1}).toArray(function (err, result) {
          if (err) throw err;
          datesArr = [];
          // console.log(result);
          result.forEach(function (item) {
            item.dates.forEach(function (item2) {
              // item2.date.setDate(item2.date.getDate()-1);
              if(item2.marketcap==""){
                item2.marketcap=0;
              }
              
              datesArr.push(item2);

            })
          })
          sess.result = datesArr;
          // console.log(avghighs);
          // console.log(sess.result);
        //   console.log(sess.monthtitle);
          collection.aggregate([
            { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
            {"$unwind":"$dates"},
            { "$group": {
              "_id": { 
                  "year": { "$year": "$dates.date" },
                  "month": { "$month": "$dates.date" }
              },
              "unixtimestamp": { "$avg": "$dates.unixtimestamp"  },
              "etherprice": { "$avg": "$dates.etherprice"},
              "tx": {"$avg":"$dates.tx"},
              "address": {"$avg":"$dates.address"},
              "supply": {"$avg":"$dates.supply"},
              "marketcap": {"$avg":"$dates.marketcap"},
              "hashrate": {"$avg":"$dates.hashrate"},
              "difficulty": {"$avg":"$dates.difficulty"},
              "blocks": {"$avg":"$dates.blocks"},
              "uncles": {"$avg":"$dates.uncles"},
              "blocksize": {"$avg":"$dates.blocksize"},
              "blocktime": {"$avg":"$dates.blocktime"},
              "gasprice": {"$avg":"$dates.gasprice"},
              "gaslimit": {"$avg":"$dates.gaslimit"},
              "gasused": {"$avg":"$dates.gasused"},
              "ethersupply": {"$avg":"$dates.ethersupply"},
              "ensregister": {"$avg":"$dates.ensregister"}
          }}

        ]).sort({"_id.month":1}).toArray(function(err,result1){
          console.log(result1);
          sess.graphData = result1;
          res.render('ethdataseteverydates', { graphData:sess.graphData,data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});

        });

          // res.render('everydates', { graphData:sess.graphData,allData : sess.resultArray,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});
          db.close();
        });
      }
      });
    });

  }
})

app.post('/ethdatasetdates', function (req, res) {
  sess = req.session;
  sess.monthtitle = req.body.title;
  sess.aggregation = '';
  sess.dates = '';
  res.end('done');
})

app.get('/bitdatasetdates', function (req, res) {
  sess = req.session;
  if (sess.aggregation == "max") {
    if(sess.monthtitle.includes("/")){


    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    res.render('bitdatasetdates', { data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }else{
    sess.result.forEach(function (item) {
      item.date = new Date(item.date);
    })
    console.log(sess.resultArray);
    res.render('bitdataseteverydates', { graphData: sess.graphData,data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column , text:sess.text });
  }
  } else {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        if(sess.monthtitle.includes("/")){
        collection.find({ 'title': sess.monthtitle }).toArray(function (err, result) {
          if (err) throw err;
          datesArr = [];
          // console.log(result);
          result.forEach(function (item) {
            item.dates.forEach(function (item2) {
              // item2.date.setDate(item2.date.getDate()-1);
              datesArr.push(item2);

            })
          })
          sess.result = datesArr;
          res.render('bitdatasetdates', { data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text });
          db.close();
        });
      }else{
        collection.find({ 'title': { "$regex": sess.monthtitle, "$options": "i" } }).sort({'title':1}).toArray(function (err, result) {
          if (err) throw err;
          datesArr = [];
          // console.log(result);
          result.forEach(function (item) {
            item.dates.forEach(function (item2) {
              // item2.date.setDate(item2.date.getDate()-1);
              if(item2.marketcap==""){
                item2.marketcap=0;
              }
              
              datesArr.push(item2);

            })
          })
          sess.result = datesArr;
          // console.log(avghighs);
          // console.log(sess.result);
        //   console.log(sess.monthtitle);
          collection.aggregate([
            { $match: {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
            {"$unwind":"$dates"},
            { "$group": {
              "_id": { 
                  "year": { "$year": "$dates.date" },
                  "month": { "$month": "$dates.date" }
              },
              "marketprice": { "$avg": "$dates.marketprice"  },
              "totalbitcoins": { "$avg": "$dates.totalbitcoins"},
              "marketcap": {"$avg":"$dates.marketcap"},
              "tradevolume": {"$avg":"$dates.tradevolume"},
              "blockssize": {"$avg":"$dates.blockssize"},
              "avgblocksize": {"$avg":"$dates.avgblocksize"},
              "norphanedblocks": {"$avg":"$dates.norphanedblocks"},
              "ntransactionsperblock": {"$avg":"$dates.ntransactionsperblocks"},
              "medianconfirmationtime": {"$avg":"$dates.medianconfirmationtime"},
              "hashrate": {"$avg":"$dates.hashrate"},
              "difficulty": {"$avg":"$dates.difficulty"},
              "minersrevenue": {"$avg":"$dates.minersrevenue"},
              "transactionfees": {"$avg":"$dates.transactionfees"},
              "costpertransactionpercent": {"$avg":"$dates.costpertransactionpercent"},
              "costpertransaction": {"$avg":"$dates.costpertransaction"},
              "nuniqueaddresses": {"$avg":"$dates.nuniqueaddresses"},
              "ensregister": {"$avg":"$dates.ensregister"},
              "ntransactions": {"$avg":"$dates.ntransactions"},
              "ntransactionstotal": {"$avg":"$dates.ntransactionstotal"},
              "ntransactionsexludingpopular": {"$avg":"$dates.ntransactionsexludingpopular"},
              "ntransactionsexludingchainslongerthan1000": {"$avg":"$dates.ntransactionsexludingchainslongerthan1000"},
              "outputvolume": {"$avg":"$dates.outputvolume"},
              "estimatedtransactionvolume": {"$avg":"$dates.estimatedtransactionvolume"},
              "estimatedtransactionvolumeusd": {"$avg":"$dates.estimatedtransactionvolumeusd"}
          }}

        ]).sort({"_id.month":1}).toArray(function(err,result1){
          console.log(result1);
          sess.graphData = result1;
          res.render('bitdataseteverydates', { graphData:sess.graphData,data: sess.result, crypto: sess.dataset, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});

        });

          // res.render('everydates', { graphData:sess.graphData,allData : sess.resultArray,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});
          db.close();
        });
      }
      });
    });

  }
})

app.post('/bitdatasetdates', function (req, res) {
  sess = req.session;
  sess.monthtitle = req.body.title;
  sess.aggregation = '';
  sess.dates = '';
  res.end('done');
})

app.post('/dataseteveryaggre', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;

  if (sess.aggregation == 'max') {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match:  {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
          { $unwind: '$dates' },
          { $group: { _id: null, max: { $max: col } } },
          { $project: { max: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {


          arrRes.forEach(function (item) {
            sess.dates = item.max;
          })
          res.end('done');
        });
      });
    });
  } else if (sess.aggregation == 'min') {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match:  {'title': { "$regex": sess.monthtitle, "$options": "i" } }},
          { $unwind: '$dates' },
          { $group: { _id: null, min: { $min: col } } },
          { $project: { min: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.min;
          })
          res.end('done');
        });
      });
    });
  } else {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match:  {'title': { "$regex": sess.monthtitle, "$options": "i" } } },
          { $unwind: '$dates' },
          { $group: { _id: null, avg: { $avg: col } } },
          { $project: { avg: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.avg;
          })
          res.end('done');
        });
      });
    });
  }
})
app.post('/datasetaggre', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;

  if (sess.aggregation == 'max') {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match: { 'title': sess.monthtitle } },
          { $unwind: '$dates' },
          { $group: { _id: null, max: { $max: col } } },
          { $project: { max: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {


          arrRes.forEach(function (item) {
            sess.dates = item.max;
          })
          res.end('done');
        });
      });
    });
  } else if (sess.aggregation == 'min') {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match: { 'title': sess.monthtitle } },
          { $unwind: '$dates' },
          { $group: { _id: null, min: { $min: col } } },
          { $project: { min: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.min;
          })
          res.end('done');
        });
      });
    });
  } else {

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      mongoose.connection.db.collection(sess.dataset, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match: { 'title': sess.monthtitle } },
          { $unwind: '$dates' },
          { $group: { _id: null, avg: { $avg: col } } },
          { $project: { avg: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.avg;
          })
          res.end('done');
        });
      });
    });
  }
})



app.post('/comparison',function(req,res){
  sess = req.session;
  // sess.cryptos = req.body.cryptonames;
  sess.compcryptos = req.body.cryptos;
  console.log(sess.compcryptos);
  // sess.aggregation = '';
  // sess.dates = '';
  res.end('done');
})


app.get('/comparison',function(req,res){
  sess = req.session;
  var monthObject = {names:[]};
  var months = [];
  var years = [];
  if (sess.compcryptos || sess.compcryptos == "") {
    function fullfilPromise(){

    
    return new Promise(function(resolve,reject){


    mongoose.connect(url, { useNewUrlParser: true }, async function (err, db) {
      if (err) throw err;
      // await sess.compcryptos.asyncForEach(async function(eachcrypto){
        async.each(sess.compcryptos,function(eachcrypto,next){
      console.log(eachcrypto);
      monthObject.names.push({title:eachcrypto,months:[]});
      mongoose.connection.db.collection(eachcrypto).find({}).sort({ title: 1 }).toArray(function (err, result) {
          if (err) throw err;
          var monthyears = [];
          // var years = [];
          result.forEach(function (item) {
            monthyears.push({ year: item.title.substring(0, 4), month: item.title.substring(5, 7), dates:item.dates });
            // console.log( item.title.substring(0, 4) +"/"+ item.title.substring(5, 7))
          })
          monthyears.forEach(function (item) {
            // if (!years.includes(item.year)) {
            //   years.push(item.year);
            // }
            monthObject.names.forEach(function(name){
              console.log(name.title+" - "+ eachcrypto);
              if(name.title==eachcrypto){

                console.log(item);
                name.months.push(item);
              }
            })
          })
          console.log(monthObject);
          next();
          // resolve(monthObject);
          
      
        
        });
      
    },function(error){
      console.log(monthObject);
      var sooner = {year:monthObject.names[0].months[0].year,month:monthObject.names[0].months[0].month,date:monthObject.names[0].months[0].dates[0].date.getDate()};
      console.log(sooner);
      monthObject.names.forEach(function(name){
        if(sooner.year < name.months[0].year){
          sooner.year  = name.months[0].year;
          sooner.month = name.months[0].month;
          sooner.date = name.months[0].dates[0].date.getDate();
        }else if(sooner.year == name.months[0].year){
          if(sooner.month < name.months[0].month){
            sooner.month = name.months[0].month;
            sooner.date = name.months[0].dates[0].date.getDate();
          }else if(sooner.month == name.months[0].month){
            if(sooner.date < name.months[0].dates[0].date.getDate()){
              sooner.date = name.months[0].dates[0].date.getDate();
            }
          }         

        }
        console.log(name.months[0].dates[0].date.getDate()+"/"+name.months[0].month+"/"+name.months[0].year);
      })
      console.log("Sooner for all: " + sooner.date+"/"+sooner.month+"/"+sooner.year);

      sess.soonerDate = sooner;
      monthObject.names[0].months.forEach(function(month){
          if(month.year ==sooner.year && month.month>=sooner.month){
              months.push({year:month.year,month:month.month});
              if(!years.includes(month.year)){
                years.push(month.year);
              }
            
          }else if(month.year >sooner.year){
            months.push({year:month.year,month:month.month});
            if(!years.includes(month.year)){
              years.push(month.year);
            }
          }
        })

      
      
      months.forEach(function(eachmonth){
        // console.log("Month: " + eachmonth.month+"/"+eachmonth.year);
      })
         res.render('comparison', {years:years, data:months,monthObject:monthObject, crypto: sess.compcryptos, cryptonames: sess.cryptos});
    });
    resolve(monthObject);
 
    // db.close();
    db.close();
    })
    // mongoose.connection.close();
  }) 
};

  fullfilPromise().then(function(result){
    console.log("------------");
    console.log(result);  
  });
    
  


  
  // .then(function(){
  //     monthObject.names.forEach(function(name){
  //       console.log(name.title);
  //       console.log("--------------");
  //       name.months.forEach(function(month){
  //         console.log(month);
  //       })

  //     })
  //   });
  }
  else {
    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      mongoose.connection.db.listCollections().toArray(function (err, result) {
        if (err) throw err;
        var cr = [];
        result.forEach(function (item) {
          if (!item.name.toString().includes("system")) {
            cr.push(item.name);
          }
        })
        // cr.forEach(function (item) {
        // })
        sess.cryptos =cr;
        console.log(sess.cryptos);
        res.render('comparison', { cryptonames: cr, data: '' ,crypto:[]});
        result.forEach(function (item) {
        })
        
      });
      db.close();
    });
    // mongoose.connection.close();
  }
})

app.post("/comparisondates",function(req,res){
  sess = req.session;
  sess.aggregation = '';
    sess.compcryptos = req.body.cryptos;
  sess.compmonth = req.body.month;
  res.end('done');
})

app.get("/comparisondates",function(req,res){
  sess = req.session;
  var compresults = [];
  if (sess.aggregation == "max" || sess.aggregation == "min" || sess.aggregation == "avg") {
    if(sess.compmonth.includes("/")){
    console.log(sess.dataForTable);
    sess.dataForTable.forEach(function (item) {
      item.date = new Date(item.date);
    })
    res.render("comparisondates",{compcryptos:sess.compcryptos,compmonth:sess.compmonth,compcolumns:sess.compcolumns,compresults:compresults,dataForTable:sess.dataForTable,aggreRes:sess.aggreRes, aggregation: sess.aggregation, column: sess.column,text:sess.text});
  }else{
    console.log(sess.dataForTable);
    sess.dataForTable.forEach(function (item) {
      item.date = new Date(item.date);
    })
    res.render("comparisoneverydates",{graphData:sess.graphData,compcryptos:sess.compcryptos,compmonth:sess.compmonth,compcolumns:sess.compcolumns,compresults:compresults,dataForTable:sess.dataForTable,aggreRes:sess.aggreRes, aggregation: sess.aggregation, column: sess.column,text:sess.text});
  
    }
  }else{

  if(sess.compmonth.includes("/")){
  
  mongoose.connect(url, { useNewUrlParser: true }, async function (err, db) {
    if (err) throw err;
    // await sess.compcryptos.asyncForEach(async function(eachcrypto){
     async.each(sess.compcryptos,function(eachcrypto,next){
    // console.log(eachcrypto);
    // monthObject.names.push({title:eachcrypto,months:[]});
    var soonerDate = new Date(sess.soonerDate.year,sess.soonerDate.month-1,sess.soonerDate.date);
    // var soonerTitle = sess.soonerDate.year+"/"+sess.soonerDate.month;
    // console.log(soonerDate.toISOString());
    // mongoose.connection.db.collection(eachcrypto).find({title:sess.compmonth,'dates.date':{'$gte':soonerDate}}).sort({ title: 1 }).toArray(function (err, result) {
      // console.log(result);
      // var resultCor =[];
      // result.forEach(function(item){
        
      //   for(i=0;i<item.dates.length;i++){
      //     // console.log(item.dates[i].date.toString()+"  "+soonerDate.toString() );
      //     if(item.dates[i].date.getYear()<=soonerDate.getYear()){
      //     if(item.dates[i].date.getDate()<soonerDate.getDate() && item.dates[i].date.getMonth()<=soonerDate.getMonth()){
      //       item.dates.splice(i,1);
      //       i--;
      //     }
      //   }
      //   }

      // })
      // console.log("Result: "+resultCor);
      mongoose.connection.db.collection(eachcrypto).aggregate([
        {'$match':{title:sess.compmonth,'dates.date':{'$gte':soonerDate}}},
        {'$unwind':'$dates'},
        {'$project':
          { 'date':'$dates.date',
          'high':'$dates.high',
          'open':'$dates.open',
          'close':'$dates.close',
          'low':'$dates.low',
          'volume':'$dates.volume',
          'marketcap' : '$dates.marketcap',
          'highlow': {'$subtract':['$dates.high','$dates.low']},
          'openclose': {'$subtract':['$dates.open','$dates.close']}
        }
      }
        
      ]).sort({ title: 1 }).toArray(function(err,result){
        console.log(result);
        
        // sess.result = aggreRes;
        // res.render('dates', { data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text });
      // db.close();
      compresults.push({title:eachcrypto,month:result});
      next();
    });
    
    },function(error){
      if(error) console.log(error);
      // res.send(compresults);
      // console.log("+++++" +compresults);
      compresults.forEach(function(result){
        result.month.forEach(function(data){
          // console.log(data.dates);
        })
      })
      var tableArray = [];
      // //from here all the days////////////////////////
      var tableDates = [];
      compresults.forEach(function(crypto,index){
        var tempDates = [];
        crypto.month.forEach(function(date){
            tempDates.push(date.date.toString());
          
        })
        if(tableDates.length<tempDates.length){
          tableDates = tempDates;
        }
      })
      tableDates.forEach(function(date){
        var tableObject = {date:new Date(date),highs:[],opens:[],lows:[],closes:[],volumes:[],marketcaps:[],highlows:[],opencloses:[]};
        tableArray.push(tableObject);
      })
      compresults.forEach(function(crypto,index){
            tableArray.forEach(function(object){
            var dateExists = false;
              crypto.month.forEach(function(date){
                  if(date.date.toString()==object.date.toString()){
                    dateExists = true;
                  }
                })
              
              if(dateExists){
                crypto.month.forEach(function(date){
                    if(date.date.toString()==object.date.toString()){
                      object.highs.push(date.high);
                      object.opens.push(date.open);
                      object.lows.push(date.low);
                      object.closes.push(date.close);
                      object.volumes.push(date.volume);
                      object.marketcaps.push(date.marketcap);
                      object.highlows.push(date.highlow);
                      object.opencloses.push(date.openclose);
                    }
                  })
                
              }else{
                object.highs.push(0);
                object.opens.push(0);
                object.lows.push(0);
                object.closes.push(0);
                object.volumes.push(0);
                object.marketcaps.push(0);
                object.highlows.push(0);
                object.opencloses.push(0);
              }
            })
          });
 
      /////////////////////////////////
      //from here less days/////////////////////////
      // compresults.forEach(function(crypto,index){
      //   crypto.month.forEach(function(month){
      //     month.dates.forEach(function(date){
      //       if(index==0){
      //         // console.log(index);
      //         var tableObject = {date:date.date,highs:[],opens:[],lows:[],closes:[],volumes:[],marketcaps:[]};
      //         tableObject.highs.push(date.high);
      //         // console.log(date.date);
      //         // console.log(date.high);
      //         tableObject.opens.push(date.open);
      //         tableObject.lows.push(date.low);
      //         tableObject.closes.push(date.close);
      //         tableObject.volumes.push(date.volume);
      //         tableObject.marketcaps.push(date.marketcap);
      //         tableArray.push(tableObject);
      //       }else{
      //         // console.log(index);
      //         tableArray.forEach(function(item){
      //           // console.log(item.date+"-----"+date.date);
      //           if(item.date.toString()== date.date.toString()){
      //             // console.log(date.date);
      //             // console.log(date.high);
      //             item.highs.push(date.high);
      //             item.opens.push(date.open);
      //             item.lows.push(date.low);
      //             item.closes.push(date.close);
      //             item.volumes.push(date.volume);
      //             item.marketcaps.push(date.marketcap);
      //           }
      //         })
      //       }
      //     })
      //   })
      // })
      /////////////////////////////////////
      sess.dataForTable = tableArray;

      // res.send(tableArray);
      // res.send(compresults);

      
        res.render("comparisondates",{compcryptos:sess.compcryptos,compmonth:sess.compmonth,compcolumns:sess.compcolumns,compresults:compresults,dataForTable:sess.dataForTable,aggreRes:[], aggregation: sess.aggregation, column: sess.column,text:sess.text});
    });
  // });
  // res.send(compresults);
  // res.send("Cryptocurrencies: " +sess.compcryptos+" , Month: "+ sess.compmonth +" , Columns: "+ sess.compcolumns);
    db.close();
});
  }else{
    sess.graphData = [];
      mongoose.connect(url, { useNewUrlParser: true }, async function (err, db) {
    if (err) throw err;
    // await sess.compcryptos.asyncForEach(async function(eachcrypto){
     async.each(sess.compcryptos,function(eachcrypto,next){
    // console.log(eachcrypto);
    // monthObject.names.push({title:eachcrypto,months:[]});
    var soonerDate = new Date(sess.soonerDate.year,sess.soonerDate.month-1,sess.soonerDate.date);
    // console.log(soonerDate.toISOString());
    // mongoose.connection.db.collection(eachcrypto).find({ 'title': { "$regex": sess.compmonth, "$options": "i" } ,'dates.date':{'$gte':soonerDate}}).sort({ title: 1 }).toArray(function (err, result) {
      // console.log(result);
      // var resultCor =[];
      // result.forEach(function(item){
        
      //   for(i=0;i<item.dates.length;i++){
      //     // console.log(item.dates[i].date.toString()+"  "+soonerDate.toString() );
      //     if(item.dates[i].date.getYear()<=soonerDate.getYear()){
      //     if(item.dates[i].date.getDate()<soonerDate.getDate() && item.dates[i].date.getMonth()<=soonerDate.getMonth()){
      //       item.dates.splice(i,1);
      //       i--;
      //     }
      //   }
      //   }

      // })
      // console.log("Result: "+resultCor);

      mongoose.connection.db.collection(eachcrypto).aggregate([
        {'$match':{'title': { "$regex": sess.compmonth, "$options": "i" },'dates.date':{'$gte':soonerDate}}},
        {'$unwind':'$dates'},
        {'$project':
          { 'date':'$dates.date',
          'high':'$dates.high',
          'open':'$dates.open',
          'close':'$dates.close',
          'low':'$dates.low',
          'volume':'$dates.volume',
          'marketcap' : '$dates.marketcap',
          'highlow': {'$subtract':['$dates.high','$dates.low']},
          'openclose': {'$subtract':['$dates.open','$dates.close']}
        }
      }
        
      ]).sort({ title: 1 }).toArray(function(err,result){
        console.log(result);
      compresults.push({title:eachcrypto,months:result});

      next();
    });
    
    },function(error){
      if(error) console.log(error);
      // console.log("+++++" +compresults);
      compresults.forEach(function(result){
        result.months.forEach(function(data){
          // console.log(data.dates);
        })
      })
      var tableArray = [];
      // //from here all the days////////////////////////
      var tableDates = [];
      compresults.forEach(function(crypto,index){
        var tempDates = [];
        crypto.months.forEach(function(date){
            tempDates.push(date.date.toString());
    
        })
        if(tableDates.length<tempDates.length){
          tableDates = tempDates;
        }
      })
      tableDates.forEach(function(date){
        var tableObject = {date:new Date(date),highs:[],opens:[],lows:[],closes:[],volumes:[],marketcaps:[],highlows:[],opencloses:[]};
        tableArray.push(tableObject);
      })
      compresults.forEach(function(crypto,index){
            tableArray.forEach(function(object){
            var dateExists = false;
              crypto.months.forEach(function(date){
                  if(date.date.toString()==object.date.toString()){
                    dateExists = true;
                  }
                
              })
              if(dateExists){
                crypto.months.forEach(function(date){
                    if(date.date.toString()==object.date.toString()){
                      object.highs.push(date.high);
                      object.opens.push(date.open);
                      object.lows.push(date.low);
                      object.closes.push(date.close);
                      object.volumes.push(date.volume);
                      object.marketcaps.push(date.marketcap);
                      object.highlows.push(date.highlow);
                      object.opencloses.push(date.openclose);
                    }
                
                })
              }else{
                object.highs.push(0);
                object.opens.push(0);
                object.lows.push(0);
                object.closes.push(0);
                object.volumes.push(0);
                object.marketcaps.push(0);
                object.highlows.push(0);
                object.opencloses.push(0);
              }
            })
          });
 
      /////////////////////////////////
      // from here less days/////////////////
      // compresults.forEach(function(crypto,index){
      //   crypto.months.forEach(function(month){
      //     month.dates.forEach(function(date){
      //       if(index==0){
      //         // if(tableDates.includes(date.date.toString)){
      //         // console.log(index);
      //         var tableObject = {date:date.date,highs:[],opens:[],lows:[],closes:[],volumes:[],marketcaps:[]};
      //         tableObject.highs.push(date.high);
      //         // console.log(date.date);
      //         // console.log(date.high);
      //         tableObject.opens.push(date.open);
      //         tableObject.lows.push(date.low);
      //         tableObject.closes.push(date.close);
      //         tableObject.volumes.push(date.volume);
      //         tableObject.marketcaps.push(date.marketcap);
      //         tableArray.push(tableObject);
      //       }else{
      //         // console.log(index);
      //         tableArray.forEach(function(item){
      //           // console.log(item.date+"-----"+date.date);
      //           if(item.date.toString()== date.date.toString()){
      //             // console.log(date.date);
      //             // console.log(date.high);
      //             item.highs.push(date.high);
      //             item.opens.push(date.open);
      //             item.lows.push(date.low);
      //             item.closes.push(date.close);
      //             item.volumes.push(date.volume);
      //             item.marketcaps.push(date.marketcap);
      //           }
      //         })
      //       }
      //       })
      //     })
      // })
      ///////////////////////////////////////
      sess.dataForTable = tableArray;
      console.log(tableArray);
      var soonerDate = new Date(sess.soonerDate.year,sess.soonerDate.month-1,sess.soonerDate.date);

      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
        mongoose.connection.db.collection(eachcrypto).aggregate([
          { $match: {'title': { "$regex": sess.compmonth, "$options": "i" },'dates.date':{'$gte':soonerDate}}}
          ,
  
          {"$unwind":"$dates"},
          { "$group": {
            "_id": { 
                "year": { "$year": "$dates.date" },
                "month": { "$month": "$dates.date" }
            },
            "high": { "$avg": "$dates.high"  },
            "open": { "$avg": "$dates.open"},
            "close": {"$avg":"$dates.close"},
            "low": {"$avg":"$dates.low"},
            "volume": {"$avg":"$dates.volume"},
            "cap": {"$avg":"$dates.marketcap"},
            'highlow': {'$avg':{'$subtract':['$dates.high','$dates.low']}},
            'openclose': {'$avg':{'$subtract':['$dates.open','$dates.close']}}
        }}
  
      ]).sort({"_id.month":1}).toArray(function(err,result1){
        // console.log(result1);
        sess.graphData.push(result1);
        // sess.graphData = result1;
        // res.render('everydates', { graphData:sess.graphData,data: sess.result, crypto: sess.crypto, max: sess.dates, aggregation: sess.aggregation, column: sess.column,text:sess.text});
        next();
      });

      },function(error){
        if(error) console.log(error);
        // console.log(sess.graphData)
        // res.send(sess.graphData);
        res.render('comparisoneverydates', { graphData:sess.graphData,compcryptos:sess.compcryptos,compmonth:sess.compmonth,compcolumns:sess.compcolumns,compresults:compresults,dataForTable:sess.dataForTable, aggregation: sess.aggregation, column: sess.column,text:sess.text,aggreRes:sess.aggreRes});

      })


      // res.send(tableArray);
      // res.send(compresults);
      
      
        // res.render("comparisoneverydates",{compcryptos:sess.compcryptos,compmonth:sess.compmonth,compcolumns:sess.compcolumns,compresults:compresults,dataForTable:sess.dataForTable,graphData:sess.graphData});
    });
  // });
  // res.send(compresults);
  // res.send("Cryptocurrencies: " +sess.compcryptos+" , Month: "+ sess.compmonth +" , Columns: "+ sess.compcolumns);
    // db.close();
});
  
  }
  }
})


app.post('/comparisonaggre', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;
  sess.aggreRes = [];
  var soonerDate = new Date(sess.soonerDate.year,sess.soonerDate.month-1,sess.soonerDate.date);

  if (sess.aggregation == 'max') {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, max: { $max:{$subtract: col }} } },
              { $project: { max: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.max;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.max});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{
    var col = '$dates.' + req.body.column;

    

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
      mongoose.connection.db.collection(eachcrypto, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
          { $unwind: '$dates' },
          { $group: { _id: null, max: { $max: col } } },
          { $project: { max: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.max;
            sess.aggreRes.push({title:eachcrypto,aggreRes:item.max});
            next();
          })
          // res.end('done');
        });
        
      });
    },function(error){
      if(error) console.log(error);
      console.log(sess.aggreRes);
      res.end('done');
    });
    });
  }
  } else if (sess.aggregation == 'min') {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, min: { $min:{$subtract: col }} } },
              { $project: { min: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.min;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.min});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
        mongoose.connection.db.collection(eachcrypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
            { $unwind: '$dates' },
            { $group: { _id: null, min: { $min: col } } },
            { $project: { min: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
            arrRes.forEach(function (item) {
              sess.dates = item.min;
              sess.aggreRes.push({title:eachcrypto,aggreRes:item.min});
              next();
            })
            // res.end('done');
          });
          
        });
      },function(error){
        if(error) console.log(error);
        console.log(sess.aggreRes);
        res.end('done');
      });
    });
  }
  } else {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, avg: { $avg:{$subtract: col }} } },
              { $project: { avg: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.avg;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.avg});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
        mongoose.connection.db.collection(eachcrypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': sess.compmonth ,'dates.date':{'$gte':soonerDate}} },
            { $unwind: '$dates' },
            { $group: { _id: null, avg: { $avg: col } } },
            { $project: { avg: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
            arrRes.forEach(function (item) {
              sess.dates = item.avg;
              sess.aggreRes.push({title:eachcrypto,aggreRes:item.avg});
              next();
            })
            // res.end('done');
          });
          
        });
      },function(error){
        if(error) console.log(error);
        console.log(sess.aggreRes);
        res.end('done');
      });
    });
  }
}
})

app.post('/comparisoneveryaggre', function (req, res) {
  sess = req.session;
  sess.aggregation = req.body.aggre;
  sess.column = req.body.column;
  sess.text = req.body.text;
  sess.aggreRes = [];
  var soonerDate = new Date(sess.soonerDate.year,sess.soonerDate.month-1,sess.soonerDate.date);

  if (sess.aggregation == 'max') {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: { 'title': { "$regex": sess.compmonth, "$options": "i" } ,'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, max: { $max:{$subtract: col }} } },
              { $project: { max: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.max;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.max});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{
    var col = '$dates.' + req.body.column;

    

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
      mongoose.connection.db.collection(eachcrypto, function (err, collection) {
        if (err) throw err;
        collection.aggregate([
          { $match: { 'title': { "$regex": sess.compmonth, "$options": "i" },'dates.date':{'$gte':soonerDate}} },
          { $unwind: '$dates' },
          { $group: { _id: null, max: { $max: col } } },
          { $project: { max: 1, _id: 0 } }

        ]).toArray(function (err, arrRes) {
          arrRes.forEach(function (item) {
            sess.dates = item.max;
            sess.aggreRes.push({title:eachcrypto,aggreRes:item.max});
            next();
          })
          // res.end('done');
        });
        
      });
    },function(error){
      if(error) console.log(error);
      console.log(sess.aggreRes);
      res.end('done');
    });
    });
  }
  } else if (sess.aggregation == 'min') {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: { 'title': { "$regex": sess.compmonth, "$options": "i" },'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, min: { $min:{$subtract: col }} } },
              { $project: { min: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.min;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.min});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
        mongoose.connection.db.collection(eachcrypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': { "$regex": sess.compmonth, "$options": "i" } ,'dates.date':{'$gte':soonerDate}} },
            { $unwind: '$dates' },
            { $group: { _id: null, min: { $min: col } } },
            { $project: { min: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
            arrRes.forEach(function (item) {
              sess.dates = item.min;
              sess.aggreRes.push({title:eachcrypto,aggreRes:item.min});
              next();
            })
            // res.end('done');
          });
          
        });
      },function(error){
        if(error) console.log(error);
        console.log(sess.aggreRes);
        res.end('done');
      });
    });
  }
  } else {
    if(sess.column.includes("/")){
      var columns = sess.column.split("/");
      var col = [];
      columns.forEach(function(item){
        col.push("$dates." + item);
      })
      mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
  
        async.eachSeries(sess.compcryptos,function(eachcrypto,next){
          mongoose.connection.db.collection(eachcrypto, function (err, collection) {
            if (err) throw err;
            collection.aggregate([
              { $match: {'title': { "$regex": sess.compmonth, "$options": "i" },'dates.date':{'$gte':soonerDate}} },
              { $unwind: '$dates' },
              { $group: { _id: null, avg: { $avg:{$subtract: col }} } },
              { $project: { avg: 1, _id: 0 } }
    
            ]).toArray(function (err, arrRes) {
              arrRes.forEach(function (item) {
                sess.dates = item.avg;
                sess.aggreRes.push({title:eachcrypto,aggreRes:item.avg});
                next();
              })
              // res.end('done');
            });
            
          });
        },function(error){
          if(error) console.log(error);
          console.log(sess.aggreRes);
          res.end('done');
        });
      });
    }else{

    var col = '$dates.' + req.body.column;

    mongoose.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;

      async.eachSeries(sess.compcryptos,function(eachcrypto,next){
        mongoose.connection.db.collection(eachcrypto, function (err, collection) {
          if (err) throw err;
          collection.aggregate([
            { $match: { 'title': { "$regex": sess.compmonth, "$options": "i" } ,'dates.date':{'$gte':soonerDate}} },
            { $unwind: '$dates' },
            { $group: { _id: null, avg: { $avg: col } } },
            { $project: { avg: 1, _id: 0 } }
  
          ]).toArray(function (err, arrRes) {
            arrRes.forEach(function (item) {
              sess.dates = item.avg;
              sess.aggreRes.push({title:eachcrypto,aggreRes:item.avg});
              next();
            })
            // res.end('done');
          });
          
        });
      },function(error){
        if(error) console.log(error);
        console.log(sess.aggreRes);
        res.end('done');
      });
    });
  }
}
})



app.listen(port, function () {
  console.log("now listening to localhost:" + port);
});
