
var app = angular.module('myApp.controllers', []);
var meLogin = false;
var mepOs = false;
var entryUser = false;

app.controller('registerUser', function ($scope, myService, $location, $rootScope) {


});

app.controller("dataEntry", function ($scope, myService, $routeParams, $location, $rootScope, $route, $window, $timeout) {
  console.clear();

  $rootScope.loggedOut = true;
  $scope.NewEntry = false;
  $scope.oldEntry = false;
  $scope.showModal = false;
  $scope.showOld = false;
  $scope.addCategoryModal = false;
  $scope.addSupplierModal = false;
  /**Category */
  $scope.add = {};
  var use = [];
  var parentId;
  var array = [];
  var id = -1;
  /**Category */

  /**show modal buttons */
  $scope.addCat = function () {
    array = [];
    use = [{}];
    next = -1;
    $scope.use = use;
    array[0] = 'parent';
    getCat(array);
    $scope.addCategoryModal = !$scope.addCategoryModal
    $scope.add.cat = [];
  }
  /**add childern category */
  var next = -1;
  $scope.function = function (category, index) {
    array[index + 1] = category;
    if (category != "" && next < index) {
      for (var i in $scope.chooseCategories) {
        if ($scope.chooseCategories[i].name == category) {
          // parentId = $scope.chooseCategories[i]._id; // variable check for _id and get catgeory
          found = true
          getCat(array);
          break;
        }else if(i == $scope.chooseCategories.length-1){
          $scope.chooseCategories = [];
        }
      }
      if (next == index - 1) {
        use.push({});
        $scope.use = use;
        next = index;
      }
    }
  }

  function getCat(parents) { //bring Category to drop down
    console.log(parents)
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      minLength = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "", _id: "" + res[i]._id };
          catArray.push(obj);
          if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            minLength = res[i].categoryName.length;
          }
        }
        $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
      } else if (res.length == 0) {
        $scope.chooseCategories = [];
      }
    });
  };


  $scope.insertNewCat = async function () {
    var objarray = []
    for (var i = 0; i < array.length; i++) {
      var name = array[i + 1]
      var parent = array.slice(0, i + 1)
      if (name != undefined) {
        objarray[i] = { categoryName: name, parents: parent }
        myService.addCategory(objarray[i]).success
      }
    }


    $scope.use = [];
    array = [];
    var id = -1;
    $scope.addCategoryModal = false;
  };
  /**add supplier  */

  $scope.addSupp = function (name) {
    var abc = { supplierName: name };
    myService.addPurchaser(abc).success(function (res) {
      if (res == true) {
        alert('Success');
        $scope.supName = "";
        // getSup();
      }
      else {
        alert('Category already Added!');
      }
    });
  }

  $scope.stockShow = false;
  $scope.checkStock = function ($event) {

    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {

      var abc = { myid: $scope.barcodeCheck };
      myService.getItem(abc).success(function (res) {
        //console.log(res);
        if (res == false) {

          alert('Invalid Barcode');
        }
        else {
          $scope.stockShow = true;
          var total = res.itemQty * res.itemRetail;
          $scope.totalLeft = total;
          $scope.sale = res;
        }
      });
    }
  };



  $scope.OldEntry = function () {
    $scope.NewEntry = false;
    $scope.oldEntry = true;
  }

  $scope.Reload = function () {
    $route.reload();
  }

  /** get category to add item */
  // $scope.addfunction = function ($event, category, index) {
  //   z = 1;
  //   var keyCode = $event.which || $event.keyCode;
  //   if (keyCode == 13) {
  //     if (category != "" && category != undefined && category != null) {
  //       findAdd_id(category);
  //     }
  //   }
  // }
  var newItemCategory = [];

  $scope.newEntry = function () {
    $scope.oldEntry = false;
    $scope.NewEntry = true;
    getSup();
    z = 0;
    newItemCategory[0] = 'parent';
    getAddCat(newItemCategory);
    use = [];
    $scope.add.cat = [];
  }

  $scope.addfunction = function (category, index) {
    if (minLength <= category.length) {
      for (var i in $scope.chooseCategories) {
        if ($scope.chooseCategories[i].name == category) {
          // parentId = $scope.chooseCategories[i]._id; // variable check for _id and get catgeory
          newItemCategory[index + 1] = $scope.chooseCategories[i].name;
          getAddCat(newItemCategory);
          break;
        }
      }
    }
  }

  var catArray = [];
  var minLength = 0;
  function getAddCat(parents) { //bring Category to drop down
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      minLength = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "", _id: "" + res[i]._id };
          catArray.push(obj);
          if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            minLength = res[i].categoryName.length;
          }
        }
        $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
        use.push({});
        $scope.use = use;
      }
    });
  };

  function cipher(number) {
    //console.log("number before " + number);
    var digits = number.toString().split('');
    var realDigits = digits.map(Number)
    //console.log('realDigits ' + realDigits);
    var convert = '';
    for (var i = 0; i < digits.length; i++) {

      switch (realDigits[i]) {
        case 1:
          convert = convert + 'B';
          break;
        case 2:
          convert = convert + 'L';
          break;
        case 3:
          convert = convert + 'A';
          break;
        case 4:
          convert = convert + 'C';
          break;
        case 5:
          convert = convert + 'K';
          break;
        case 6:
          convert = convert + 'H';
          break;
        case 7:
          convert = convert + 'O';
          break;
        case 8:
          convert = convert + 'R';
          break;
        case 9:
          convert = convert + 'S';
          break;
        case 0:
          convert = convert + 'E';
          break;
      }
    }
    //console.log("encripted " + convert);
    return convert;
  }

  $scope.generateOld = function () {
    $scope.showOld = !$scope.showOld;
    $("#myModal").modal()
    var arrayy = [];
    var obj = { id: $scope.sale.barcode, itemCategory: $scope.sale.itemCategory, itemQty: $scope.myQty };
    //console.log(obj);
    myService.updateEntry(obj).success(function (res) {
      if (res == false) {
        alert("Problem in adding your item");
      }
      else {

        var barcode = new bytescoutbarcode128();
        zeroAppend = ""
        if ($scope.barcodeCheck <= 100) {
          zeroAppend += "0000"
        } else if ($scope.barcodeCheck <= 1000) {
          zeroAppend += "000"
        }
        else if ($scope.barcodeCheck <= 10000) {
          zeroAppend += "00"
        } else if ($scope.barcodeCheck <= 100000) {
          zeroAppend += "0"
        }
        barcode.valueSet(zeroAppend + $scope.barcodeCheck);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);
        var width = barcode.getMinWidth();
        barcode.private_fontSize = 20;
        barcode.setSize(width, 120);
        var barcodeImage = document.getElementById('barcodeImage');
        barcodeImage.src = barcode.exportToBase64(width, 120, 0);

        //console.log($scope.sale.itemWholesale);
        var convert = cipher($scope.sale.itemWholesale);
        var name = $scope.sale.itemName
        if ($scope.sale.itemName && $scope.sale.itemName.length > 25) {
          name = name.substring(0, 25);
        }
        var MYS = '<div print-section style="font-size:16px; FONT-FAMILY: MONOSPACE; letter-spacing: 1px; position:absolute; top:26px;"><div style="display:inline; float:left; margin-left:25px; min-height:150px;"><p style="margin:0; padding:0;"><strong style="font-size:19px;" >Dress Up</strong><br><strong>'
          + $scope.sale.type
          + '</strong><br><strong>' + $scope.sale.code + '</strong><br/><strong>' + convert + '</strong><p style="font-size:18px; margin:0; padding:0;"><strong>RS: '
          + $scope.sale.itemRetail + '</p></strong></div>'
          + '<div style="display:inline; float:right;"><img id="barcodeImage" width="100%" height="100%" src="'
          + barcodeImage.src + '"><strong style="padding:0 0 0 1px;">'
          + $scope.sale.size + '</strong></div><div style="text-align:left;"><p style=" margin:0; padding:0 0 0 1px;"><strong>'
          + name + '</strong></p></div></div>';
        var arrays = [];
        var myVal = { text: MYS };
        for (var i = 1; i <= $scope.myQty; i++) {
          arrays.push(myVal);
        }
        //console.log(arrays);
        $scope.sa = arrays;
        //console.log($scope.sa);


        $timeout(function () {
          $scope.showModal = false;
          //$window.print();
          var mywindow = window.open('', 'PRINT', 'height=400,width=600');
          mywindow.document.write('<html><head>');
          mywindow.document.write('</head><body>');
          mywindow.document.write('<div style="margin:0; padding:0">');
          for (var i = 0; i < $scope.sa.length; i++) {
            if (i % 2 == 0)
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0;width:50%; float: left;">');
            else
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0; width:50%; float: right;">');
            mywindow.document.write($scope.sa[i].text);
            mywindow.document.write('</div>');
          }
          mywindow.document.write('</div>');
          mywindow.document.write('</body></html>');
          mywindow.print();
          mywindow.close();
        }, 1000);
      }
    });
  }

  var array1 = [];
  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        array1 = [];
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  }

  $rootScope.location = $location.path();
  $scope.printFunc = function () {
  }

  $scope.generateBarcode = function (id2) {
    //console.log('print in generate');
    console.log(newItemCategory);

    $scope.showModal = !$scope.showModal;
    var obj = { itemName: $scope.itemName, itemDesc: $scope.itemDesc, itemQty: $scope.itemQty, itemWholesale: $scope.itemWholesale, itemRetail: $scope.itemRetail, itemCategory: newItemCategory, type: $scope.type, size: $scope.size, code: $scope.code, itemSupplier: $scope.chooseSupplier[id2].name };
    console.log(obj);
    var arrayy = [];
    myService.addItem(obj).success(function (res) {
      if (res.itemName) {
        alert("item is already in");
      }
      else if (res == false) {
        alert("Problem in adding your item");
      }
      else {
        //console.log('in else generate');
        var barcode = new bytescoutbarcode128();
        zeroAppend = ""
        $scope.barcodeCheck = res.barcode;
        if ($scope.barcodeCheck <= 100) {
          zeroAppend += "0000"
        } else if ($scope.barcodeCheck <= 1000) {
          zeroAppend += "000"
        }
        else if ($scope.barcodeCheck <= 10000) {
          zeroAppend += "00"
        } else if ($scope.barcodeCheck <= 100000) {
          zeroAppend += "0"
        }
        barcode.valueSet(zeroAppend + $scope.barcodeCheck);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);
        var width = barcode.getMinWidth();
        barcode.private_fontSize = 20;
        barcode.setSize(width, 120);
        var barcodeImage = document.getElementById('barcodeImage');
        barcodeImage.src = barcode.exportToBase64(width, 120, 0);

        //console.log($scope.itemWholesale);
        var convert = cipher($scope.itemWholesale);
        var name = $scope.itemName
        if ($scope.itemName && $scope.itemName.length > 25) {
          name = name.substring(0, 25);
        }
        var MYS = '<div print-section style="font-size:16px; FONT-FAMILY: MONOSPACE; letter-spacing: 1px; position:absolute; top:26px;"><div style="display:inline; float:left; margin-left:25px; min-height:150px;"><p style="margin:0; padding:0;"><strong style="font-size:19px;" >Dress Up</strong><br><strong>'
          + $scope.type
          + '</strong><br><strong>' + $scope.code + '</strong><br/><strong>' + convert + '</strong><p style="font-size:18px; margin:0; padding:0;"><strong>RS: '
          + $scope.itemRetail + '</p></strong></div>'
          + '<div style="display:inline; float:right;"><img id="barcodeImage" width="100%" height="100%" src="'
          + barcodeImage.src + '"><strong style="padding:0 0 0 1px;">'
          + $scope.size + '</strong></div><div style="text-align:left;"><p style=" margin:0; padding:0 0 0 1px;"><strong>'
          + name + '</strong></p></div></div>';
        var arrays = [];
        var myVal = { text: MYS };
        //console.log($scope.itemQty);
        for (var i = 1; i <= $scope.itemQty; i++) {
          arrays.push(myVal);
        }
        $scope.sa = arrays;
        // $scope.showModal = true;


        $timeout(function () {
          $scope.showOld = false;
          //$window.print();
          var mywindow = window.open('', 'PRINT', 'height=400,width=600');
          mywindow.document.write('<html><head>');
          mywindow.document.write('</head><body>');
          mywindow.document.write('<div style="margin:0; padding:0">');
          for (var i = 0; i < $scope.sa.length; i++) {
            if (i % 2 == 0)
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0;width:50%; float: left;">');
            else
              mywindow.document.write('<div style="margin:0; padding-top:23px; padding-left:0px; padding-bottom:0; padding-right:0; width:50%; float: right;">');
            mywindow.document.write($scope.sa[i].text);
            mywindow.document.write('</div>');
          }
          mywindow.document.write('</div>');
          mywindow.document.write('</body></html>');
          mywindow.print();
          mywindow.close();
        }, 1000);
      }

    });

  }

});

