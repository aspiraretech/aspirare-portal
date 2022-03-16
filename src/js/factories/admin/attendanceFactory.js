angular.module('app').factory('AttendanceFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAttendance = function(subjectId, classId, collegeId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAttendanceStatisticsByRange/' + subjectId + '/' + classId + '/' + collegeId + '/1/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDaysAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getDaysAttendance',
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

    factory.deleteDaysAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteDaysAttendance',
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

    factory.editAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editAttendanceForStudent',
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

    factory.getUniqueAttendanceDates = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getUniqueAttendanceDates',
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

    factory.getAttendanceForWeb = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAttendanceForWeb',
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

    factory.addDaysAttendanceToStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addDaysAttendanceForStudent',
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