var express = require('express')
  , passport = require('passport')
  , cors = require('cors')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;

var S = require('string');

/*
* You may think you know what the following code does.
* But you don't. Trust me.
* Fiddle with it, and you'll spend many a sleepless
* night cursing the moment you thought you'd be clever
* enough to "optimize" the code below.
* Now close this file and go play with something else.
*/

var meOn = false;
var dburl = "mongodb://admin:admin1234@ds231207.mlab.com:31207/erpdata";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const connection = mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', function () {
  console.log("Server connected")
});

mongoose.connection.on('error', err => console.log('MongoDB connection error: ${err}'));

// mongoose.model('cat',
//   new Schema({  parentId: String, categoryName: String }),
//   'Categories');
mongoose.model('cat',
  new Schema({ categoryName: String, parents: [] }),
  'Categories');

mongoose.model('sup',
  new Schema({ supplierName: String }),
  'Supplier');

mongoose.model('ItemCollection', // new item collection
  new Schema({
    barcode: Number, itemName: String, itemDesc: String, itemQty: Number,
    itemWholesale: Number, itemRetail: Number, itemSupplier: String,
    type: String, size: Number, code: String, itemCategory: []
  }),
  'ItemCollection');

mongoose.model('saveBarcode',
  new Schema({ barcode: Number }),
  'saveBarcode ');

mongoose.model('creditItem',
  new Schema({
    shop: String, itemName: String, due: { type: Boolean, default: false },
    wholsale: Number, retailPrice: Number, getQty: Number, Qty: Number,
    date: String,
  }),
  'creditItem');

mongoose.model('saleCollection', //salecollection daily its is not using in this so you can remove after
  new Schema({
    date: String, time: String, soldItems: [Number],
    totalQty: Number, totalPrice: Number, totalDiscount: Number, profit: Number,
    salesman: String
  }),
  'saleCollection');

mongoose.model('supplierBill',  //not good should do something about it
  new Schema({
    Supplier: String, Bill: [{
      date: String, billNo: String, credit: Number,
      debit: Number, balance: Number, items: [{ barcode: Number, Qty: Number, Price: Number }]
    }]
  }),
  'supplierBill');

mongoose.model('salesman', //salesman name need some work n it
  new Schema({
    name: String, fname: String, address: String, phone: String,
    CNIC: Number
  }),
  'salesman');

mongoose.model('expense',
  new Schema({ date: String, dayexpense: [Number], start: Number }),
  'expense');

mongoose.model('customerProducts',
  new Schema({
    customerName: String, debit: Number, totalPrice: Number, totalQty: Number, product: [{
      barcode: Number, purchasedQty: Number, price: Number, shop: String, wholePrice: Number, date: String, time: String,
      itemName: String, productNo: Number
    }]
  }),
  'customerProducts');

mongoose.model('customer',
  new Schema({ customerName: String, email: String, phone: String, address: String }),
  'customer');


mongoose.model('paidCustomers',
  new Schema({
    customerName: String, debit: Number, totalPrice: Number, discount: Number, date: String, product: [{
      barcode: Number, purchasedQty: Number, price: Number, wholePrice: Number, date: String, time: String,
      itemName: String, productNo: Number
    }]
  }),
  'paidCustomers');

var customerLedger =
  mongoose.model('customerLedger',
    new Schema({
      billNo: String, ledger: [{ date: String, time: String, payment: Number }]
    }),
    'customerLedger');

var avgModel = mongoose.model('moving_average',
  new Schema({
    barcode: Number, purchasePrice: [Number]
  }),
  'moving_average');
//make collection Model
//collection function to pass and search for the collection

// var db = conn.connection;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
ObjectId = require('mongodb').ObjectID; //  convert String to objectId
// var restore = require('mongodb-restore');
// const mongoose = require('mongoose');
// var Schema = mongoose.Schema;

function findByUsername(username, fn) {
  var collection = db.get('loginUsers');
  collection.findOne({ username: username }, {}, function (e, docs) {
    if (docs) {
      return fn(null, docs);
    }
    else {
      return fn(null, null);
    }

  });
}
function findById(id, fn) {
  var collection = db.get('loginUsers');
  collection.findOne({ _id: id }, {}, function (e, docs) {
    if (docs) {
      return fn(null, docs);
    }
    else {
      return fn(null, null);
    }
  });
}
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// configure Express
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(session({

  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: (40 * 60 * 60 * 1000) } // 4 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(function (req, res, next) {
  req.connection = connection;
  next();
});

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept")
  next();
});
app.set('port', process.env.PORT || 8100);