app.controller("editName", function ($scope, myService, $routeParams, $location, $rootScope) {
  $rootScope.loggedOut = true;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }

});

app.controller("supplierDetail", function ($scope, myService, $routeParams, $location, $rootScope) {
  $rootScope.loggedOut = true;
  $scope.whenTable = false;
  //console.log('here');

  getSup();
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  var array1 = [];
  var qty = 0;

  var retail = 0;
  var profit = 0;
  var wholesale = 0;
  $scope.callIt = function (id) {
    qty = 0;
    retail = 0;
    profit = 0;
    wholesale = 0;
    //console.log(id);
    var obj = { name: $scope.chooseSupplier[id].name };
    //console.log(obj);
    myService.getSupDetail(obj).success(function (res) {
      //console.log('res', res);

      for (var i in res) {
        qty = qty + res[i].itemQty;
        var totalItemRetail = res[i].itemQty * res[i].itemRetail;
        retail = retail + totalItemRetail;
        var totalItemWohleSale = res[i].itemQty * res[i].itemWholesale;
        wholesale = wholesale + totalItemWohleSale;
        res[i]['category'] = res[i].itemCategory[res[i].itemCategory.length - 1]
      }
      $scope.whenTable = true;
      $scope.sale = res;
      $scope.whole = wholesale;
      profit = retail - wholesale;
      $scope.totalit = qty;
      $scope.myProfit = profit;
      $scope.mysale = retail;

    });
  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }

  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        array1 = [];

        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });
  }
  $scope.showItemCat = function (category) {
    $scope.thisCat = category;
    $scope.itemCategoryModal = true;
  }

});

app.controller("loginUser", function ($scope, myService, $routeParams, $location, $rootScope, $window) {
  $rootScope.location = $location.path();
  $rootScope.loggedOut = false;
  $scope.login = function (username, password) {
    //console.log(username, password)
    if (username === "admin" && password === "515253") {
      meLogin = true;
      $rootScope.menu = true;
      $rootScope.loggedIn = true;
      $rootScope.entryUser = false;
      $rootScope.posUser = false;
      $location.path('posCart');
    }
    else if (username === "posuser" && password === "12345") {
      meLogin = false;
      $rootScope.menu = false;
      $rootScope.posUser = true;
      $rootScope.entryUser = false;
      $rootScope.loggedIn = true;
      mepOs = true;
      $location.path('pos');
    }
    else if (username === "entryuser" && password === "12345") {
      meLogin = false;
      $rootScope.menu = false;
      $rootScope.posUser = false;
      $rootScope.entryUser = true;
      $rootScope.loggedIn = true;
      entryUser = true;
      $location.path('dataEntry');
    }
    else {
      $rootScope.menu = false;
      $rootScope.posUser = false;
      $rootScope.entryUser = false;
      $rootScope.loggedIn = false;
      entryUser = false;
      meLogin = false;
      mepOs = false;
      alert('Username or Password is incorrect');
    }

  }

});

app.controller("myStock", function ($scope, myService, $routeParams, $location, $rootScope) {

  $rootScope.loggedOut = true;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  $scope.stockShow = false;
  $scope.checkStock = function ($event) {

    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {

      var abc = { myid: $scope.barcodeCheck };
      myService.getItem(abc).success(function (res) {
        //console.log(res);
        if (res == false) {
          alert('Invalid Barcode');
        }
        else {
          $scope.stockShow = true;
          var total = res.itemQty * res.itemWholesale;
          $scope.totalLeft = total;
          $scope.sale = res;
        }
      });
    }
  };


});

app.controller("supplierLedger", function ($scope, $timeout, myService, $window, $route, $routeParams, $location, $rootScope) {

  $rootScope.loggedOut = true;
  $scope.showbill = false;
  $scope.showpay = false;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  getSup();
  var array1 = [];
  $scope.showPurchase = false;

  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });

  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }

  $scope.whenTable = false;
  $scope.getSup = function (id) {
    $scope.supplierChoose = $scope.chooseSupplier[id].name
    var obj = { supplier: $scope.chooseSupplier[id].name };
    myService.getBill(obj).success(function (res) {
      if (res === false) {
        alert("You Don't have any bill");
      }
      else {
        $scope.totalDebit = 0;
        $scope.totalCredit = 0;
        $scope.whenTable = true;
        $scope.sales = res;
        for (i in res) {
          $scope.totalDebit = $scope.totalDebit + res[i].debit;
          $scope.totalCredit = $scope.totalCredit + res[i].credit;
        }
      }
    });
  }

  $scope.getByBillNo = function (sale) {
    $scope.totalit = 0;
    var barcode = [];
    for (i in sale.purchaseItems) {
      barcode.push(sale.purchaseItems[i].barcode)
    }
    var getItemObj = { barcode: barcode }
    myService.getItems(getItemObj).success(function (res) {
      for (i in sale.purchaseItems) {
        res[i]['additem'] = sale.purchaseItems[i].purchaseQty
        $scope.totalit = $scope.totalit + sale.purchaseItems[i].purchaseQty;
      }
      $scope.showItems = res;
      $scope.slipDate = sale.date;
      $scope.slipSupplier = sale.supplierName;
      $scope.slipNo = sale.bill_No;
      $scope.showPurchase = true;
    });
  }
  /**add bill or payment */
  var myS = 0;
  $scope.showBill = function () {
    $scope.showbill = true;
    myS = 1;
  }

  $scope.showPay = function () {

    $scope.showpay = true;
    myS = 2;
  }

  $scope.addBill = function (bill_No, debit, credit) {
    if (debit == null || credit == null) {
      alert("You can't leave any field empty, Please put 0");
    }
    else {
      var payObj = { supplierName: $scope.supplierChoose, date: $scope.date, bill_No: bill_No, debit: debit, credit: credit, select: myS }
      myService.paymentOrBill(payObj).success(function (res) {
        if (res == false) {
          alert('Bill No for this Supplier is already added');
        } else {
          $route.reload();
        }


      });
    }
  }
  $scope.printSlip = function () {
    window.print();
  }
  $scope.printBarcode = function (item) {
    arrays = [];
    var arr;
    for (i in item) {
      arr = printBarcodefunc(item[i].additem, item[i]);
    }
    printwindow(arr, 1);
  }

  /** Barcode function brokr into two so it can print more than one item barcode at a time */
  var arrays = [];
  function printBarcodefunc(printQty, PitemBar) { // make barcode for the barcode or barcodes

    var barcode = new bytescoutbarcode128();
    zeroAppend = ""
    if (PitemBar.barcode <= 100) {
      zeroAppend += "0000"
    } else if (PitemBar.barcode <= 1000) {
      zeroAppend += "000"
    }
    else if (PitemBar.barcode <= 10000) {
      zeroAppend += "00"
    } else if (PitemBar.barcode <= 100000) {
      zeroAppend += "0"
    }

    barcode.valueSet(zeroAppend + PitemBar.barcode);
    barcode.setMargins(5, 5, 5, 5);
    barcode.setBarWidth(2);
    var width = barcode.getMinWidth();
    barcode.private_fontSize = 20;
    barcode.setSize(width, 120);
    var barcodeImage = document.getElementById('barcodeImage');
    barcodeImage.src = barcode.exportToBase64(width, 120, 0);

    var convert = cipher(PitemBar.itemWholesale);
    var name = PitemBar.itemName;
    if (PitemBar.itemName && PitemBar.itemName.length > 25) {
      name = name.substring(0, 25);
    }

    var dressUpFontSize = 120;
    var criticalFontSize = 100;


    /**HAssan- Ali*/
    var MYS = '<div style=" width:50% ;float:left">'
      + '<div style="padding-left:10%;line-height:150px;">'
      + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
      + '<div><span>' + PitemBar.type + '</span>'
      + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + PitemBar.size + '</span></div>'
      + '<div>' + PitemBar.code + '</div>'
      + '<div>' + convert + '</div>'
      + '</div> </div>'

      + '<div style="width:50% ;float:right;">'
      + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
      + '<div> '//<div style="font-size:18px;">' + PitemBar.size + '</div>
      + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
      + '<div><span>Rs: ' + PitemBar.itemRetail + '</span></div>  </div>'
      + '</div>';


    var myVal = { text: MYS };
    for (var i = 1; i <= printQty; i++) {
      arrays.push(myVal);
    }
    return arrays;
  }

  function printwindow(arrays, ref) { // print barcode that saves in PrintBarcodefunc function
    var uselessFontSize = 100;
    $timeout(function () {
      $scope.showOld = false;
      var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
      mywindow.document.write('<html><head>');
      mywindow.document.write('<style>');
      mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
      mywindow.document.write('</style>');
      mywindow.document.write('</head><body style=" margin:0; padding: 0;">');
      for (var i = 0; i < arrays.length; i++) {
        mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:10px;height:937px; font-size: ' + uselessFontSize + 'px;">');
        mywindow.document.write(arrays[i].text);
        mywindow.document.write('</div>');
      }
      mywindow.document.write('</body></html>');
      setTimeout(() => {
        mywindow.print();
        mywindow.close();
      }, 1000)

      // mywindow.close();
    }, 1000);
  }
  /** END of two part barcode*/

});

app.controller("newBill", function ($scope, myService, $routeParams, $location, $rootScope, $route) {

  $rootScope.loggedOut = true;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  getSup();
  var array1 = [];
  function getSup() {
    myService.getSupplier().success(function (res) {
      if (res) {
        var da = new Date();
        $scope.date = da.toDateString();
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;

      }
    });

  }
  $scope.showbill = false;
  $scope.select1 = false;
  $scope.showpay = false;
  $scope.selected = false;
  $scope.callIt = function () {
    $scope.selected = true;
  }
  var myS = 0;
  $scope.showBill = function () {
    $scope.select1 = true;
    $scope.showbill = true;
    $scope.showpay = false;
    myS = 1;
  }

  $scope.showPay = function () {
    $scope.select1 = true;
    $scope.showbill = false;
    $scope.showpay = true;
    myS = 2;
  }

  $scope.Reload = function () {
    $route.reload();
  }
  $scope.addBill = function (id) {
    if ($scope.debit == null || $scope.credit == null) {
      alert("You can't leave any field empty, Please put 0");
    }
    else {
      var da = new Date();
      var mdate = da.toDateString();
      var balance = $scope.credit - $scope.debit;
      if (myS === 1) {
        var matching = "" + $scope.billNo + "_" + $scope.chooseSupplier[id].name;
        var obj = { date: mdate, billNo: $scope.billNo, particular: '-', credit: $scope.credit, debit: $scope.debit, balance: balance, Supplier: $scope.chooseSupplier[id].name, matchId: matching, bool: 0 };
        //console.log(obj);
      }
      else if (myS === 2) {
        var obj = { date: mdate, billNo: '-', particular: $scope.payment, credit: $scope.credit, debit: $scope.debit, balance: balance, Supplier: $scope.chooseSupplier[id].name, bool: 1 };
        //console.log(obj);
      }
      myService.addBill(obj).success(function (res) {
        if (res) {
          alert("New Bill Added");
          // $route.reload();
        }
        else if (res == 'exist') {
          alert('This Bill already Exist');
        }
        else {
          alert('Error in adding this bill');
          // $route.reload();
        }
      });
    }
  }

});

