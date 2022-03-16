angular.module('app')
    .controller('BusRouteController', function($scope, $state, BusRouteFactory, toastr, LoginFactory) {

        $scope.routes = [];
        $scope.selectedRoute = null;

        $scope.routeSelected = function(route) {
            RoutesFactory.selectedRoute = route;
        };

        $scope.getAllRoutes = function() {
            $scope.routes = [];
            BusRouteFactory.getAllRoutes(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No routes are created yet!');
                    } else {
                        $scope.routes = success.data.Data;
                        $scope.selectedRoute = angular.copy($scope.routes[0]);
                        if ($scope.selectedRoute.Latitude == null || $scope.selectedRoute.Latitude == 'null') {
                            toastr.info('The bus has not started yet');
                        } else {
                            $scope.initialize();
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createBusRoute = function() {
            $state.go('app.createBusRoute');
        };

        $scope.deleteRoute = function() {
            var r = confirm("Are you sure you want to delete this route?");
            if (r == true) {
                BusRouteFactory.deleteRoute($scope.selectedRoute)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete this route. Please try later!');
                        } else {
                            toastr.success('Route deleted Successfully');
                            $scope.getAllRoutes();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.startPolling = function() {
            $scope.promise = $interval(function() {
                BusRouteFactory.getRouteByStudent($scope.selectedRoute.Id)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('Could not fetch location details');
                        } else {
                            $scope.route = success.data.Data[0];
                            if ($scope.selectedRoute.Latitude == null || $scope.selectedRoute.Latitude == 'null') {
                                toastr.info('The bus has not started yet');
                            } else {
                                updateMarker($scope.selectedRoute.Latitude, $scope.selectedRoute.Longitude);
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }, 1000 * 10);
        };

        $scope.initialize = function() {
            var mapOptions = {
                center: new google.maps.LatLng($scope.selectedRoute.Latitude, $scope.selectedRoute.Longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.selectedRoute.Latitude, $scope.selectedRoute.Longitude),
                icon: "src/img/bus.png",
                map: map
            });

            // Stop the side bar from dragging when mousedown/tapdown on the map
            google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
                e.preventDefault();
                return false;
            });

            $scope.map = map;
            $scope.startPolling();
        };

        function updateMarker(lat, lng) {
            var latlng = new google.maps.LatLng(lat, lng);
            $scope.marker.setPosition(latlng);
            $scope.map.setCenter(latlng);
        };

        $scope.getAllRoutes();
    });