passport.use(new LocalStrategy(
  function (username, password, done) {
    findByUsername(username, function (err, user) {

      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  }
));

app.use('/', express.static(__dirname + '/public'));
app.use('/public/bower_components', express.static(__dirname + '/public/bower_components'));


function sendData(res, obj) {
  res.send(obj);
}



app.get('/login', function (req, res) {
  res.send({ msg: "login kr" });
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/loginFailure' }),
  function (req, res) {


    res.send({ sucess: true });
  });
app.get('/loginFailure', function (req, res) {
  res.send({ error: true })
});

app.post('/register', function (req, res) {
  var collection = db.get("loginUsers");
  var mail = req.body.email;
  var uname = req.body.username;

  collection.findOne({ email: mail }, {}, function (e, docs) {
    if (docs) {
      res.send(false);
    }
    else {
      collection.findOne({ username: uname }, {}, function (e, docs1) {
        if (docs1) {
          res.send(false);
        }
        else {
          collection.insertOne(req.body, function (err, doc) {
            if (err)
              res.send(false);
            else
              res.send(true);
          });
        }
      });
    }
  });
});

app.post('/addCategory', async function (req, res) {  /** add categorey */

  var cat = mongoose.model('cat');   //  call collection  of category
  cat.findOne(req.body,function(err,doc){
    if(doc==null){
      cat.collection.insertOne(req.body)
    }
  });
  
});

app.post('/getSupDetail', function (req, res) { // did changing by mistake
  // var collection = db.get('Total_Items');
  var collection = mongoose.model('ItemCollection');
  var array = [];
  collection.find({ itemSupplier: req.body.name }, function (err, docs) {
    if (docs) {
      for (i in docs) {
        array.push(docs[i]);
      }
      res.send(array);
      // array.push(docs);
    } else if (err) {
      res.send(false);
    }
  });
});

app.post('/getBill', function (req, res) {

  // var collection = db.get('supplierBill');
  var collection = mongoose.model('supplierBill');
  console.log(req.body.supplier)
  collection.find({ supplierName: req.body.supplier }, {}, function (e, docs) {
    if (docs) {
      res.send(docs);
    }
    else {
      res.send(false);
    }
  });
});

app.post('/addPurchaser', function (req, res) { //'/addSuplier'
  // var collection = db.get('Supplier');
  var sup = mongoose.model('sup'); //call model for Suppiler
  var str = S(req.body.supplierName).slugify().s

  sup.findOne({ supplierName: str }, {}, function (e, docs1) { // find if supplier already created
    if (docs1) {
      res.send(false);
    }
    else {
      var obj = { supplierName: str };
      sup.collection.insertOne(obj, function (err, doc) {
        if (err) {
          res.send(false); //check false to addSup() to show alert if got error
        }
        else {
          res.send(true); //check false to addSup() to show alert succes
        }
      });
    }
  });
});

app.post('/getItem', function (req, res) {

  var collection = mongoose.model('ItemCollection');
  var barcode = S(req.body.myid).chompLeft('000000000').s;
  barcode = S(barcode).toInt();

  collection.findOne({ barcode: barcode }, {}, function (e, docs) {
    if (docs) {
      res.send(docs);
    }
    else {
      res.send(false);
    }
  });
});

app.post('/addItem', function (req, res) {

  var item = mongoose.model('ItemCollection');
  item.findOne({ itemName: req.body.itemName, itemSupplier: req.body.Supplier }, {}, function (e, docs1) { // check if supplier is alreay added
    if (docs1) {
      res.send(docs1);
    } else {
      var addBarcode = mongoose.model('saveBarcode');
      addBarcode.collection.updateOne({}, { $inc: { barcode: +1 } }, { upsert: true }, function (err, doc21) {
        if (err) {
          res.send(false);
        }
        else {
          addBarcode.collection.findOne({}, function (err, count) {
            if (err) {
              res.send(false)
            } else {
              var obj = { barcode: count.barcode, itemName: req.body.itemName, itemDesc: req.body.itemDesc, itemQty: req.body.itemQty, itemWholesale: req.body.itemWholesale, itemRetail: req.body.itemRetail, itemCategory: req.body.itemCategory, itemSupplier: req.body.itemSupplier, type: req.body.type, size: req.body.size, code: req.body.code, };
              item.collection.insertOne(obj, function (err, doc) {
                if (err) {
                  res.send(false);
                }
                else {
                  var obbb = { barcode: count.barcode }
                  res.send(obbb);
                }
              });
            }
          })

        }
      });
    }
  });
});

app.post('/getCategory', function (req, res) {

  var collection = mongoose.model('cat');
  collection.find({ parents: req.body.parents }, function (err, doc) {
    // collection.find({ parents: { $all: req.body.parents } }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});

app.post('/getSupplier', function (req, res) {

  // var collection = db.get('Supplier');
  var collection = mongoose.model('sup');

  collection.find({}, function (err, doc) {
    if (err) {

      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});

app.post('/getDailySlip', function (req, res) {
  var collection = mongoose.model('paidCustomers')
  var date = req.body.date;
  collection.find({ date: date }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });
});

app.post('/getSoldItems', function (req, res) {
  // var collection = db.get('saleCollection');
  var collection = mongoose.model('paidCustomers');
  collection.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc.reverse());
    }
  });

});

app.post('/getMonthlySlip', function (req, res) {

  var collection = mongoose.model('paidCustomers');
  collection.find({ $and: [{ date: { $regex: req.body.monthYear[0] } }, { date: { $regex: req.body.monthYear[1] } }] },
    function (err, doc) {
      if (doc) {
        res.send(doc);
      } else {
        res.send(false);
      }
    });

});

app.post('/sync', function (req, res) {

  /*checkInternet(function(isConnected) {
      if (isConnected) {
         
  
          CopyDatabase(res);
      } else {
      }
  });*/


});

app.post('/deleteSale', function (req, res) {
  mongoose.set('useFindAndModify', false);
  var collection = mongoose.model('paidCustomers');
  var mycollect = mongoose.model('ItemCollection');
  var CI = mongoose.model('creditItem')
  var i = 0;
  collection.findByIdAndRemove(req.body._id, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      var items = req.body.product
      for (item of items) {
        if (item.shop == '') {
          mycollect.updateOne({ barcode: item.barcode }, { $inc: { itemQty: +item.purchasedQty } }, function (errr, docs1) {
            if (errr) {
              res.send(false);
            }
          });
        } else {
          var find = { shop: item.shop, itemName: item.itemName };
          var query = { $inc: { Qty: +item.purchasedQty } }
          CI.findOneAndUpdate(find, query, function (err2, doc2) {
            if (err2) {
              res.send(false);
            }
          });
        }
      }
      res.send(true);
    }
  });
});

app.post('/returnSale', function (req, res) {
  mongoose.set('useFindAndModify', false)
  var mycollect = mongoose.model('ItemCollection');
  var CI = mongoose.model('creditItem')
  let item = req.body.item;
  let id = req.body.id;
  if (item.shop == '') {
    mycollect.findOneAndUpdate({ barcode: item.barcode }, { $inc: { itemQty: +item.purchasedQty } }, function (err, doc) {
      if (doc) {
        delItem(item, id)
      }
    });
  } else {
    var find = { shop: item.shop, itemName: item.itemName };
    var query = { $inc: { Qty: +item.purchasedQty } }
    CI.findOneAndUpdate(find, query, function (err2, doc2) {
      if (doc2) {
        delItem(item, id);
      }
    });
  }

  function delItem(data, findId) {
    var collection = mongoose.model('paidCustomers');
    var less = data.purchasedQty * data.price;
    var query = { $pull: { product: { productNo: data.productNo } }, $inc: { totalPrice: -less, totalQty: -data.purchasedQty } }
    collection.findByIdAndUpdate(findId, query, { new: true }, function (err1, doc1) {
      if (doc1) {
        res.send(doc1)
      }
    });
  }

});

app.post('/sendSale', function (req, res) {

  var collect = mongoose.model('saleCollection');
  var arr = [];
  var mysold = [];
  for (var i = 0; i < req.body.sold.length; i++) {
    var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
    barcode = S(barcode).toInt();
    mysold.push(barcode);
  }
  var obj = { date: req.body.date, time: req.body.time, soldItems: mysold, totalQty: req.body.totalQty, totalPrice: req.body.sale, totalDiscount: req.body.discount, profit: req.body.profit, salesman: req.body.salesman };
  var my = true;
  collect.collection.insertOne(obj, function (err1, doc1) {
    if (err1) {
      res.send(false);
    }
    else {
      for (var i = 0; i < req.body.sold.length;) {
        var qty;
        if (req.body.sold[i].itemQty > 0) {
          qty = req.body.sold[i].itemQty - 1;
        } else {
          qty = req.body.sold[i].itemQty
        }

        var barcode = S(req.body.sold[i].barcode).chompLeft('000000000').s;
        barcode = S(barcode).toInt();
        var id = barcode;

        var myobj = { itemName: req.body.sold[i].itemName, itemDesc: req.body.sold[i].itemDesc, id: id, date: req.body.date, time: req.body.time, itemRetail: req.body.sold[i].itemRetail, itemQty: '1', itemSupplier: req.body.sold[i].itemSupplier, salesman: req.body.salesman };
        i++;
        arr.push(id);
        for (var j = 0; j < arr.length; j++) {
          if (arr[j] === id && i !== 1) {
            if (qty > 0) {
              qty = qty - 1;
            }
          }
        }
        var k = i;

        upDateit(id, qty, k - 1, req.body.sold.length, res, req.body.time, req.body.date);

      }
    }
  });
});

function upDateit(id, qty, i, length, res, time, date) {

  var collectio = mongoose.model('ItemCollection');

  var collection = mongoose.model('saleCollection');
  collectio.updateOne({ barcode: id }, { $inc: { itemQty: -1 } }, function (errr, docs) {
    if (docs) {
      // res.send(false);
    }
  });
  if (i === length - 1) {
    collection.findOne({ time: time }, {}, function (e, docs1) {
      if (docs1) {
        if (docs1.date == date) {
          var ids = docs1._id;
          res.send(ids);
        }
      }
      else {
        res.send(false);
      }
    });
  }
  else {
    return 0;
  }
}

app.post('/updateEntry', function (req, res) {

  // var collect = req.body.itemCategory + '_Category';
  // var collection = db.get(collect);
  var collection = mongoose.model('ItemCollection');
  collection.updateMany({ barcode: req.body.id }, { $inc: { itemQty: +req.body.itemQty } }, function (err, docs) {
    if (err) { res.send(false); }
    else {
      res.send(true);
    }
  });
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  req.session = null;
  req.logout();
  res.send(true);

});

app.get('/isAuthenticated', function (req, res) {
  if (req.isAuthenticated())
    res.send(true);
  else
    res.send(false);
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

app.post('/Salesman', function (req, res) {

  var sal = mongoose.model('salesman');
  sal.findOne({ name: req.body.Name, fname: req.body.Fname }, {}, function (e, docs1) { // check if supplier is alreay added
    if (docs1) {
      res.send(docs1);
    }
    else {
      var obj = { name: req.body.Name, fname: req.body.Fname, address: req.body.Address, phone: req.body.Phone, CNIC: req.body.CNIC };
      sal.collection.insertOne(obj, function (err, doc) { //insert new supplier
        if (err) {
          res.send(false); //check return to salesman() to show alert
        }
        else {
          res.send(true); //send return to addCat() to show alert
        }
      });
    }
  });
});

app.post('/getSaleman', function (req, res) {
  var collection = mongoose.model('salesman');
  collection.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });
});

app.post('/getSalemanReport', function (req, res) {
  // var collection = db.get('Total_Items');
  var collection = mongoose.model('saleCollection');
  var array = [];
  var cat = [];

  collection.find({ salesman: req.body.name }, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      for (var i in doc) {

        if (S(doc[i].date).contains(req.body.date) === true) {
          array.push(doc[i]);
        }
      }
      res.send(array);
    }
  });

});

app.post('/refreshStartday', function (req, res) {

  var day = mongoose.model('expense');
  day.findOne({ date: req.body.date }, function (errr, find) {
    if (find) {
      // day.updateOne({ date:req.body.date }, {start:req.body.amount}, function (errr, docs) { //update amount may be not needed
      //   if(docs){
      //     var update=true;
      //     res.send(update);
      //   }else{
      //     var update=false;
      //     res.send(update);
      //   }
      // }); // uncomment this section if update startday needs to update
      res.send(find);
    }
  });

});

app.post('/startday', function (req, res) {

  var day = mongoose.model('expense');
  day.findOne({ date: req.body.date }, function (errr, find) {
    if (find) {
      res.send(find);
    } else {
      var obj = { date: req.body.date, start: req.body.amount };
      day.collection.insertOne(obj, function (err, doc) { //insert strat day casheir money
        if (doc) {
          res.send(true);
        } else {
          res.send(false);
        }
      });
    }
  });

});

app.post('/dayExpense', function (req, res) {

  var day = mongoose.model('expense');
  day.findOne({ date: req.body.date }, function (err, doc) {
    if (doc) {
      var sub = doc.start - req.body.todayexpense;
      var todayexpense = doc.dayexpense;
      todayexpense.push(req.body.todayexpense);
      day.updateMany({ date: req.body.date }, { start: sub, dayexpense: todayexpense }, function (errr, docs) { //update amount may be not needed
        if (docs) {
          res.send(docs);
        }
      });
    } else {
      res.send(false);
    }
  });

});

app.post('/weeklyReport', async function (req, res) {

  var collection = mongoose.model('paidCustomers');
  var collect = [];
  var i;
  for (i = 0; i < req.body.array.length; i++) {
    await collection.find({ date: req.body.array[i] }).then(resp => {
      if (resp.length != 0) {
        collect = collect.concat(resp);
      }
    })

  }
  res.send(collect);

});

app.post('/cartProducts', function (req, res) {

  var item = mongoose.model('ItemCollection');
  // var itemCategory = JSON.parse("req.body.itemCategory");
  item.find({ itemCategory: { $all: req.body.itemCategory } }, function (err, doc) {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  });
});

app.post('/getCustomer', function (req, res) {

  var Customer = mongoose.model('customer');
  Customer.find({}, function (err, docs) {
    if (err) {
      res.send(false);
    } else {
      res.send(docs);
    }
  });

});

app.post('/addCustomer', function (req, res) { // add new Customer

  var Customer = mongoose.model('customer');
  Customer.findOne({ customerName: req.body.name, phone: req.body.phone }, function (err, find) {
    if (find) {
      res.send(find);
    } else {
      Customer.collection.insertOne({ customerName: req.body.name, email: req.body.email, address: req.body.address, phone: req.body.phone }, function (err, doc) {
        if (doc) {
          res.send(true);
        } else {
          res.send(false);
        }
      });
    }
  });

});

// put comments with addtocart

app.post('/addToCart', function (req, res) { //aa product to customer Cart

  var custProduct = mongoose.model('customerProducts');
  var collect = mongoose.model('ItemCollection');
  mongoose.set('useFindAndModify', false);
  var product = req.body.product;
  collect.updateOne({ barcode: product.barcode }, { $inc: { itemQty: -req.body.addQty } }, function (updateErr, update) { //subtract want Qty from the ItemCollection into function
    if (update) {
      var newproduct = [];
      var totalPrice = product.itemRetail * Math.abs(req.body.addQty);
      newproduct.push({ productNo: req.body.productNo, date: req.body.date, time: req.body.time, price: product.itemRetail, itemName: product.itemName, shop: "", purchasedQty: req.body.addQty, barcode: product.barcode }) // make arrayObject to push into the customer Name
      custProduct.findOneAndUpdate({ customerName: req.body.customerName }, { $push: { product: newproduct }, $inc: { totalPrice: +totalPrice, totalQty: +req.body.addQty } }, function (updaErr, updat) {
        if (updat !== null) {
          res.send(true);
        } else if (updat == null) {
          var obj = { customerName: req.body.customerName, debit: 0, product: newproduct, totalPrice: totalPrice, totalQty: req.body.addQty }
          custProduct.collection.insertOne(obj, function (InsertErr, insert) {
            if (insert) {
              res.send(true);
            }
          });
        }
      });
    }
  });
});

app.post('/customerCart', function (req, res) {

  var cCart = mongoose.model('customerProducts')
  cCart.find({ customerName: req.body.customerName }, function (err, doc) {
    if (doc) {
      res.send(doc);
    }
    else {
      res.send(false);
    }
  });

});

app.post('/delete', function (req, res) {

  var mycollect = mongoose.model('ItemCollection');

  mycollect.findOneAndDelete({ barcode: req.body.barcode }, function (err, doc) {
    if (err) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

app.post('/deleteProduct', function (req, res) {

  var cCart = mongoose.model('customerProducts');
  var item = mongoose.model('ItemCollection');
  var creditItem = mongoose.model('creditItem');
  cCart.updateOne({ customerName: req.body.customerName }, { $pull: { product: { productNo: req.body.cProduct.productNo } }, totalPrice: req.body.updateTP, $inc: { totalQty: -req.body.cProduct.purchasedQty } }, function (delErr, del) {
    if (delErr) {
      res.send(false);
    } else {
      if (req.body.cProduct.shop == "") {
        item.updateOne({ barcode: req.body.cProduct.barcode }, { $inc: { itemQty: +req.body.cProduct.purchasedQty } }, function (updateErr, update) {
          if (updateErr) {
            res.send(false);
          } else {
            res.send(true);
          }
        });
      } else {
        creditItem.updateOne({ shop: req.body.cProduct.shop, itemName: req.body.cProduct.itemName }, { $inc: { Qty: +req.body.cProduct.purchasedQty } }, function (updateErr, update) {
          if (updateErr) {
            res.send(false);
          } else {
            res.send(true);
          }
        });
      }
    }
  });
});

app.post('/showBill', function (req, res) {

  var cBill = mongoose.model('customerBill');
  cBill.findOne({ customerName: req.body.customerName }, function (findERR, find) {
    if (find) {
      res.send(find);
    } else {
      res.send(false);
    }

  });

});

app.post('/UpdateBill', function (req, res) {

  var cBill = mongoose.model('customerProducts');
  cBill.findOne({ customerName: req.body.customerName }, function (findErr, find) {
    var debit = find.debit + req.body.debit;
    cBill.updateOne({ customerName: req.body.customerName }, { debit: debit },
      function (updateErr, update) {
        if (update) {
          paytrack(req.body.billNo, req.body.date, req.body.time, req.body.debit)
          res.send(true);
        }
      });
  });
});

function paytrack(billNo, date, time, payment) {
  mongoose.set('useFindAndModify', false);
  console.log({ billNo }, { date }, { time }, { payment })
  ledger = { date: date, time: time, payment: payment }
  var filter = { billNo: billNo };
  var query = { $push: { ledger: ledger } };
  customerLedger.findOneAndUpdate(filter, query, { new: true }, function (updateErr, Updat) {
    if (!Updat) {
      // }else{
      var priceArry = [ledger] // error 2 if put into error 1
      insQuery = { billNo: billNo, ledger: priceArry } //error 1
      customerLedger.collection.insertOne(insQuery, function (insErr, ins) {
        if (insErr) {
          console.log(insErr)
        }
      });
    }
  });
}

app.post('/paidCustomers', function (req, res) {

  var unpaidCart = mongoose.model('customerProducts');
  var paidCart = mongoose.model('paidCustomers');
  var cust = mongoose.model('customer');
  unpaidCart.findOneAndDelete({ customerName: req.body.customerName }, function (delErr, del) {
    if (del) {
      var data = del.toObject();
      data['date'] = req.body.date;
      data['discount'] = req.body.discount;
      paidCart.collection.insertOne(data, function (insErr, ins) {
        if (ins) {
          res.send(true);
        }
        if (!req.body.customerName.includes("customer")) {
          cust.deleteOne({ customerName: req.body.customerName }, function (cDErr, cDel) {
          });
        }
      });
    }
  });

});

app.post('/showPaidCustomers', function (req, res) {

  var paidCust = mongoose.model('paidCustomers');
  paidCust.find({}, function (findErr, find) {
    res.send(find.reverse());
  });

});

app.post('/deleteCustTable', function (req, res) { // 

  var custPro = mongoose.model('customerProducts');
  var pro = mongoose.model('ItemCollection');
  custPro.findOneAndDelete({ customerName: req.body.customerName }, function (fdErr, FD) {
    if (FD) {
      for (i = 0; i < FD.product.length; i++) {
        pro.updateOne({ barcode: FD.product[i].barcode }, { $inc: { itemQty: +FD.product[i].purchasedQty } },
          function (upErr, update) {
          });
      }
    }
  });

});

app.post('/getItemBySupplier', function (req, res) {
  var item = mongoose.model('ItemCollection');
  item.find({ itemSupplier: req.body.supplier }, function (findErr, find) {
    if (find) {
      res.send(find);
    } else {
      res.send(false)
    }
  })
});

app.post('/updateData', function (req, res) {
  var collection = mongoose.model('ItemCollection');
  for (item of req.body.purchaseItems) {
    collection.updateOne({ barcode: item.barcode }, { itemWholesale: item.price, $inc: { itemQty: +item.purchaseQty } }, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        movAve(item.barcode, item.price);
      }
    });
  }
  res.send(true);
});


function movAve(barcode, price) {
  mongoose.set('useFindAndModify', false);
  var filter = { barcode: barcode };
  var query = { $push: { purchasePrice: price } };
  avgModel.findOneAndUpdate(filter, query, { new: true }, function (updateErr, Updat) {
    if (!Updat) {
      // }else{
      var priceArry = [price] // error 2 if put into error 1
      insQuery = { barcode: barcode, purchasePrice: priceArry } //error 1
      avgModel.collection.insertOne(insQuery, function (insErr, ins) {
        if (insErr) {
          console.log(insErr)
        }
      });
    }
  });
}

app.post('/addBill', function (req, res) {
  var enterBill = mongoose.model('supplierBill')
  var insObj = {
    date: req.body.date, bill_No: req.body.bill_No, credit: req.body.credit, debit: req.body.debit,
    supplierName: req.body.supplierName, purchaseItems: req.body.purchaseItems
  }
  enterBill.findOne({ supplierName: req.body.supplierName, bill_No: req.body.bill_No }, function (findErr, find) {
    if (find) {
      res.send(false);
    } else {
      enterBill.collection.insertOne(insObj, function (insErr, ins) {
        if (ins) {
          res.send(true);
        } else {
          console.log(err)
        }
      });
    }
  });

});

app.post('/getItems', async function (req, res) {
  var retriveData = [];
  var collection = mongoose.model('ItemCollection');
  for (i = 0; i < req.body.barcode.length; i++) {
    var barcode = req.body.barcode[i];
    barcode = S(barcode).toInt();
    await collection.findOne({ barcode: barcode }).then(docs => {
      if (docs) {
        retriveData.push(docs);
      }
      else {
        res.send(false);
      }
    });
  }
  res.send(retriveData);
});

app.post('/paymentOrBill', function (req, res) {

  var supBill = mongoose.model('supplierBill');
  if (req.body.select == 2) {
    supBill.updateOne({ supplierName: req.body.supplierName, bill_No: req.body.bill_No },
      { $inc: { debit: +req.body.debit, credit: +req.body.credit } }, function (updErr, updat) {
        if (updat) {
          res.send(true)
        }
      });
  }
  else if (req.body.select == 1) {
    supBill.findOne({ supplierName: req.body.supplierName, bill_No: req.body.bill_No }, function (findErr, find) {
      if (find) {
        res.send(false);
      } else {
        var obj = { bill_No: req.body.bill_No, credit: req.body.credit, date: req.body.date, supplierName: req.body.supplierName, debit: req.body.debit }
        supBill.collection.insertOne(obj, function (inErr, ins) {
          if (ins) {
            res.send(ins.bill_No);
          }
        });
      }
    });
  }
});

app.post('/updateItem', function (req, res) {
  console.log(req.body);
  var collection = mongoose.model('ItemCollection');

  var updateObj = {
    itemName: req.body.itemName, itemDesc: req.body.itemDesc, type: req.body.type,
    size: req.body.size, code: req.body.code, itemSupplier: req.body.itemSupplier, itemCategory: req.body.itemCategory,
    itemWholesale: req.body.itemWholesale, itemRetail: req.body.itemRetail, itemQty: req.body.itemQty
  }
  collection.updateOne({ barcode: req.body.barcode }, updateObj, function (err, docs) {
    if (err) { console.log(err) }
    else {
      console.log(docs)
      res.send(docs);
    }
  });
});

app.post('/addCreditItem', function (req, res) {
  var items = mongoose.model('creditItem');
  var obj = { date: req.body.date, time: req.body.time, shop: req.body.shop, itemName: req.body.itemName, wholesale: req.body.wholesale, retailPrice: req.body.retailPrice, getQty: req.body.Qty, Qty: req.body.Qty };
  items.collection.insertOne(obj, function (err, doc) {
    if (doc) {
      res.send(true);
    }
  });
});

app.post('/getCreditItem', function (req, res) {
  var items = mongoose.model('creditItem');
  items.find({}, function (err, doc) {
    if (doc) {
      res.send(doc);
    }
  });
});

app.post('/getAddCreditItem', function (req, res) {
  var items = mongoose.model('creditItem');
  items.find({ Qty: { $gt: 0 } }, function (err, doc) {
    if (doc) {
      res.send(doc);
    }
  });
});

app.post('/updateCitem', function (req, res) {
  var items = mongoose.model('creditItem');
  mongoose.set('useFindAndModify', false);
  var item = req.body.item;
  items.findOneAndUpdate({ shop: item.shop, itemName: item.itemName, date: item.date, getQty: item.getQty }, { due: req.body.due }, function (err, doc) {
    if (doc) {
      res.send(true);
    }
  });
});

app.post('/addToCartFromCredit', function (req, res) {
  var custProduct = mongoose.model('customerProducts');
  var collect = mongoose.model('creditItem');
  mongoose.set('useFindAndModify', false);
  var product = req.body.product;
  console.log(product)
  collect.updateOne({ shop: product.shop, itemName: product.itemName }, { $inc: { Qty: -req.body.addQty } }, function (updateErr, update) { //subtract want Qty from the ItemCollection into function
    if (update) {
      var newproduct = [];
      var totalPrice = product.retailPrice * Math.abs(req.body.addQty);
      newproduct.push({ productNo: req.body.productNo, date: req.body.date, time: req.body.time, price: product.retailPrice, itemName: product.itemName, shop: product.shop, purchasedQty: req.body.addQty }) // make arrayObject to push into the customer Name
      custProduct.findOneAndUpdate({ customerName: req.body.customerName }, { $push: { product: newproduct }, $inc: { totalPrice: +totalPrice, totalQty: +req.body.addQty } }, function (updaErr, updat) {
        if (updat !== null) {
          res.send(true);
        } else if (updat == null) {
          var obj = { customerName: req.body.customerName, debit: 0, product: newproduct, totalPrice: totalPrice, totalQty: req.body.addQty }
          custProduct.collection.insertOne(obj, function (InsertErr, insert) {
            if (insert) {
              res.send(true);
            }
          });
        }
      });
    }
  });
});

app.post('/showAve', function (req, res) {
  var filter = { barcode: req.body.barcode };
  avgModel.findOne(filter, function (showErr, show) {
    if (show) {
      var len = show.purchasePrice.length + 1;
      var arr = show.purchasePrice;
      arr.push(req.body.price);
      const sum = arr.reduce((a, b) => a + b, 0);
      const avg = sum / len
      res.send({ price: Math.round(avg) });
    }
  });
});

app.get('/custDetail', function (req, res) {
  var custModel = mongoose.model('customer');
  query = { "customerName": { "$not": /customer/ } }
  custModel.find(query, function (err, doc) {
    if (doc) {
      res.send(doc)
    }
  })
});

app.post('/deleteCustomer', function (req, res) {
  mongoose.set('useFindAndModify', false)

  var custModel = mongoose.model('customer')

  custModel.findByIdAndRemove(req.body._id, { new: true }, function (err, doc1) {
    if (doc1) {
      query = { "customerName": { "$not": /customer/ } }
      custModel.find(query, function (err, doc) {
        if (doc) {
          res.send(doc)
        }
      })
    }
  });
});

app.post('/payTrack', function (req, res) {
  customerLedger.findOne({ billNo: req.body.id }, function (err, doc) {
    if (doc) {
      res.send(doc)
    }
  })
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/#/login");
}
