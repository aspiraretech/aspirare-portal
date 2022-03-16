angular.module('app').factory('TrackPaymentFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getFeesInfo = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getFeesInformation',
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