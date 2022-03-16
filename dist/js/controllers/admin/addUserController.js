angular.module('app')
    .controller('AddUserController', function($scope, $state, LoginFactory, UsersFactory, toastr) {
        $scope.newUser = {
            Id: null,
            Name: null,
            DateOfBirth: null,
            Email: null,
            PhoneNumber: null,
            Address: null,
            City: "Bangalore",
            State: "Karnataka",
            Designation: null,
            ProfileImageURL: null,
            Role: null,
            Username: null,
            Password: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            UserEducation: [],
            UserExperience: [],
            Subjects: [],
            SpecialSubjects: []
        };

        $scope.roles = [];

        $scope.getAllRoles = function() {
            UsersFactory.getAllRoles()
                .then(function(success) {
                    $scope.roles = success.data.Data;
                    if (LoginFactory.loggedInUser.Role != 'SUPERADMIN') {
                        for (var i = 0; i < $scope.roles.length; i++) {
                            if ($scope.roles[i].RoleCode == 'UPLOADER') {
                                $scope.roles.splice(i, 1);
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addUser = function() {
            if ($scope.newUser.Name == "" || $scope.newUser.Role == null || $scope.newUser.PhoneNumber == "") {
                toastr.warning('Please enter all the details')
            } else {
                $scope.newUser.Username = $scope.newUser.Name;
                $scope.newUser.Password = $scope.newUser.PhoneNumber;
                UsersFactory.addUser($scope.newUser)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User added successfully');
                            history.back();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.discard = function() {
            history.back();
        };

        $scope.getAllRoles();
    });