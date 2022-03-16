angular.module('app').factory('ProgramOutcomeFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllProgramOutcomes = function(collegeId, courseId, branchId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllProgramOutcomes/' + collegeId + '/' + courseId + '/' + branchId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getCOPODescriptor = function(coid, poid) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getCOPODescriptor/' + coid + '/' + poid
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllProgramOutcomesForSubject = function(collegeId, courseId, subjectId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllProgramOutcomesForSubject/' + collegeId + '/' + courseId + '/' + subjectId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addProgramOutcome',
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

    factory.updateProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updateProgramOutcome',
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

    factory.deleteProgramOutcome = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteProgramOutcome',
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