app.controller("lastSale", function ($scope, myService, $routeParams, $location, $rootScope, $route, $window) {

  $rootScope.loggedOut = true;

  $scope.showPaidModal = false;

  var itemArray = [];
  myService.getSoldItems().success(function (res) {
    if (res) {
      $scope.sales = res;

    }
  });

  $scope.deleteSale = function (item) {
    //console.log(id);
    myService.deleteSale(item).success(function (res) {
      if (res) {
        //console.log(res);
        $route.reload();
      } else {
        alert('cant delete sale item');
      }
    });
  }

  $scope.returnItem = function (item, id) {
    console.log('prit')
    var obj = { item: item, id: id }
    myService.returnSale(obj).success(function (res) {
      $scope.showPurchaseItems = res.product;
    });
  }

  $scope.showItems = function (sale) {
    $scope.slipId = sale._id;
    $scope.Name = sale.customerName;
    $scope.purDate = sale.date;
    $scope.tPrice = sale.totalPrice;
    $scope.dPrice = sale.debit;
    $scope.showPurchaseItems = sale.product;
    $scope.showPaidModal = true;
  }

  $scope.print = function () {
    $window.print();
  }

});

app.controller("monthlyReport", function ($scope, myService, $routeParams, $location, $rootScope) {

  $rootScope.loggedOut = true;
  $scope.showPaidModal = false;

  $scope.whenTable = false;
  var da = new Date();
  $scope.mdate = da.toDateString();


  var qty = 0;

  var retail = 0;
  var profit = 0;

  $scope.generateReport = function (monthYear) {
    console.log('monthl')
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.varaible = monthNames[monthYear.getMonth()] + " " + monthYear.getFullYear()
    monthYear = [monthNames[monthYear.getMonth()], monthYear.getFullYear()];

    var obj = { monthYear: monthYear }
    myService.getMonthlySlip(obj).success(function (res) {
      if (res) {

        for (var i in res) {
          qty = qty + res[i].totalQty;
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
        $scope.sales = res;
        $scope.whenTable = true;
      }
    });
  }

  $scope.showItems = function (sale) {
    $scope.slipId = sale._id;
    $scope.Name = sale.customerName;
    $scope.purDate = sale.date;
    $scope.showPurchaseItems = sale.product;
    $scope.showPaidModal = true;
  }


});

app.controller("dailyReport", function ($scope, myService, $routeParams, $route, $location, $rootScope) {
  $rootScope.loggedOut = true;
  $scope.showPaidModal = false;
  var da = new Date();
  $scope.mdate = da.toDateString();

  var money = 0;

  var obj = { date: $scope.mdate };

  myService.refreshStartday(obj).success(function (res) {
    if (res) {
      if ($scope.cash == null) {
        $scope.cash = res.start
        money = res.start
      } else {
        money = res.start
      }
    }
  });


  myService.getDailySlip(obj).success(function (res) {

    var qty = 0;
    var wholePrice = 0;
    var retail = 0;
    var totalPrice = 0;
    var discount = 0;

    if (res) {
      for (var i in res) {
        qty = qty + res[i].totalQty;
        totalPrice = totalPrice + res[i].totalPrice;
        discount = discount + res[i].discount;

        for (var j in res[i].product) {
          wholePrice = wholePrice + res[i].product[j].wholePrice
        }
      }
      $scope.totalit = qty;
      $scope.myProfit = wholePrice - totalPrice - discount;
      $scope.mysale = totalPrice - discount;
      $scope.sales = res;
      $scope.mydiscount = discount;
      $scope.cash = $scope.myProfit;
    }

  });

  $scope.start = function ($event) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      //console.log($scope.todaycash);
      if ($scope.todaycash !== '') {
        var obj = { date: $scope.mdate, amount: $scope.todaycash };
        //console.log($scope.todaycash);
        myService.startday(obj).success(function (res) {
          if (res.start != null) {
            alert('Already started your day');
          } else if (res == true) {
            alert($scope.todaycash + ' Cash is added');
          }
        });
      }
    }
  };

  $scope.Reload = function () {
    $route.reload();
  };

  $scope.dayexpense = function ($event) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.todayexpense !== '') {
        var obj = { date: $scope.mdate, todayexpense: $scope.todayexpense }
        myService.dayExpense(obj).success(function (res) {
          if (res) {
            alert($scope.todayexpense + " cash is taken!!");
            money = res.sub;
          } else {
            alert("Haven't Entered start day ");
          }
        });
      }
    }
  };

  $scope.showLedger = function (paid) { //shows purchased items in  showPaidModal
    $scope.showPaidModal = true;
    $scope.slipId = paid._id;
    $scope.showPurchaseItems = paid.product;
    $scope.tPrice = paid.totalPrice;
    $scope.dPrice = paid.debit;
    $scope.Name = paid.customerName;
    $scope.purDate = paid.date;
  };

});

app.controller('addSalesman', function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');
  }
  $scope.Reload = function () {
    $route.reload();
  }

  $scope.SalesmanAdd = function () {
    var obj = { Name: $scope.name, Fname: $scope.fName, Address: $scope.address, Phone: $scope.phone, CNIC: $scope.CNIC };
    //console.log('in SalesmanAdd');
    myService.Salesman(obj).success(function (res) {
      if (res.name) {
        alert('Salesman Already added');
      } else
        if (res == false) {
          alert("Problem in adding your item");
        }
        else {
          alert("Salesman Added!");
        }
    });
  }

});

app.controller("SmanReport", function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;
  $scope.whenTable = false;
  $scope.whenmonth = false;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    mepOs = false;
    entryUser = false;
    $rootScope.entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login');

  }
  var array1 = [];

  getSman();
  var da = new Date();
  $scope.mdate = da.toDateString();
  $scope.date = da.toDateString();
  var wholesale = 0;
  // $scope.mdate = da.toDateString();
  $scope.chooseMonth = [
    { monthId: 0, name: "Select Month", slug: "Choose Month" },
    { monthId: 1, name: "January", slug: "Jan" },
    { monthId: 2, name: "February", slug: "Feb" },
    { monthId: 3, name: "March", slug: "Mar" },
    { monthId: 4, name: "April", slug: "Apr" },
    { monthId: 5, name: "May", slug: "May" },
    { monthId: 6, name: "June", slug: "Jun" },
    { monthId: 7, name: "July", slug: "Jul" },
    { monthId: 8, name: "August", slug: "Aug" },
    { monthId: 9, name: "September", slug: "Sep" },
    { monthId: 10, name: "October", slug: "Oct" },
    { monthId: 11, name: "November", slug: "Nov" },
    { monthId: 12, name: "December", slug: "Dec" }];

  $scope.selectedMonth = angular.copy($scope.chooseMonth[0]);

  $scope.openMonth = function () {
    $scope.whenmonth = true;
  }

  $scope.callIt = function (id, id2) {
    var qty = 0;
    var retail = 0;
    var profit = 0;

    var obj = { name: $scope.chooseSalesman[id].name, date: $scope.chooseMonth[id2].slug };
    myService.getSalemanReport(obj).success(function (res) {
      if (res) {
        //console.log('res', res);
        $scope.whenTable = true;
        for (var i in res) {
          qty = qty + res[i].totalQty;
          //console.log(qty);
          retail = retail + res[i].totalPrice;
          profit = profit + res[i].profit;
        }
        $scope.totalit = qty;
        $scope.myProfit = profit;
        $scope.mysale = retail;
        //console.log(res);
        $scope.sale = res;
        $scope.d = res.len.length;
      }

    });
  }
  $scope.showReturnModal = false;
  $scope.print = function () {
    $scope.showReturnModal = true;
  }

  $scope.Reload = function () {
    $route.reload();
  }

  function getSman() {
    myService.getSaleman().success(function (res) {
      if (res) {
        for (var i = 0; i < array1.length; i++) {
          array1.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { salesmanId: i, name: "" + res[i].name };
          array1.push(obj);
        }
        $scope.chooseSalesman = array1;
      }
    });
  }
});

app.controller('customSalesReport', function ($scope, myService, $routeParams, $location, $rootScope, $route) {
  $rootScope.loggedOut = true;

  $scope.showPaidModal = false;

  var da = new Date();
  $scope.mdate = da.toDateString();

  $scope.openModal = false;

  $scope.changeMin = function () {
    $scope.month = Number($scope.startDate.getMonth()) + 1
    $scope.minDate = $scope.startDate.getFullYear() + "-" + $scope.month + "-" + $scope.startDate.getDate()
    document.getElementById("listingDateClose").setAttribute("min", $scope.minDate);
  }

  $scope.call = async function (startDate, endDate) {
    $scope.whenTable = true;
    var arr = [];
    while (startDate <= endDate) {
      var sDate = startDate.toDateString();
      arr.push(sDate);
      startDate.setDate(startDate.getDate() + 1);

      /**convert date o string to show in modal */
      $scope.startstringDate = startDate.toDateString();
      $scope.endstringDate = endDate.toDateString();
      /**convert date o string to show in modal */
    }


    var obj = { array: arr }
    myService.weeklyReport(obj).success(function (res) {
      var qty = 0;
      var discount = 0;
      var wholePrice = 0;
      var totalPrice = 0;
      if (res) {
        for (var i in res) {
          qty = qty + res[i].totalQty;
          totalPrice = totalPrice + res[i].totalPrice;
          discount = discount + res[i].discount;

          for (var j in res[i].product) {
            wholePrice = wholePrice + res[i].product[j].wholePrice
          }
        }

        $scope.totalit = qty;
        $scope.myProfit = wholePrice - totalPrice - discount;
        $scope.mysale = totalPrice - discount;
        $scope.sales = res;
        $scope.mydiscount = discount;
        $scope.cash = $scope.myProfit;
      }
    });
  }

  $scope.showLedger = function (paid) { //shows purchased items in  showPaidModal
    $scope.showPaidModal = true;
    $scope.slipId = paid._id;
    $scope.showPurchaseItems = paid.product;
    $scope.tPrice = paid.totalPrice;
    $scope.dPrice = paid.debit;
    $scope.Name = paid.customerName;
    $scope.purDate = paid.date;
  };

});

