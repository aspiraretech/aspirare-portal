angular.module('app').factory('AssignDocumentsFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllSubTopics = function(topicIds) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllSubTopics',
            data: topicIds,
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

    factory.assignPPT = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addPresentationToTopic',
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

    factory.getAllTopicsWithPPTForChapter = function(chapterId, userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/topic/getAllByChapterWithPPT/' + chapterId + '/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addSubTopics = function(newSubTopic) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addSubTopics',
            data: newSubTopic,
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

    factory.deleteSubTopic = function(subTopic) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSubTopic',
            data: subTopic,
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

    factory.topicTaught = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/topicTaught',
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

    factory.activateSmartTestForClass = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/activateSmartTestForClass',
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