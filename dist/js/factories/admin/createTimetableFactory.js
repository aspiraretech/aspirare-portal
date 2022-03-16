angular.module('app').factory('CreateTimetableFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedChapter: null,
        selectedTopic: null,
        selectedChapterIndex: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.addDaysTimetable = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addDaysTimetable',
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

    factory.getDaysTimetable = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getDaysTimetable',
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