'use strict';

angular.module('app').factory('LoginFactory', function($q, $http, $state) {
    var factory = {
        loggedInUser: {},
        isAuthenticated: false,
        loginType: null
    };

    var app_base = "../";
    // var app_base = "../app/";

    var website = 'https://aspirare-api.herokuapp.com';
    var URL = website;

    factory.login = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/login',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            if (success.data.Data != null) {
                factory.loggedInUser = success.data.Data[0];
                $http.defaults.headers.common['Authorization'] = success.data.Data[0].Token;
                factory.isAuthenticated = true;
            }
            d.resolve(success);
        }, function(error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.loginCollege = function(selectedCollege, type) {
        factory.loginType = type;
        factory.loggedInUser = selectedCollege;
        factory.loggedInUser.OldPackageCode = factory.loggedInUser.PackageCode;
        $http.defaults.headers.common['Authorization'] = selectedCollege.Token;
        factory.isAuthenticated = true;
        if (type == 1) { // admin
            factory.loggedInUser.Role = 'ADMIN';
        } else { // faculty or staff
            if (factory.loggedInUser.Role == 'ADMIN') {
                factory.loggedInUser.Role = 'FACULTY';
            }
        }
        if ($state.current.name == 'app.main') {
            $state.reload();
        } else {
            if (factory.loggedInUser.Role == 'LIBRARIAN') {
                $state.go('app.library.bookList');
            } else {
                $state.go('app.main');
            }
        }
    };

    factory.logout = function() {
        factory.isAuthenticated = false;
    };

    factory.getBaseUrl = function() {
        return website;
    };

    factory.getAppBase = function() {
        return app_base;
    };

    return factory;
});