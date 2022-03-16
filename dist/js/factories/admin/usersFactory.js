angular.module('app').factory('UsersFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedUser: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllUsers = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllRoles = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/role'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getUserById = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getById/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addUser = function(newUser) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user',
            data: newUser,
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

    factory.resetUserPassword = function(user) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/resetUserPassword',
            data: user,
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

    factory.updateUser = function(newUser) {
        delete newUser.CreatedAt;
        delete newUser.UpdatedAt;
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/user/updateProfile',
            data: newUser,
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

    factory.addEducation = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user/addEducation',
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

    factory.removeEducation = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user/removeEducation',
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

    factory.addExperience = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user/addExperience',
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

    factory.removeExperience = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user/removeExperience',
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

    factory.addSubjects = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user/addSubjects',
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

    factory.removeSubject = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user/removeSubject',
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

    factory.addSpecialSubjects = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/user/addSpecialSubjects',
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

    factory.removeSpecialSubject = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user/removeSpecialSubject',
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

    factory.deleteUser = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user',
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