angular.module('app').factory('EnquiryFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedEnquiry: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllEnquiries = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/enquiry/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getEnquiryDetails = function(enquiryId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/enquiry/getById/' + enquiryId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addEnquiry = function(newEnquiry) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/enquiry',
            data: newEnquiry,
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

    factory.addEnquiryWithoutToken = function(newEnquiry) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: LoginFactory.getBaseUrl() + '/addEnquiryWithoutToken',
            data: newEnquiry,
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

    factory.sendSms = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/enquiry/sendSms',
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

    factory.updateEnquiry = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/enquiry',
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

    factory.deleteEnquiry = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/enquiry',
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

    factory.deleteEnquiries = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteEnquiries',
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

    factory.changeEnquiryStatus = function(enquiry) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/changeEnquiryStatus',
            data: enquiry,
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

    factory.getEnquiryById = function(enquiryId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/enquiry/getById/' + enquiryId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});