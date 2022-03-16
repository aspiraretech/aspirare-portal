angular.module('app')
    .controller('ChangePasswordController', function($scope, $state, LoginFactory, toastr, ChangePasswordFactory) {
        $scope.showPasswordIsChecked = false;
        $scope.data = {
            CurrentPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
            UserId: LoginFactory.loggedInUser.Id
        };
        $scope.changePassword = function() {
            if ($scope.data.CurrentPassword == "" || $scope.data.NewPassword == "" || $scope.data.ConfirmPassword == "") {
                toastr.warning('Please enter all the fields to change the password');
            } else if ($scope.data.NewPassword != $scope.data.ConfirmPassword) {
                toastr.warning('New password should match confirm password');
            } else {
                ChangePasswordFactory.changePassword($scope.data)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Data);
                        } else {
                            toastr.success('Password changed successfully. Please login with your new password.');
                            $state.go('appSimple.login');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };
    });