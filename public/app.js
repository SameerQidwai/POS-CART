'use strict';


var app = angular.module('myApp', ['myApp.controllers', 'myApp.services', 'ngRoute', 'AngularPrint', 'ngSanitize'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
      when("/login", { templateUrl: "partials/login.html", controller: "loginUser" }).
      when("/pos", { templateUrl: "partials/POS.html", controller: "pointOfSale" }).
      when("/Stock", { templateUrl: "partials/Stock.html", controller: "myStock" }).
      when("/soldItem", { templateUrl: "partials/logout.html", controller: "LogoutController" }).
      when("/dataEntry", { templateUrl: "partials/dataentry.html", controller: "dataEntry" }).
      when("/dailyReport", { templateUrl: "partials/dailyreport.html", controller: "dailyReport" }).
      when("/salesReport", { templateUrl: "partials/monthlyReport.html", controller: "monthlyReport" }).
      when("/lastSale", { templateUrl: "partials/lastSale.html", controller: "lastSale" }).
      when("/userGuide", { templateUrl: "partials/editName.html", controller: "editName" }).
      when("/supplierDetail", { templateUrl: "partials/supplierDetail.html", controller: "supplierDetail" }).
      when("/supplierLedger", { templateUrl: "partials/supplierLedger.html", controller: "supplierLedger" }).
      when("/newBill", { templateUrl: "partials/newBill.html", controller: "newBill" }).
      when("/addSalesman", { templateUrl: "partials/addSalesman.html", controller: "addSalesman" }).
      when("/SmanReport", { templateUrl: "partials/SmanReport.html", controller: "SmanReport" }).
      when("/customSalesReport", { templateUrl: "partials/customSalesReport.html", controller: "customSalesReport" }).
      when("/posCart", { templateUrl: "partials/posCart.html", controller: "posCart" }).
      when("/CustomerBill", { templateUrl: "partials/CustomerBill.html", controller: "CustomerBill" }).
      when("/addNewCust", { templateUrl: "partials/addNewCust.html", controller: "addNewCust" }).
      when("/stockInventory", { templateUrl: "partials/stockInventory.html", controller: "stockInventory" }).
      when("/editItem", { templateUrl: "partials/editItem.html", controller: "editItem" }).
      when("/CustomerDetail", { templateUrl: "partials/CustomerDetail.html", controller: "CustomerDetail" }).
      when("/customerTrack", { templateUrl: "partials/customerTrack.html", controller: "customerTrack" }).

      otherwise({ redirectTo: '/login' });



  }]).directive('contenteditable', function () {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function () {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function () {
          scope.$apply(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html == '<br>') {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  }).directive('modal', function () {
    return {
      template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function (value) {
          if (value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = true;
          });
          //Make sure the modal and backdrop are siblings (changes the DOM)
          $(this).before($('.modal-backdrop'));
          //Make sure the z-index is higher than the backdrop
          $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
        });

        $(element).on('hidden.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
app.directive('barcode', function () {
  return {
    restrict: 'AE',
    template: '<img id="barcodeImage" align="middle" src="{{src}}"/>',
    scope: {
      food: '='
    },
    link: function ($scope) {
      $scope.$watch('food', function (food) {
        var barcode = new bytescoutbarcode128();
        var space = "  ";

        barcode.valueSet($scope.myInput);
        barcode.setMargins(5, 5, 5, 5);
        barcode.setBarWidth(2);
        try {
          var width = barcode.getMinWidth();
          barcode.setSize(width, 800);
          $scope.src = barcode.exportToBase64(width, 800, 0);
        }
        catch (err) {
        }
      }, true);
    }
  }
})
// .directive('keyboardPoster', function($parse, $timeout){
//   var DELAY_TIME_BEFORE_POSTING = 0;
//   return function(scope, elem, attrs) {

//     var element = angular.element(elem)[0];
//     var currentTimeout = null;

//     element.oninput = function() {
//       var model = $parse(attrs.postFunction);
//       var poster = model(scope);

//       if(currentTimeout) {
//         $timeout.cancel(currentTimeout)
//       }
//       currentTimeout = $timeout(function(){
//         poster(angular.element(element).val());
//       }, DELAY_TIME_BEFORE_POSTING)
//     }
//   }
// }); 