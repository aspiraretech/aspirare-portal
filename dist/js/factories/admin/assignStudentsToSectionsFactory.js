angular.module('app').factory('AssignStudentsToSectionsFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.changeSection = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/assignStudentsToSection',
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