app.controller("pointOfSale", function ($scope, myService, $routeParams, $location, $rootScope, $interval, $route) {
  $rootScope.loggedOut = true;
  $rootScope.logout = function () {
    $rootScope.menu = false;
    $rootScope.posUser = false;
    meLogin = false;
    $rootScope.entryUser = false;
    mepOs = false;
    entryUser = false;
    $rootScope.loggedIn = false;
    $location.path('login')
  }
  var array = [];
  getSman();
  $scope.showModal = false;
  $scope.showMe = false;
  $scope.sync = function () {

    myService.sync().success(function (res) {
      if (res == true) {
        //console.log('synced1');
      }
      else {
        //console.log(false);
      }
    });
  }
  $interval(function () { // call this function every 1s sec
    var d = new Date();
    var timei = d.toLocaleTimeString();
    $scope.mytime = timei;

  }, 1000);
  var flag = true;
  var da = new Date();
  $scope.date = da.toDateString();
  var row;

  var orginalsale = 0;
  $rootScope.location = $location.path();

  $scope.Showed = function () {
    if ($scope.showMe == true) {
      $scope.showMe = false;
    } else {
      $scope.showMe = true;
    }
    /** 
     * he could have done this with one line
     *       $scope.showMe = !$scope.showMe
     */
  }

  var price = [];
  var sum = 0;
  var sold = [];
  $scope.showReturnModal = false;
  $scope.returnItem = function () {

    if (($scope.cash === orginalsale) && ($scope.cash !== '')) {

      var myid = [];
      var name = [];
      var desc = [];
      var retail = [];
      var totalWhole = 0;
      var totalRe = 0;
      for (var i = 0; i < wholesaleArray.length; i++) {
        totalWhole = totalWhole + wholesaleArray[i];
      }
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      orginalsale = totalRe - discountedAmount;
      var profit = orginalsale - totalWhole;
      //console.log(profit, totalWhole);
      var obj = { date: $scope.date, time: $scope.mytime, sold: sold, sale: -orginalsale, totalQty: $scope.totalQty, discount: $scope.discount, profit: -profit };
      //console.log(obj);
      myService.returnSale(obj).success(function (res) { //Return sale Don't know how its work
        if (res == false) {

        }
        else {
          for (var i in sold) {
            myid.push('0000' + sold[i].barcode);
            name.push(sold[i].itemName);
            desc.push(sold[i].itemDesc);
            retail.push(sold[i].itemRetail);

          }
          var myData = myid.map(function (value, index) {
            return {

              id: value,
              name: name[index],
              desc: desc[index],
              retail: retail[index]

            }
          });
          $scope.mdate = obj.date;
          $scope.sold = myData;
          $scope.mysale = orginalsale;

          $scope.totalit = $scope.totalQty;
          $scope.mydiscount = $scope.discount;

          $scope.mtime = obj.time;

          $scope.showReturnModal = !$scope.showReturnModal;
          $scope.slipId = res;


        }

      });
    }
    else {
      alert('Please input Valid Amount');
    }
  }

  $scope.checkOut = function (id) { // makes recipt
    if (($scope.cash >= orginalsale) && ($scope.cash !== '')) {
      var myid = [];
      var name = [];
      var desc = [];
      var retail = [];
      var totalWhole = 0;
      var totalRe = 0;
      var undefined;
      if ($scope.discount == undefined) { $scope.discount = 0; }
      for (var i = 0; i < wholesaleArray.length; i++) {
        totalWhole = totalWhole + wholesaleArray[i];
      }
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      orginalsale = totalRe - discountedAmount;
      var profit = orginalsale - totalWhole;
      $scope.SmanChoose = $scope.chooseSalesman[id].name;
      var obj = { date: $scope.date, time: $scope.mytime, sold: sold, sale: orginalsale, totalQty: $scope.totalQty, discount: $scope.discount, profit: profit, salesman: $scope.chooseSalesman[id].name };
      myService.sendSale(obj).success(function (res) {
        if (res == false) {
        }
        else {
          for (var i in sold) {
            myid.push('0000' + sold[i].barcode);
            name.push(sold[i].itemName);
            desc.push(sold[i].itemDesc);
            retail.push(sold[i].itemRetail);

          }
          var myData = myid.map(function (value, index) {
            return {
              id: value,
              name: name[index],
              desc: desc[index],
              retail: retail[index]
            }
          });
          $scope.mdate = obj.date;
          $scope.sold = myData;
          $scope.mysale = orginalsale;

          $scope.totalit = $scope.totalQty;
          $scope.mydiscount = $scope.discount;

          $scope.mtime = obj.time;
          $scope.showModal = !$scope.showModal;
          $scope.slipId = res;

          $scope.return = $scope.cash - $scope.mysale;

        }
      });
    }
    else {
      // alert('Please input Valid Amount');
      alert('inValid Amount');

    }
  }
  $scope.Reload = function () {
    $route.reload();
  }
  var wholesaleArray = [];
  var mySum = 0;

  $scope.addCash = function ($event, amount) { // addCash the amount that the paid
    var temp;
    var ano;
    var totalRe = 0;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      for (var i = 0; i < retailArray.length; i++) {
        totalRe = totalRe + retailArray[i];
      }
      totalRe = totalRe - discountedAmount;
      sum = totalRe;

      if (amount !== '') {
        //console.log(amount);
        if (d === false) {

          //console.log('Discount false');
          temp = sum;
          orginalsale = sum;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          //console.log(sum, temp, mynew);
        }
        else {
          temp = mynew;
          sum = mynew;
          orginalsale = sum;
          //console.log('Discount true');
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          //console.log(sum, temp, mynew);
        }
      }
      else {
        if (d === false) {
          for (var i = 0; i < retailArray.length; i++) {
            totalRe = totalRe + retailArray[i];
          }
          sum = totalRe;

          $scope.priceSum = totalRe;
          //console.log(sum, temp, totalRe);
        }
        else {
          $scope.priceSum = sum;
        }
      }

    };
  }

  /* make Select Query fro AddDiscount*/
  /** Add Discount by % */
  $scope.addDiscountpercent = function ($event, amount) {
    var temp;
    sum = mynew;
    var done = false;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 8) { if (amount === null) { done = true; } else done = false; }
    if (keyCode === 13 || done) {
      if (bool === true) {
        if (amount !== null) {
          d = false;
          temp = sum;
          amount = amount / 100;
          amount = temp * amount;
          amount = Math.round(amount);
          discountedAmount = amount;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
          $scope.discount = amount;
        }
        else {
          d = true;
          sum = mynew;
          $scope.priceSum = mynew;
        }
      }
      else {
        alert('Please Do Some Sale');
      }
    }
  }
  var discountedAmount = 0;

  /* dISCOUNT  by rupees function */
  $scope.addDiscount = function ($event, amount) {
    var temp;
    sum = mynew;
    var done = false;
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 8) { if (amount === null) { done = true; } else done = false; }
    if (keyCode === 13 || done) {
      if (bool === true) {
        if (amount !== null) {
          d = false;
          temp = sum;
          discountedAmount = amount;
          temp = temp - amount;
          $scope.priceSum = temp;
          sum = temp;
        }
        else {
          d = true;
          sum = mynew;
          $scope.priceSum = mynew;
        }
      }
      else {
        alert('Please Do Some Sale');
      }
    }
  }

  function ref() {
    var totalRe = 0;
    $scope.cash = 0;
    for (var i = 0; i < retailArray.length; i++) {
      totalRe = totalRe + retailArray[i];
    }
    //console.log('Refreshing', totalRe);
    mynew = totalRe;
    sum = totalRe;
    $scope.priceSum = totalRe;
  }
  $scope.refreshCash = function () { // if you entered wring cash and pressed Enter 
    ref();
  }



  var qty = [];
  var retailArray = [];
  var myqty = 0;
  var i;
  var bool = false;
  $scope.changedKey = function ($event, row, id) { // this function get item from database when press Enter
    var done = false;
    //console.log(id);
    var keyCode = $event.which || $event.keyCode;
    if (row) {
      if (keyCode === 8) {  //this condtion allow user to remove item(do null to all variable) with backspace
        if (row.id === '' && retailArray[id - 1] != null) {
          done = true;
        }
        else {
          done = false;
        }
      }
      if (keyCode === 13 || done) {
        //console.log(row);

        if (row.id !== '') {
          if (retailArray[id - 1] == null || retailArray[id - 1] == 0) {
            var abc = { myid: row.id };
            myService.getItem(abc).success(function (res) {
              //console.log(res);
              var totalRe = 0;
              if (res == false) {
                for (var i = 0; i < retailArray.length; i++) {
                  totalRe = totalRe + retailArray[i];
                }
                //console.log('Refreshing', totalRe);
                mynew = totalRe;
                sum = totalRe;
                $scope.priceSum = totalRe;
                DoNull(id);
                alert('Invalid Barcode');
              }
              else if (res.itemQty > 0) {
                var obj = { id: res.barcode, qty: res.itemQty };
                var j = 0;
                //console.log(qty);
                if (qty === []) {
                  //console.log('push', obj);
                  qty.push(obj);
                }
                else {
                  for (i = 0; i < qty.length; i++) {
                    //console.log(qty[i].id, row.id, 'this is length', qty.length, i);
                    if (qty[i].id === res.barcode) {
                      //console.log('checking', qty[i].qty);
                      if (qty[i].qty === 0) {

                        flag = false;
                        //console.log(id, "checkQTY");
                        mySum = sum;

                        alert("Item out of stock");
                      }
                      else {
                        flag = true;

                        qty[i].qty = qty[i].qty - 1;
                        //console.log('Qty', qty[i].qty);
                      }
                      break;
                    }
                    j = i;
                  }
                  if (i === qty.length) {
                    //console.log('push', obj);
                    qty.push(obj);
                  }
                }
                if (j == qty.length) {
                  //console.log('push', obj);
                  flag = true;
                  qty.push(obj);
                }
                if (flag == true) {
                  bool = true;
                  //console.log(flag);
                  myqty++;
                  $scope.totalQty = myqty;
                  mySum = sum;
                  sum = sum + res.itemRetail;
                  //console.log(sum);
                  sold.push(res);
                  mynew = sum;
                  $scope.priceSum = sum;
                  //Vriable foe back value of retailArray


                  function dist() {
                    if (id == 1) {
                      retailArray[0] = res.itemRetail;
                      wholesaleArray[0] = res.itemWholesale;
                      $scope.row1 = res;
                      $scope.row1.id = '000000' + res.barcode;
                    }
                    else if (id == 2) {
                      retailArray[1] = res.itemRetail;
                      wholesaleArray[1] = res.itemWholesale;
                      $scope.row2 = res;
                      $scope.row2.id = '000000' + res.barcode;
                    }
                    else if (id == 3) {
                      retailArray[2] = res.itemRetail;
                      wholesaleArray[2] = res.itemWholesale;
                      $scope.row3 = res;
                      $scope.row3.id = '00000' + res.barcode;
                    }
                    else if (id == 4) {
                      retailArray[3] = res.itemRetail; wholesaleArray[3] = res.itemWholesale;
                      $scope.row4 = res;
                      $scope.row4.id = '00000' + res.barcode;
                    }
                    else if (id == 5) {
                      retailArray[4] = res.itemRetail; wholesaleArray[4] = res.itemWholesale;
                      $scope.row5 = res;
                      $scope.row5.id = '00000' + res.barcode;
                    }
                    else if (id == 6) {
                      retailArray[5] = res.itemRetail; wholesaleArray[5] = res.itemWholesale;
                      $scope.row6 = res;
                      $scope.row6.id = '00000' + res.barcode;
                    }
                    else if (id == 7) {
                      retailArray[6] = res.itemRetail; wholesaleArray[6] = res.itemWholesale;
                      $scope.row7 = res;
                      $scope.row7.id = '00000' + res.barcode;
                    }
                    else if (id == 8) {
                      retailArray[7] = res.itemRetail; wholesaleArray[7] = res.itemWholesale;
                      $scope.row8 = res;
                      $scope.row8.id = '00000' + res.barcode;
                    }
                    else if (id == 9) {
                      retailArray[8] = res.itemRetail; wholesaleArray[8] = res.itemWholesale;
                      $scope.row9 = res;
                      $scope.row9.id = '00000' + res.barcode;
                    }
                    else if (id == 10) {
                      retailArray[9] = res.itemRetail; wholesaleArray[9] = res.itemWholesale;
                      $scope.row10 = res;
                      $scope.row10.id = '00000' + res.barcode;
                    }
                    else if (id == 11) {
                      retailArray[10] = res.itemRetail; wholesaleArray[10] = res.itemWholesale;
                      $scope.row11 = res;
                      $scope.row11.id = '00000' + res.barcode;
                    }
                    else if (id == 12) {
                      retailArray[11] = res.itemRetail; wholesaleArray[11] = res.itemWholesale;
                      $scope.row12 = res;
                      $scope.row12.id = '00000' + res.barcode;
                    }
                    else if (id == 13) {
                      retailArray[12] = res.itemRetail; wholesaleArray[12] = res.itemWholesale;
                      $scope.row13 = res;
                      $scope.row13.id = '00000' + res.barcode;
                    }
                    else if (id == 14) {
                      retailArray[13] = res.itemRetail; wholesaleArray[13] = res.itemWholesale;
                      $scope.row14 = res;
                      $scope.row14.id = '00000' + res.barcode;
                    }
                    else if (id == 15) {
                      retailArray[14] = res.itemRetail; wholesaleArray[14] = res.itemWholesale;
                      $scope.row15 = res;
                      $scope.row15.id = '00000' + res.barcode;
                    }
                    else if (id == 16) {
                      retailArray[15] = res.itemRetail; wholesaleArray[15] = res.itemWholesale;
                      $scope.row16 = res;
                      $scope.row16.id = '00000' + res.barcode;
                    }
                    else if (id == 17) {
                      retailArray[16] = res.itemRetail; wholesaleArray[16] = res.itemWholesale;
                      $scope.row17 = res;
                      $scope.row17.id = '00000' + res.barcode;
                    }
                    else if (id == 18) {
                      retailArray[17] = res.itemRetail; wholesaleArray[17] = res.itemWholesale;
                      $scope.row18 = res;
                      $scope.row18.id = '00000' + res.barcode;
                    }
                    else if (id == 19) {
                      retailArray[18] = res.itemRetail; wholesaleArray[18] = res.itemWholesale;
                      $scope.row19 = res;
                      $scope.row19.id = '00000' + res.barcode;
                    }
                    else if (id == 20) {
                      retailArray[19] = res.itemRetail; wholesaleArray[19] = res.itemWholesale;
                      $scope.row20 = res;
                      $scope.row20.id = '00000' + res.barcode;
                    }

                  }//dist function END

                  dist(); //Function Call

                  //COMIT Item Discount
                }
              } else if (res.itemQty == 0) {
                alert('This item is out of stock');
              }
            });
          }
        }
        else {
          //console.log('yaha');
          if (myqty > 0) {
            myqty--;
          }
          $scope.totalQty = myqty;
          //console.log($scope.totalQty);
          mynew = sum;
          //console.log(sum);
          $scope.priceSum = sum;
          mySum = sum;
          sold.pop(row);

          if (id == 1) {
            sum = sum - $scope.row1.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            retailArray[0] = 0; wholesaleArray[0] = 0;
            $scope.row1 = '';

          }
          else if (id == 2) {

            retailArray[1] = 0; wholesaleArray[1] = 0;
            sum = sum - $scope.row2.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row2 = '';

          }
          else if (id == 3) {
            retailArray[2] = 0; wholesaleArray[2] = 0;
            sum = sum - $scope.row3.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row3 = '';

          }
          else if (id == 4) {
            retailArray[3] = 0; wholesaleArray[3] = 0;
            sum = sum - $scope.row4.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row4 = '';

          }
          else if (id == 5) {
            retailArray[4] = 0; wholesaleArray[4] = 0;
            sum = sum - $scope.row5.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row5 = '';

          }
          else if (id == 6) {
            retailArray[5] = 0; wholesaleArray[5] = 0;
            sum = sum - $scope.row6.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row6 = '';

          }
          else if (id == 7) {
            retailArray[6] = 0; wholesaleArray[6] = 0;
            sum = sum - $scope.row7.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row7 = '';

          }
          else if (id == 8) {
            retailArray[7] = 0; wholesaleArray[7] = 0;
            sum = sum - $scope.row6.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row8 = '';

          }
          else if (id == 9) {
            retailArray[8] = 0; wholesaleArray[8] = 0;

            sum = sum - $scope.row9.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row9 = '';

          }
          else if (id == 10) {
            retailArray[9] = 0; wholesaleArray[9] = 0;

            sum = sum - $scope.row10.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row10 = '';

          }
          else if (id == 11) {
            retailArray[10] = 0; wholesaleArray[10] = 0;

            sum = sum - $scope.row11.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row11 = '';

          }
          else if (id == 12) {
            retailArray[11] = 0; wholesaleArray[11] = 0;

            sum = sum - $scope.row12.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row12 = '';

          }
          else if (id == 13) {
            retailArray[12] = 0; wholesaleArray[12] = 0;

            sum = sum - $scope.row13.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row13 = '';

          }
          else if (id == 14) {
            retailArray[13] = 0; wholesaleArray[13] = 0;

            sum = sum - $scope.row14.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row14 = '';
          }
          else if (id == 15) {
            retailArray[14] = 0; wholesaleArray[14] = 0;

            sum = sum - $scope.row15.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row15 = '';
          }
          else if (id == 16) {

            retailArray[15] = 0; wholesaleArray[15] = 0;

            sum = sum - $scope.row16.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row16 = '';

          }
          else if (id == 17) {
            retailArray[16] = 0; wholesaleArray[16] = 0;

            sum = sum - $scope.row17.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row17 = '';

          }
          else if (id == 18) {
            retailArray[17] = 0; wholesaleArray[17] = 0;

            sum = sum - $scope.row18.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row18 = '';

          }
          else if (id == 19) {
            retailArray[18] = 0; wholesaleArray[18] = 0;

            sum = sum - $scope.row19.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row19 = '';

          }
          else if (id == 20) {
            retailArray[19] = 0; wholesaleArray[19] = 0;

            sum = sum - $scope.row20.itemRetail;
            mynew = sum;
            $scope.priceSum = sum;
            $scope.row20 = '';

          }

        }
      }
    }
  }
  function DoNull(id) { //do variables null function 
    if (id == 1) {
      retailArray[0] = 0; wholesaleArray[0] = 0;

      $scope.row1 = '';

    }
    else if (id == 2) {
      retailArray[1] = 0; wholesaleArray[1] = 0;

      $scope.row2 = '';

    }
    else if (id == 3) {
      retailArray[2] = 0; wholesaleArray[2] = 0;

      $scope.row3 = '';

    }
    else if (id == 4) {
      retailArray[3] = 0; wholesaleArray[3] = 0;

      $scope.row4 = '';

    }
    else if (id == 5) {
      retailArray[4] = 0; wholesaleArray[4] = 0;

      $scope.row5 = '';

    }
    else if (id == 6) {
      retailArray[5] = 0; wholesaleArray[5] = 0;

      $scope.row6 = '';

    }
    else if (id == 7) {
      retailArray[6] = 0; wholesaleArray[6] = 0;

      $scope.row7 = '';

    }
    else if (id == 8) {
      retailArray[7] = 0; wholesaleArray[7] = 0;

      $scope.row8 = '';

    }
    else if (id == 9) {
      retailArray[8] = 0; wholesaleArray[8] = 0;

      $scope.row9 = '';

    }
    else if (id == 10) {
      $scope.row10 = '';
      retailArray[9] = 0; wholesaleArray[9] = 0;

    }
    else if (id == 11) {
      retailArray[10] = 0; wholesaleArray[10] = 0;

      $scope.row11 = '';

    }
    else if (id == 12) {
      retailArray[11] = 0; wholesaleArray[11] = 0;

      $scope.row12 = '';

    }
    else if (id == 13) {

      retailArray[12] = 0; wholesaleArray[12] = 0;
      $scope.row13 = '';

    }
    else if (id == 14) {
      retailArray[13] = 0; wholesaleArray[13] = 0;

      $scope.row14 = '';
    }
    else if (id == 15) {
      retailArray[14] = 0; wholesaleArray[14] = 0;

      $scope.row15 = '';
    }
    else if (id == 16) {
      retailArray[15] = 0; wholesaleArray[15] = 0;

      $scope.row16 = '';

    }
    else if (id == 17) {
      retailArray[16] = 0; wholesaleArray[16] = 0;

      $scope.row17 = '';

    }
    else if (id == 18) {
      retailArray[17] = 0; wholesaleArray[17] = 0;

      $scope.row18 = '';

    }
    else if (id == 19) {
      retailArray[18] = 0; wholesaleArray[18] = 0;

      $scope.row19 = '';

    }
    else if (id == 20) {
      retailArray[19] = 0; wholesaleArray[19] = 0;

      $scope.row20 = '';

    }
  }

  $scope.print = function () {// print function to print
    window.print()

  }
  function getSman() { // get supplier to dropdown
    myService.getSaleman().success(function (res) {
      if (res) {
        for (var i = 0; i < array.length; i++) {
          array.pop();
        }
        //console.log(res);
        for (var i in res) {
          var obj = { salesmanId: i, name: "" + res[i].name };
          array.push(obj);
        }
        $scope.chooseSalesman = array;
      }
    });
  }

});

