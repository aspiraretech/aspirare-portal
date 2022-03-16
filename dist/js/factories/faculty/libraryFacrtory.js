angular.module('app').factory('LibraryFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllAvailableBooks = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAvailableBooks/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentByPhoneNumber = function(phoneNumber, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentByPhoneNumber/' + phoneNumber + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.issueBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/borrowBook',
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

    factory.getBorrowedBooks = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getBorrowedBooks/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBooksHistory = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllBooksHistory/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.returnBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/returnBook',
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

    factory.addBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/book',
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

    factory.updateBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/book',
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

    factory.deleteBook = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/book',
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