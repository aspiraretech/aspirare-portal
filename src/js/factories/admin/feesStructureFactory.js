angular.module('app').factory('FeesStructureFactory', function($q, $http, LoginFactory) {
    var factory = {
        student: null,
        academicYear: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getFeesStructure = function(collegeId, branchId, academicYear) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getFeesStructure/' + collegeId + '/' + branchId + '/' + academicYear
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getRegularFeesForStudent = function(studentId, academicYear) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getRegularFeesForStudent/' + studentId + '/' + academicYear
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDevelopmentFeesForStudent = function(studentId, academicYear) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getDevelopmentFeesForStudent/' + studentId + '/' + academicYear
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.setFeesStructure = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/setFeesStructure',
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

    factory.updateFeesStructure = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateFeesStructure',
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

    factory.updateFeesKeywords = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateFeesKeyword',
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

    factory.getTransportFees = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTransportFees/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.setTransportFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/setTransportFees',
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

    factory.updateTransportFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateTransportFees',
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

    factory.deleteTransportFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteTransportFees',
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

    factory.saveRegularFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/saveRegularFees',
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

    factory.saveDevelopmentFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/saveDevelopmentFees',
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

    factory.saveTransportFees = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/saveTransportFees',
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

    factory.createReceipt = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/createReceipt',
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