app.controller("posCart", function ($interval, $scope, myService, $routeParams, $location, $rootScope, $route, $window, $timeout) {

  $rootScope.loggedOut = true;
  $scope.creditItemModal = false;
  $scope.detailModal = false;
  $scope.paymentTrack = false;
  $interval(function () {  //call itself in every 1s to update time 
    var d = new Date();
    var timei = d.toLocaleTimeString(); //convert Time to string 
    $scope.mytime = timei; // saves current time
  }, 1000);

  var da = new Date();
  $scope.date = da.toDateString(); //Saves today into date
  $scope.debit = 0;
  /**Category */
  $scope.chooseCategories = [];
  $scope.add = {};
  var use = [];
  var productCat = []; //from function
  productCat[0] = 'parent'
  getCat(productCat);
  // $scope.use = use;
  /**Category */
  getCust();  //call customer to dropdown
  // getAllItem(); // call all item on first

  var customerid; // save the customer id to refresh the ledger in amount
  var itemlength; // customer purchased length
  $scope.customerCart = function (id) {
    customerid = id;
    $scope.custName = $scope.chooseCustomers[id].name;
    var obj = { customerName: $scope.chooseCustomers[id].name }
    myService.customerCart(obj).success(function (res) { //show item to the customer cart
      if (res.length != 0) {
        $scope.totalPrice = 0;

        itemlength = res[0].product.length + 1; // to give id to the next ptoduct
        $scope.totalPrice = res[0].totalPrice;

        $scope.customerTable = true;
        $scope.slipId = res[0]._id;
        $scope.cProducts = res[0].product;
        $scope.resDebit = res[0].debit;
      } else {
        itemlength = 1; // gives id = 1 to avoid null 
        $scope.customerTable = false;
      }
    });
  };

  $scope.cartProduct = function (porductCat) { //show available product of the selected category
    var obj = { itemCategory: porductCat }
    myService.cartProducts(obj).success(function (res) {
      if (res) {
        $scope.products = res;
      } else {
        $scope.products = [];
      }
    });
  };

  $scope.alertBox = false;
  $scope.addToCart = function (product, id, addQty) { //add items to customer cart
    if (addQty > 0) {
      if (addQty > product.itemQty) {

        $scope.data1 = product;
        $scope.data2 = id;
        $scope.data3 = addQty;

        $scope.alertBox = true;
      } else {
        $scope.yes(product, id, addQty);
      }
    }
  };

  $scope.yes = function (product, id, addQty) {
    var obj = { customerName: $scope.chooseCustomers[id].name, time: $scope.mytime, date: $scope.date, addQty, product: product, productNo: itemlength }
    myService.addToCart(obj).success(function (res) { //add product to cart 
      if (res) {
        $scope.customerCart(customerid); // to refresh the customer table after purchas
        $scope.cartProduct(productCat); //to refresh the product table after purchase
        $scope.alertBox = false;
      }
    });
  };

  $scope.cancel = function () {
    $scope.alertBox = !$scope.alertBox;
  }

  $scope.addCreditItem = function (shop, itemName, wholesale, retailPrice, Quantity) {
    var obj = { shop: shop, itemName: itemName, date: $scope.date, time: $scope.mytime, wholesale: wholesale, retailPrice: retailPrice, Qty: Quantity };
    if (itemName != "" && retailPrice != "" && Quantity != "") {
      myService.addCreditItem(obj).success(function (res) {
        if (res) {
          $scope.creditItemModal = !$scope.creditItemModal;
        }
      });
    } else {
      alert("Item name, Retail Price, & Quantity can't be empty!!");
    }
  }

  $scope.creditAdd = function () {
    myService.getAddCreditItem().success(function (res) {
      if (res) {
        $scope.items = res;
        $scope.creditAddModal = !$scope.creditAddModal;
      }
    });
  };

  $scope.detail = function () {
    $scope.creditItemModal = false;
    myService.getCreditItem().success(function (res) {
      if (res) {
        $scope.items = res;
        $scope.detailModal = true;
      }
    });
  };

  $scope.payUnpay = function (item) {
    console.log({ item })
    var obj = { item: item, due: !item.due }
    myService.updateCitem(obj).success(function (res) {
      if (res) {
        $scope.detail();
      }
    });
  }

  $scope.addToCartFromCredit = function (item, custId, addQty) {
    var obj = { customerName: $scope.chooseCustomers[custId].name, time: $scope.mytime, date: $scope.date, addQty, product: item, productNo: itemlength }
    myService.addToCartFromCredit(obj).success(function (res) {
      if (res) {
        $scope.customerCart(customerid); // to refresh the customer table after purchase
        if (productCat.length == 0) {
          getAllItem();
        } else {
          $scope.cartProduct(productCat); //to refresh the product table after purchase
        }
      }
    });
  };

  $scope.deleteTable = function () {
    var obj = { customerName: $scope.chooseCustomers[customerid].name }
    myService.deleteCustTable(obj).success(function (res) {
    });
    $route.reload();
  };

  $scope.deleteProduct = function (cProduct) { //delete Product from customerCart
    var updateTP = $scope.totalPrice - (cProduct.price * cProduct.purchasedQty); // this variable updating  Total price
    var obj = { cProduct: cProduct, updateTP, customerName: $scope.chooseCustomers[customerid].name }
    myService.deleteProduct(obj).success(function (res) {
      if (res) {
        $scope.customerCart(customerid);
        $scope.cartProduct(productCat); //to refresh the product table after purchase
      }
    });
  };

  //async use for await to work
  $scope.UpdateBill = async function (id, debit, paid, discount) { // update bill add debut to bill
    var obj = { debit: debit, customerName: $scope.chooseCustomers[id].name, billNo: $scope.slipId, date: $scope.date, time: $scope.mytime }
    await myService.UpdateBill(obj).success(function (res) { // await means nothing works till this function ends
      if (res) {
        alert('Bill is updated');
        $scope.payModal = false;
        $scope.customerCart(customerid);
      } else {
        alert("Bill isn't update");
      }
    });
    if (paid) {
      var paidObj = { customerName: $scope.chooseCustomers[id].name, date: $scope.date, discount: discount }

      myService.paidCustomers(paidObj).success(function (res) {
        if (res) {
          $route.reload();
        }
      });
    }
  };

  /**Discount Function */
  $scope.giveDiscount = function ($event, discount, totalPrice, resDebit) {
    var keyCode = $event.which || $event.keyCode;
    if (keyCode == 13 && discount != 0) {
      mydiscount(discount, totalPrice, resDebit);
    }
  };

  function mydiscount(discount, totalPrice, resDebit) {

    $scope.balance = totalPrice - discount - resDebit;
    $scope.discount = discount;

  };

  /**Function to run on ng-chage but enter */
  $scope.cartProduct(productCat);


  $scope.sIndex = -1;
  $scope.function = function (category, index) {
    if (minLength <= category.length) {
      if ($scope.sIndex <= index) {
        for (var i in $scope.chooseCategories) {
          if ($scope.chooseCategories[i].name == category) {
            productCat[index + 1] = $scope.chooseCategories[i].name; //save the category selected array to call it after anyOther function triger
            getCat(productCat);
            $scope.cartProduct(productCat);
            break;
          }
        }
      }
    }
  }

  var catArray = [];
  var minLength = 0;
  function getCat(parents) { //bring Category to drop down
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      minLength = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "", _id: "" + res[i]._id };
          catArray.push(obj);
          if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            minLength = res[i].categoryName.length;
          }
        }
        $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
        $scope.sIndex++;

      } else {
        $scope.chooseCategories = catArray;
      }
      $scope.add.cat = '';
      $scope.use = [];
      $scope.use = productCat;
    });
  };

  $scope.removeCat = function (position) {
    productCat.splice(position);
    $scope.sIndex = position - 2;
    $scope.add.Tindex = position - 1;
    getCat(productCat);
    $scope.cartProduct(productCat);
    $scope.add.cat = '';
  }
  /** Old Code for category choice 
  var catArray = [];
  var minLength = 0;
   function getCat(parents) { 
     myService.getCategory({ parents: parents }).success(function (res) {
       catArray = [];
       minLength = 50;
       if (res.length != 0) {
         for (var i in res) {
           var obj = { categoryId: i, name: "" + res[i].categoryName + "", _id: "" + res[i]._id };
           catArray.push(obj);
           if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
             minLength = res[i].categoryName.length;
           }
         }
         $scope.chooseCategories[$scope.sIndex + 1] = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
         $scope.sIndex++;
         use.push({});
         $scope.use = use;
       } else {
         for (i in $scope.chooseCategories[$scope.sIndex]) {
           if (minLength > $scope.chooseCategories[$scope.sIndex][i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
             minLength = $scope.chooseCategories[$scope.sIndex][i].categoryName.length;
           }
         }
       }
     });
   };
  
   $scope.sIndex = -1;
   $scope.function = function (category, index) {
     if (minLength <= category.length) {
       if ($scope.sIndex >= index) {
         for (var i in $scope.chooseCategories[$scope.sIndex]) {
           if ($scope.chooseCategories[$scope.sIndex][i].name == category) {
             productCat[index + 1] = $scope.chooseCategories[$scope.sIndex][i].name; //save the category selected array to call it after anyOther function triger
             getCat(productCat);
             $scope.cartProduct(productCat);
             break;
           }
         }
       }
     }
   }
  /**End old way */

  var custArray = [];
  function getCust() { //bring customer to drop down
    myService.getCustomer().success(function (res) {
      custArray = [];
      if (res) {
        for (var i in res) {
          var obj = { customerId: i, name: "" + res[i].customerName };
          custArray.push(obj);
        }
        $scope.chooseCustomers = custArray;
      }
    });
  };

  $scope.Reload = function () {
    $route.reload();
  };

  $scope.show = function () { // open model of customerCart to print
    $scope.payModal = false;
    $scope.showModal = true;
  };

  $scope.pay = function () {
    $("#debit").val(0);
    $("#check").val(false);
    $("#discount").val(0);
    $scope.balance = $scope.totalPrice - $scope.resDebit;
    $scope.showModal = false;
    $scope.payModal = true;
  };

  $scope.print = function () { //print a function
    window.print();
  };
  /**Pay track Start */
  $scope.payTrack = function () {
    myService.payTrack({ id: $scope.slipId }).success(function (res) {
      if (res) {
        $scope.showTrack = res.ledger;
        $scope.paymentTrack = true;
      }
    });
  }
  /**Pay tack End */
});

