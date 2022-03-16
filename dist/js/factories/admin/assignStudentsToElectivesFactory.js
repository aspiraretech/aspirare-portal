angular.module('app').factory('AssignStudentsToElectivesFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllStudentsInCourseAndSem = function(collegeId, courseId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllStudentsInCourseAndSem/' + collegeId + '/' + courseId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllStudentsInSpecialClass = function(specialClassId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllStudentsInSpecialClass/' + specialClassId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.assignStudentsToElectives = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/assignStudentToSubject',
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

    factory.unAssignStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/unAssignStudentFromSubject',
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