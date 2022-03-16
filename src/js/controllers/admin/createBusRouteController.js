angular.module('app')
    .controller('CreateBusRouteController', function($scope, UsersFactory, toastr, LoginFactory, BusRouteFactory) {

        $scope.newRoute = {
            Id: null,
            RouteNumber: "",
            VehicleRegNumber: "",
            AreasCovered: "",
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            UserId: null
        };

        $scope.users = [];

        $scope.create = function() {
            if ($scope.newRoute.RouteNumber == "" || $scope.newRoute.VehicleRegNumber == "" || $scope.newRoute.AreasCovered == "" || $scope.newRoute.UserId == null || $scope.newRoute.UserId == undefined) {
                toastr.warning('Please enter all the details');
            } else {
                BusRouteFactory.createRoute($scope.newRoute)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not create bus route!');
                        } else {
                            toastr.success('Route created successfully');
                            history.back();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There are no drivers added. Please add a driver!');
                    } else {
                        for (var i = 0; i < success.data.Data.length; i++) {
                            if (success.data.Data[i].Role == 'DRIVER') {
                                $scope.users.push(success.data.Data[i]);
                            }
                        }
                        if ($scope.users.length == 0) {
                            toastr.warning('There are no drivers added. Please add a driver!');
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.discard = function() {
            history.back();
        };

        $scope.getAllUsers();
    });