app.controller("CustomerDetail", function ($scope, myService, $window, $rootScope) {
  $rootScope.loggedOut = true;

  myService.custDetail().success(function (res) {
    if (res) {
      $scope.custArray = res;
      console.log()
    }
  });

  $scope.deleteCustumer = function (cust) {
    console.log({ cust })
    myService.deleteCustomer(cust).success(function (res) {
      if (res) {
        console.log({ res })

        $scope.custArray = res;
        console.log($scope.custArray)
      }
    });
  }
});

app.controller("addNewCust", function ($route, $scope, myService, $rootScope) {
  $rootScope.loggedOut = true;
  $scope.Reload = function () {
    $route.reload();
  }

  $scope.addCust = function () {
    if ($scope.name != undefined && $scope.phone != undefined) {
      var obj = { name: $scope.name, email: $scope.email, address: $scope.address, phone: $scope.phone };
      //console.log('in SalesmanAdd');
      myService.addCustomer(obj).success(function (res) {
        if (res.name) {
          alert('Customer already added');
        } else
          if (res == false) {
            alert("Problem in adding your item");
          }
          else {
            alert("New customer added!");
            $route.reload();
          }
      });
    } else {
      alert('Please Enter customer Name and Phone #')
    }
  }

});

app.controller("stockInventory", function ($scope, myService, $routeParams, $rootScope, $location, $timeout, $window, $interval, $route) {
  $rootScope.loggedOut = true;
  $scope.add = {};
  // getAllItem(); // call all catgeory
  getSup();  /**call 
  all supplier */
  // getItemCat(); /** call all category */
  // getAllCat()

  $interval(function () {
    var d = new Date();
    $scope.mtime = d.toLocaleTimeString();
    $scope.mdate = d.toDateString();
  }, 1000);
  $scope.itemPrice = false;
  $scope.itemCategoryModal = false;
  $scope.AddCategoryModal = false;
  $scope.addTrue = false;
  $scope.per = true;
  $scope.Rs = false;
  $scope.showRetail = 'Retail'
  $scope.showMRP = 'MRP'
  $scope.showAddSupplier = false;
  $scope.balance = 0;

  var newItemCatAray = [];
  newItemCatAray[0] = 'parent'
  var catuse = [];
  getItem(newItemCatAray); // call all catgeory
  // getCat(newCategory); //not Working

  getCat(newItemCatAray);
  /**Buttons */
  $scope.showSAdd = function () { //show add supplier fields
    $scope.showAddSupplier = true;
  }

  $scope.showbill = function () {
    if ($scope.selectedSupplier) {  //check if supplier is selected
      if ($scope.bill_No != null) {
        $scope.balance = 0;
        // $scope.balanceModal = true; //Debit or credit Modal
        for (i in purchase) {
          $scope.balance = $scope.balance + (purchase[i].additem * purchase[i].itemWholesale); // calculate Balance
        }
        setTimeout(() => { // delay to open showPurcahse modal to get focus
          $scope.purchased = purchase;
          $scope.showPurchase = true;
        }, 400)
      } else {
        alert('Enter Bill No')
      }
    } else {
      alert('Supplier is not selected')
    }

  }

  $scope.inRs = function () { //show if retail is in % or Rs
    $scope.per = !$scope.per;
    $scope.Rs = !$scope.Rs;
    $scope.add.MRP = "";
    $scope.add.retailRs = "";
  }

  $scope.conversion = function ($event) { // just to show retail price in the field it wasn't needed
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.add.MRP != "") { // convert percentage  to retail price
        var retailPer = $scope.add.WholeRs * $scope.add.MRP / 100;
        var retailPrice = $scope.add.WholeRs + retailPer;
        $scope.showRetail = Math.round(retailPrice);
      } else if ($scope.add.showRetail != "") {  // convert retail price  to  percentage
        var retailPrice = $scope.add.retailRs - $scope.add.WholeRs;
        var retailPer = retailPrice / $scope.add.WholeRs * 100
        $scope.showMRP = Math.round(retailPer);
      }
    }
  }

  $scope.enter = function ($event) { // this function only to make input to go next line when Enter
    var that = document.activeElement; //this is used to get focus function
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      $('[tabIndex=' + (+that.tabIndex + 1) + ']')[0].focus(); // changed the key focus to Next tabIndex
    }
  }
  /**Buttons end */
  /** Working function */

  var spare = [];
  $scope.getCate = function (id) { //get category according to the suplier
    $scope.supplierChoose = $scope.chooseSupplier[id].name; //make agnular variable to show supplier name on the slip
    $scope._id = id;

    // var obj = { supplier: $scope.supplierChoose }
    // var array = [];
    // var catid = 1;
    // var MT = { categoryId: 0, name: "" + " " }
    // array.push(MT);
    // myService.getItemBySupplier(obj).success(function (res) { // check all items for supplier
    //   if (res) {
    //     for (var i in res) {
    //       res[i]['category'] = res[i].itemCategory[res[i].itemCategory.length - 1]
    //     }
    //     spare = res; // save items to call them into category
    //     $scope.items = spare; // to show in table
    //     $scope.purchased = []; // null $scope array to show in modal 
    //     purchase = []; // null array that give scope to array 
    $scope.addTrue = true;
    //   }
    // });
  }

  var purchase = [];
  $scope.addinStock = function ($event, item, additem, index) { // add added item in supplier function
    // var done;
    var keyCode = $event.which || $event.keyCode;
    // if (keyCode === 8) { if (additem == null) done = true; else done = false; }
    if (keyCode === 13) {       //|| done
      if (additem != null && additem != "") {
        $scope.add.price = item.itemWholesale; //
        $scope.itemPrice = true; // open modal 

        /**Method Function to set Sale Price */
        $scope.methodFunction = function (method, price, manualPrice) {
          if (method == 'Manual') {
            if (manualPrice != null && manualPrice != '') {
              // input1 cost price purchaase input2 manual select
              addInArray(item, manualPrice, additem);
            }
          } else if (method == 'LCP') {

            // input1 cost price purchaase input2 show with last cost Price
            addInArray(item, price, additem)
          } else if (method = 'MA') {
            // input1 cost price purchaase input2 Moving average
            myService.showAve({ price: price, barcode: item.barcode }).success(function (res) {
              if (res) {
                // $scope.items[index].itemWholesale = res.price;
                console.log('bask', res.price);
                addInArray(item, res.price, additem)
              }
            });
          }
        }
        /**End of Method FUnction */
      }
    }
  }

  function addInArray(item, price, additem) {
    item['additem'] = additem; // push into object (push add item qty in array)
    item['itemQty'] = item['itemQty'] + additem;
    item['itemWholesale'] = price;
    purchase.push(item);
    $scope.add.manualPrice = '';
    alert(additem + ' item of ' + item.itemName + ' is added in the list');

    $scope.balance = 0;
    $scope.totalit = 0;
    for (i in purchase) {
      $scope.balance = $scope.balance + (purchase[i].additem * purchase[i].itemWholesale); // calculate Balance
      $scope.totalit = $scope.totalit + purchase[i].additem;
    }
    $scope.itemPrice = false;
  }


  $scope.printSlip = function () { // this function changes data and print function
    var obj = { purchase: purchase };
    // var barcode = [];
    // var additem = [];
    var purchaseItems = [];
    for (i in purchase) {
      // barcode[i] = purchase[i].barcode; // Don't neeed these two anymore will remove it and chang it in updateData nodejs when git time
      // additem[i] = purchase[i].additem;
      purchaseItems[i] = { barcode: purchase[i].barcode, purchaseQty: purchase[i].additem, price: purchase[i].itemWholesale }
    }
    var obj = { purchaseItems: purchaseItems }
    myService.updateData(obj).success(function (res) {
      // console.log(res)
    });

    var billObj = {
      date: $scope.mdate, credit: $scope.credit, debit: $scope.debit, bill_No: $scope.bill_No,
      supplierName: $scope.supplierChoose, purchaseItems: purchaseItems
    }

    myService.addBill(billObj).success(function (res) {
      if (res == false) {
        alert('Bill No for this Supplier is already added');
      } else {
        $window.print();
        arrays = [];
        var arr;
        for (i in purchase) {
          arr = printBarcodefunc(purchase[i].additem, purchase[i]);
        }
        printwindow(arr, 1);
        $scope.barcodemodal = false;
      }
    });
    // $window.location.reload()

    // $scope.reload() //This wasn't working here so use widnow reload

  }

  $scope.barcode = function (item) { // appear modal to ask for quantity
    $scope.barcodemodal = true;
    $scope.PitemBar = item;
  }

  $scope.addNewItem = function () {

    if ($scope.add.MRP != "") { // change wohalse to mrp
      var retailPer = Number($scope.add.WholeRs) * Number($scope.add.MRP) / 100;
      $scope.add.retailRs = Number($scope.add.WholeRs) + retailPer;
      $scope.add.retailRs = Math.round($scope.add.retailRs);
    }
    if ($scope.add.name != "" && $scope.add.decs != "" && $scope.add.additem != "" && $scope.add.WholeRs != "" && $scope.add.retailRs != "" && $scope.add.type != "" && $scope.add.category != "" && $scope.add.size != "" && $scope.add.code != "") {
      var addObj = {
        itemName: $scope.add.name, itemDesc: $scope.add.decs, itemQty: $scope.add.additem, itemWholesale: $scope.add.WholeRs, additem: $scope.add.additem,
        itemRetail: $scope.add.retailRs, itemCategory: newItemCatAray, type: $scope.add.type, size: $scope.add.size, code: $scope.add.code, itemSupplier: $scope.supplierChoose
      };
      var barcode;
      myService.addItem(addObj).success(function (res) {
        if (res.itemName) {
          alert("item is already in");
        }
        else if (res == false) {
          alert("Problem in adding your item");
          check = false;
        } else {
          barcode = res.barcode;
          addObj['barcode'] = barcode
          addObj['category'] = newItemCatAray[newItemCatAray.length - 1]
          purchase.push(addObj);
          $scope.items.push(addObj);
          $scope.balance = 0; $scope.totalit = 0;
          for (i in purchase) {
            $scope.balance = $scope.balance + (purchase[i].additem * purchase[i].itemWholesale); // calculate Balance
            $scope.totalit = $scope.totalit + purchase[i].additem;
          }
        }
      });

      $scope.add.name = ""; $scope.add.decs = ""; $scope.add.additem = ""; $scope.add.WholeRs = ""; $scope.add.MRP = ""; $scope.add.retailRs = "";
      $scope.add.type = ""; $scope.add.category = ""; $scope.add.size = ""; $scope.add.code = "";
      // $scope.selectedSupplier = $scope.chooseSupplier[$scope._id];
    } else {
      alert('filed is empty')
    }
  }

  $scope.addSupp = function (supName) {
    var abc = { supplierName: supName };
    //console.log('adding', abc);
    myService.addPurchaser(abc).success(function (res) {
      if (res == true) {
        alert('New supplier ' + supName);
        $scope.supName = "";
        $scope.showAddSupplier = false;
        // $scope.reload() //This wasn't working here so use widnow reload
        $window.location.reload()
      }
      else {
        alert('Supplier is already Added!');
      }
    });
  }

  $scope.printOldBarcode = function (printQty, PitemBar) { // modal btn function to print barcode only print barcode nothing much
    arrays = [];
    var arr = printBarcodefunc(printQty, PitemBar);

    printwindow(arr, 0);

    $("#pqty").val(''); // do null to the modal field
    $scope.barcodemodal = false; // close modal
  }

  /** call functions */
  /** Barcode function brokr into two so it can print more than one item barcode at a time */
  var arrays = [];
  function printBarcodefunc(printQty, PitemBar) { // make barcode for the barcode or barcodes

    var barcode = new bytescoutbarcode128();
    zeroAppend = ""
    if (PitemBar.barcode <= 100) {
      zeroAppend += "0000"
    } else if (PitemBar.barcode <= 1000) {
      zeroAppend += "000"
    }
    else if (PitemBar.barcode <= 10000) {
      zeroAppend += "00"
    } else if (PitemBar.barcode <= 100000) {
      zeroAppend += "0"
    }

    barcode.valueSet(zeroAppend + PitemBar.barcode);
    barcode.setMargins(5, 5, 5, 5);
    barcode.setBarWidth(2);
    var width = barcode.getMinWidth();
    barcode.private_fontSize = 20;
    barcode.setSize(width, 120);
    var barcodeImage = document.getElementById('barcodeImage');
    barcodeImage.src = barcode.exportToBase64(width, 120, 0);

    var convert = cipher(PitemBar.itemWholesale);
    var name = PitemBar.itemName;
    if (PitemBar.itemName && PitemBar.itemName.length > 25) {
      name = name.substring(0, 25);
    }

    var dressUpFontSize = 120;
    var criticalFontSize = 100;


    /**HAssan- Ali*/
    var MYS = '<div style=" width:50% ;float:left">'
      + '<div style="padding-left:10%;line-height:150px;">'
      + '<div><span style="font-size:' + dressUpFontSize + 'px;">Dress Up</span></div>'
      + '<div><span>' + PitemBar.type + '</span>'
      + '<span style="float:right; padding-right:20%; font-size:' + criticalFontSize + 'px;">' + PitemBar.size + '</span></div>'
      + '<div>' + PitemBar.code + '</div>'
      + '<div>' + convert + '</div>'
      + '</div> </div>'

      + '<div style="width:50% ;float:right;">'
      + '<div><img id="barcodeImage" style="width:90%" class="barImg" src="' + barcodeImage.src + '" /></div>'
      + '<div> '//<div style="font-size:18px;">' + PitemBar.size + '</div>
      + '<div style="font-size:' + criticalFontSize + 'px;">' + name + '</div> '
      + '<div><span>Rs: ' + PitemBar.itemRetail + '</span></div>  </div>'
      + '</div>';


    var myVal = { text: MYS };
    for (var i = 1; i <= printQty; i++) {
      arrays.push(myVal);
    }
    return arrays;
  }

  function printwindow(arrays, ref) { // print barcode that saves in PrintBarcodefunc function
    var uselessFontSize = 100;
    $timeout(function () {
      $scope.showOld = false;
      var mywindow = window.open('', 'PRINT', 'height=2000,width=1500');
      mywindow.document.write('<html><head>');
      mywindow.document.write('<style>');
      mywindow.document.write('.nameClass{ font-weight:bold; text-transform:uppercase; font-family:MONOSPACE; letter-spacing: 5px;}');
      mywindow.document.write('</style>');
      mywindow.document.write('</head><body style=" margin:0; padding: 0;">');
      for (var i = 0; i < arrays.length; i++) {
        mywindow.document.write('<div class= "nameClass" style="width:1900px; margin-bottom:10px;height:937px; font-size: ' + uselessFontSize + 'px;">');
        mywindow.document.write(arrays[i].text);
        mywindow.document.write('</div>');
      }
      mywindow.document.write('</body></html>');
      setTimeout(() => {
        mywindow.print();
        mywindow.close();
      }, 1000)

      // mywindow.close();
    }, 1000);
  }
  /** END of two part barcode*/

  $scope.showItemCat = function (category) {
    $scope.thisCat = category;
    $scope.itemCategoryModal = true;
  }

  function getSup() { //get suplier in select box
    var array1 = [];
    myService.getSupplier().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { supplierId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  };

  function getItem(parents) { // call all item to show
    var obj = { itemCategory: parents }
    myService.cartProducts(obj).success(function (res) {
      if (res) {
        $scope.items = res;
        spare = res;
        for (i in res) {
          res[i]['category'] = res[i].itemCategory[res[i].itemCategory.length - 1]
        }
        $scope.items = res;
        spare = res;
      }
    });
  };
  //Not working at this functions at the moment

  $scope.sIndex = -1;
  $scope.function = function (category, index) {
    console.log({ category }, { index })
    if (min <= category.length) {
      if ($scope.sIndex <= index) {
        for (var i in $scope.chooseCategories) {
          if ($scope.chooseCategories[i].name == category) {
            newItemCatAray[index + 1] = $scope.chooseCategories[i].name; //save the category selected array to call it after anyOther function triger
            getCat(newItemCatAray);
            // $scope.cartProduct(productCat);
            $scope.customFilter(spare, newItemCatAray)
            break;
          }
        }
      }
    }
  }


  $scope.customFilter = function (find, search) {
    var result = [];
    angular.forEach(find, function (value, key) {
      var len = search.length;
      var catToSearch = value.itemCategory.slice(0, len);
      console.log(value.itemCategory, { search }, { catToSearch })
      console.log(angular.equals(search, catToSearch))
      if (angular.equals(search, catToSearch)) {
        result.push(value);
      }
    });
    console.log({ result })
    $scope.items = result;
  }

  $scope.removeCat = function (position) {
    newItemCatAray.splice(position);
    $scope.sIndex = position - 2;
    $scope.Tindex = position - 1;
    getCat(newItemCatAray);
    $scope.customFilter(spare, newItemCatAray);
    $scope.cat = '';
  }

  var min = 0;
  function getCat(parents) { //bring Category to drop down // categoey dropdown is disabled
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      min = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "" };
          catArray.push(obj);
          if (min > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            min = res[i].categoryName.length;
          }
        }
        $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
        $scope.cat = '';
        $scope.catuse = [];
        $scope.catuse = newItemCatAray;
      }
    });
  };

  /**End oof Not working */
  /** call functions END */
});

