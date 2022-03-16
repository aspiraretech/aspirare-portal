angular.module('app').factory('LearningOutcomeFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getMarksStatisticsByRange = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsByRangeNew',
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

    factory.getMarksStatisticsByRangeForOBE = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsByRangeForOBE',
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

    factory.getTopicsForClass = function(classId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicsForClass/' + classId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getTopicsForStudent = function(studentId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicsForStudent/' + studentId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    }

    factory.getAllItems = function(collegeId, subjectId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllCOandBT/' + collegeId + '/' + subjectId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getLessonPlan = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlan',
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