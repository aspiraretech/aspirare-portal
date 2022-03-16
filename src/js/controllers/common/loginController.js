angular.module('app')
    .controller('LoginController', function($scope, $state, LoginFactory) {
        $scope.adminLoginData = {
            PhoneNumber: null,
            Password: ''
        };

        $scope.facultyLoginData = {
            PhoneNumber: null,
            Password: ''
        };

        $scope.loginType = null;

        $scope.adminErrorMessage = null;
        $scope.facultyErrorMessage = null;

        $scope.login = function(type) {
            if (type == 1) { // admin
                if ($scope.adminLoginData.PhoneNumber == undefined || $scope.adminLoginData.PhoneNumber == "") {
                    $scope.adminErrorMessage = 'Enter Phone Number';
                } else if ($scope.adminLoginData.Password == undefined || $scope.adminLoginData.Password == "") {
                    $scope.adminErrorMessage = 'Enter Password';
                } else {
                    $scope.adminErrorMessage = null;
                    LoginFactory.login($scope.adminLoginData)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                $scope.adminErrorMessage = success.data.Message;
                            } else {
                                $scope.adminErrorMessage = null;
                                LoginFactory.colleges = success.data.Data;
                                if (success.data.Data[0].Role != 'ADMIN') {
                                    $scope.adminErrorMessage = 'Only administrators can login as ADMIN. Please use Faculty login to proceed!'
                                    $scope.adminLoginData.PhoneNumber = null;
                                    $scope.adminLoginData.Password = '';
                                } else {
                                    LoginFactory.loginCollege(success.data.Data[0], type);
                                }
                            }
                        }, function(error) {
                            console.log(error);
                        });
                }
            } else { // faculty
                if ($scope.facultyLoginData.PhoneNumber == undefined || $scope.facultyLoginData.PhoneNumber == "") {
                    $scope.facultyErrorMessage = 'Enter Phone Number';
                } else if ($scope.facultyLoginData.Password == undefined || $scope.facultyLoginData.Password == "") {
                    $scope.facultyErrorMessage = 'Enter Password';
                } else {
                    $scope.facultyErrorMessage = null;
                    LoginFactory.login($scope.facultyLoginData)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                $scope.facultyErrorMessage = success.data.Message;
                            } else {
                                $scope.facultyErrorMessage = null;
                                LoginFactory.colleges = success.data.Data;
                                LoginFactory.loginCollege(success.data.Data[0], type);
                            }
                        }, function(error) {
                            console.log(error);
                        });
                }
            }
        };
    });