app.controller("editItem", function ($scope, myService, $interval, $routeParams, $location, $route, $rootScope) {

  $rootScope.loggedOut = true;
  $scope.deletepage = false;
  var editCat = false;
  $scope.edit = [{}];
  var newCategory = [];
  newCategory[0] = 'parent'
  var catuse = [];
  getItem(newCategory); // call all catgeory
  getCat(newCategory);
  getSup();  /**call all supplier */
  // getAllCat(); /** call all category */

  $interval(function () {
    var d = new Date();
    $scope.mtime = d.toLocaleTimeString();
    $scope.mdate = d.toDateString();
  }, 1000);

  $scope.conversion = function ($event, id) { // just to show retail price in the field it wasn't needed
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
      if ($scope.edit[id].MRP != "") { // convert percentage  to retail price
        var retailPer = $scope.edit[id].ItemWholesale * $scope.edit[id].MRP / 100;
        var retailPrice = $scope.edit[id].ItemWholesale + retailPer;
        $scope.edit[id].ItemRetail = Math.round(retailPrice);
      }
    }
  }

  /**Buttons end */
  /** Working function */
  $scope.delete = function (item) {
    myService.delete(item).success(function (res) {
      if (res) {
        //console.log(res);
        // $scope.stockShow = false;
        alert("Item Deleted");
        $route.reload();
      } else {
        alert("can't delete sale item");
      }
    });
  }

  var newItemCategory = []
  $scope.updateItem = function (item, id) {
    if (editCat) {
      var myarray = newItemCategory;
    } else {
      var myarray = item.itemCategory;
    }
    var updateObj = {
      barcode: item.barcode, itemName: $scope.edit[id].ItemName, itemDesc: $scope.edit[id].ItemDesc, type: $scope.edit[id].Type,
      size: $scope.edit[id].Size, code: $scope.edit[id].Code, itemSupplier: $scope.edit[id].ItemSupplier, itemCategory: myarray,
      itemWholesale: $scope.edit[id].ItemWholesale, itemRetail: $scope.edit[id].ItemRetail, itemQty: $scope.edit[id].ItemQty
    }
    myService.updateItem(updateObj).success(function (res) {
      console.log(updateObj);
      if (res) {
        console.log(res)
        alert('updated');
        editCat = true;
        $route.reload();
      } else {
        alert('Not update');
      }
    });
  }
  /** call functions */

  /** Barcode function brokr into two so it can print more than one item barcode at a time */
  var use = [];
  $scope.showItemCat = function (fine) {
    editCat = false;
    use = [];
    newItemCategory = [];
    $scope.thisCat = fine;
    newItemCategory[0] = 'parent'
    getAddCat(newItemCategory);
    $scope.itemCategoryModal = true;
  }

  $scope.editCategory = function () {
    $scope.itemCategoryModal = false;
  }

  $scope.itemfunction = function (category, index) {
    if (minLength <= category.length) {
      for (var i in $scope.itemCategories) {
        if ($scope.itemCategories[i].name == category) {
          newItemCategory[index + 1] = category;
          editCat = true;
          getAddCat(newItemCategory);
          break;
        }
      }
    }
  }

  var catArray = [];
  var minLength = 0;
  function getAddCat(parents) { //bring Category to drop down
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      minLength = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "" };
          catArray.push(obj);
          if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            minLength = res[i].categoryName.length;
          }
        }
        $scope.itemCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
        use.push({});
        $scope.use = use;
      }
    });
  };

  /** END of two part barcode*/
  $scope.creditAdd = function () {

  }

  function getSup() { //get suplier in select box
    var array1 = [];
    myService.getSupplier().success(function (res) {
      if (res) {
        //console.log(res);
        for (var i in res) {
          var obj = { supplierId: i, name: "" + res[i].supplierName };
          array1.push(obj);
        }
        $scope.chooseSupplier = array1;
      }
    });
  };

  function getItem(parents) { // call all item to show
    var obj = { itemCategory: parents }
    myService.cartProducts(obj).success(function (res) {
      if (res) {
        $scope.items = res;
        spare = res;
        for (i in res) {
          res[i]['category'] = res[i].itemCategory[res[i].itemCategory.length - 1]
        }
        $scope.items = res;
        spare = res;
      }
    });
  };

  $scope.sIndex = -1;
  $scope.function = function (category, index) {
    if (minLength <= category.length) {
      if ($scope.sIndex <= index) {
        for (var i in $scope.chooseCategories) {
          if ($scope.chooseCategories[i].name == category) {
            newCategory[index + 1] = $scope.chooseCategories[i].name; //save the category selected array to call it after anyOther function triger
            getCat(newCategory);
            // $scope.cartProduct(productCat);
            getItem(newCategory);
            break;
          }
        }
      }
    }
  }

  var minLength = 0;

  function getCat(parents) { //bring Category to drop down
    myService.getCategory({ parents: parents }).success(function (res) {
      catArray = [];
      minLength = 50;
      if (res.length != 0) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName + "", _id: "" + res[i]._id };
          catArray.push(obj);
          if (minLength > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
            minLength = res[i].categoryName.length;
          }
        }
        $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
        $scope.sIndex++;

      } else {
        $scope.chooseCategories = catArray;
      }
      $scope.edit.cat = '';
      $scope.use = [];
      $scope.use = newCategory;
    });
  };
  $scope.removeCat = function (position) {
    newCategory.splice(position);
    $scope.sIndex = position - 2;
    $scope.edit.Tindex = position - 1;
    getCat(newCategory);
    getItem(newCategory);
    $scope.edit.cat = '';
  }
  //End of not working
  /** call functions END */
});

