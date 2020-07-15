// var urls = "http://127.0.0.1:8100"
var urls = "https://poscartsystem.herokuapp.com/"
angular.module('myApp.services', []).
    factory('myService', function ($http) {

        var ergastAPI = {};

        ergastAPI.registerUser = function (data) {
            var req = {
                method: 'POST',
                url: urls + '/register',

                data: data
            };
            return $http(req);

        }

        ergastAPI.login = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/login',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addCategory = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/addCategory',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateEntry = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/updateEntry',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/addBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/getBill',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.returnSale = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/returnSale',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getCategory = function (abc) {
            var req = {
                method: 'POST',

                url: urls + '/getCategory',
                data: abc

            };
            return $http(req);
        }

        ergastAPI.addPurchaser = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/addPurchaser',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSupplier = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                url: urls + '/getSupplier',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getDailySlip = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getDailySlip',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSupDetail = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getSupDetail',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getMonthlySlip = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getMonthlySlip',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addItem = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/addItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteSale = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/deleteSale',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getItem = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sync1 = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/sync1',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSoldItems = function () {
            var abc = { this: 'asd' };

            var req = {
                method: 'POST',
                url: urls + '/getSoldItems',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sync = function () {
            var abc = { this: 'asd' };

            var req = {
                method: 'POST',
                url: urls + '/sync',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.sendSale = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/sendSale',

                data: abc
            };
            return $http(req);
        }
        ergastAPI.Salesman = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/Salesman',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSaleman = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',

                url: urls + '/getSaleman',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getSalemanReport = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getSalemanReport',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.startday = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/startday',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.dayExpense = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/dayExpense',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.weeklyReport = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/weeklyReport',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.refreshStartday = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/refreshStartday',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.cartProducts = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/cartProducts',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getCustomer = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',

                url: urls + '/getCustomer',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.addCustomer = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/addCustomer',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addToCart = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/addToCart',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.customerCart = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/customerCart',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteProduct = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/deleteProduct',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.developBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/developBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.UpdateBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/UpdateBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.showBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/showBill',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.paidCustomers = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/paidCustomers',
                data: abc
            };

            return $http(req);
        }

        ergastAPI.showPaidCustomers = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',

                url: urls + '/showPaidCustomers',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteCustTable = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/deleteCustTable',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getAllItem = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'POST',
                url: urls + '/getAllItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getItemBySupplier = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getItemBySupplier',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateData = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/updateData',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.getItems = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getItems',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.paymentOrBill = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/paymentOrBill',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateItem = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/updateItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addCreditItem = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/addCreditItem  ',

                data: abc
            };
            return $http(req);
        }
        ergastAPI.getCreditItem = function () {
            var abc = { asd: 'asd' };

            var req = {
                method: 'POST',
                url: urls + '/getCreditItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.addToCartFromCredit = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/addToCartFromCredit  ',

                data: abc
            };
            return $http(req);
        }
        ergastAPI.delete = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/delete',
                data: abc
            };
            return $http(req);
        }
        ergastAPI.getAllCategory = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/getAllCategory',
                data: abc
            };
            return $http(req);
        }

        ergastAPI.getAddCreditItem = function () {
            var abc = { asd: 'asd' };

            var req = {
                method: 'POST',
                url: urls + '/getAddCreditItem',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.updateCitem = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/updateCitem',
                data: abc
            };
            return $http(req);
        }
        ergastAPI.payUnpay = function (abc) {

            var req = {
                method: 'POST',
                url: urls + '/payUnpay  ',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.showAve = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/showAve',

                data: abc
            };
            return $http(req);
        }
        
        ergastAPI.custDetail = function () {
            var abc = { asd: 'asd' };
            var req = {
                method: 'GET',
                url: urls + '/custDetail',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.deleteCustomer = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/deleteCustomer',

                data: abc
            };
            return $http(req);
        }

        ergastAPI.payTrack = function (abc) {
            var req = {
                method: 'POST',
                url: urls + '/payTrack',

                data: abc
            };
            return $http(req);
        }

        return ergastAPI;
    });