angular.module('app')
    .controller('UsersController', function($scope, $state, LoginFactory, UsersFactory, toastr) {
        $scope.users = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no users added. Please add a user!');
                    } else {
                        $scope.users = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteUser = function(user) {
            var r = confirm("Are you sure you want to de-activate this user?");
            if (r == true) {
                var obj = {
                    Id: user.Id
                };
                UsersFactory.deleteUser(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User was deleted successfully');
                            $scope.getAllUsers();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.resetPassword = function(user) {
            var r = confirm('Are you sure you want to reset Password for ' + user.Name + '?');
            if (r == true) {
                UsersFactory.resetUserPassword(user)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User password has been reset to their Phone Number');
                            $scope.getAllUsers();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.updateUser = function(user) {
            UsersFactory.selectedUser = user;
            $state.go("app.updateUser");
        };

        $scope.addUser = function() {
            $state.go("app.addUser", { isAdd: true, userId: null });
        };

        $scope.takeAttendance = function(user) {
            UsersFactory.selectedUser = user
            $state.go("app.attendance.takeAttendance");
        };

        $scope.checkPerformance = function(user) {
            UsersFactory.selectedUser = user;
            $state.go('app.facultyPerformance');
        };

        $scope.getAllUsers();
    });