app.controller('cat', function ($scope, myService) {
  $scope.sIndex = -1;
  $scope.add = {};
  var use = [{}];
  var parentId = 'parent'
  getCat(parentId);
  var array = [];
  $scope.use = use;
  var id = -1;

  $scope.function = function ($event, category, index) {
    $scope.sIndex = index;
    console.log(index)
    var keyCode = $event.which || $event.keyCode;
    if (keyCode == 13) {
      if (index == 0) {
        array[index] = category;
        find_id(category);
      } else {
        array[index] = category;
        find_id(category);
      }
      if (id == index - 1) {
        use.push({});
        $scope.use = use;
        id = index;
      }
    }
  }

  $scope.checkButton = async function () {
    var id = 'parent';
    add = false;
    for (var i in array) {
      var obj = { categoryName: array[i], parentId: id };
      console.log(obj);
      await myService.addCategory(obj).success(function (res) {
        if (res.id) {
          id = res.id;
          if (res.find == 'find') {
            add = true;
          }
        }
      });
    }
    if (add) {
      alert('New Category added');
    }
  }

  function find_id(category) {
    var no = false;
    for (var i in $scope.chooseCategories[$scope.sIndex]) {
      if ($scope.chooseCategories[$scope.sIndex][i].name == category) {
        parentId = $scope.chooseCategories[$scope.sIndex][i]._id;
        getCat(parentId);
        no = true;
        break;
      }
    }
    if (!no) {
      parentId = 'new'
      getCat(parentId);
    }
  }

  var catArray = [];
  $scope.chooseCategories = [], []
  function getCat(parentId) { //bring Category to drop down

    myService.getCategory({ parentId: parentId }).success(function (res) {
      catArray = [];
      if (res) {
        for (var i in res) {
          var obj = { categoryId: i, name: "" + res[i].categoryName, _id: "" + res[i]._id };
          catArray.push(obj);
        }
        $scope.chooseCategories[$scope.sIndex + 1] = catArray;
      }
    });
  };

});

function cipher(number) { // change wholesale price to code
  //console.log("number before " + number);
  var digits = number.toString().split('');
  var realDigits = digits.map(Number)
  //console.log('realDigits ' + realDigits);
  var convert = '';
  for (var i = 0; i < digits.length; i++) {

    switch (realDigits[i]) {
      case 1:
        convert = convert + 'B';
        break;
      case 2:
        convert = convert + 'L';
        break;
      case 3:
        convert = convert + 'A';
        break;
      case 4:
        convert = convert + 'C';
        break;
      case 5:
        convert = convert + 'K';
        break;
      case 6:
        convert = convert + 'H';
        break;
      case 7:
        convert = convert + 'O';
        break;
      case 8:
        convert = convert + 'R';
        break;
      case 9:
        convert = convert + 'S';
        break;
      case 0:
        convert = convert + 'E';
        break;
    }
  }
  //console.log("encripted " + convert);
  return convert;
}

/**Just in case for editIte controller  */
// function getCat(parents) { //bring Category to drop down
  //   myService.getCategory({ parents: parents }).success(function (res) {
  //     console.log(parents)
  //     catArray = [];
  //     min = 50;
  //     if (res.length != 0) {
  //       for (var i in res) {
  //         var obj = { categoryId: i, name: "" + res[i].categoryName + "" };
  //         catArray.push(obj);
  //         if (min > res[i].categoryName.length) { //set the least charter in the list to the variable for ng-change function
  //           min = res[i].categoryName.length;
  //         }
  //       }
  //       $scope.chooseCategories = catArray; // add select into the new field doesnot work want to no get lost all category when other s slectedwill to it later
  //       catuse.push({});
  //       $scope.catuse = catuse;
  //     }
  //   });
  // };

  // $scope.function = function (category, index) {
  //   console.log('this')
  //   if (min <= category.length) {
  //     for (var i in $scope.chooseCategories) {
  //       if ($scope.chooseCategories[i].name == category) {
  //         newCategory[index + 1] = category;
  //         getCat(newCategory);
  //         getItem(newCategory);
  //         break;
  //       }
  //     }
  //   }
  // };