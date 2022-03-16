angular.module('app').factory('ReportsFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllTags = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllTags',
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

    factory.getSubjectStatsForPrimeKeyword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getSubjectStatsForPrimeKeyword',
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