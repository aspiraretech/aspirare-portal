angular.module('app').factory('CourseOutcomeFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.addCourseOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addCourseOutcome',
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

    factory.getAllCourseOutcomesWithDescriptor = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllCourseOutcomesWithDescriptor',
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

    factory.getAllCourseOutcomes = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllCourseOutcomes',
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

    factory.getOverallCOAttainmentFromSEE = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getOverallCOAttainmentFromSEE',
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

    factory.getOverallCOAttainmentFromChapter = function(chapterId, coid) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getOverallCOAttainmentFromChapter/' + chapterId + '/' + coid
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.removeCOPOMapping = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/removeCOPOMapping',
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

    factory.getCoAttainmentForTest = function(testId, coId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getCoAttainmentForTest/' + testId + '/' + coId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllChaptersForSubject = function(subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/chapter/getBySubject/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});