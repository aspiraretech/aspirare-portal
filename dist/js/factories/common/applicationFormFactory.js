'use strict';

angular.module('app').factory('ApplicationFormFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl();

    factory.verifyUniqueId = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/verifyUniqueId',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.registerStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/student/register',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});