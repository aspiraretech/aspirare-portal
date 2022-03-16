angular.module('app')
    .controller('SetTransportFeesController', function($scope, toastr, LoginFactory, FeesStructureFactory) {

        $scope.transportFees = {
            Id: null,
            Name: "One Way",
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            StartKM: null,
            EndKM: null,
            Fees: null
        };

        $scope.tfs = [{
            Name: "One Way"
        }, {
            Name: "Two Way"
        }]
        $scope.transportFeesArray = [];

        $scope.getTransportFees = function() {
            FeesStructureFactory.getTransportFees(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.transportFeesArray = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set yet!');
                    } else {
                        $scope.transportFeesArray = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.setTransportFees = function() {
            FeesStructureFactory.setTransportFees($scope.transportFees)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem updating the fees structure. Please try later!');
                    } else {
                        toastr.success('Fees Structure set successfully');
                        $scope.discard();
                        $scope.getTransportFees();
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.updateTransportFees = function() {
            FeesStructureFactory.updateTransportFees($scope.transportFees)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem updating the fees structure. Please try later!');
                    } else {
                        toastr.success('Fees Structure updated successfully');
                        $scope.discard();
                        $scope.getTransportFees();
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.deleteTransportFees = function(fees) {
            FeesStructureFactory.deleteTransportFees(fees)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem deleting the fees structure. Please try later!');
                    } else {
                        toastr.success('Fees Structure deleted successfully');
                        $scope.discard();
                        $scope.getTransportFees();
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.editFees = function(fees) {
            $scope.transportFees = fees;
        };

        $scope.discard = function() {
            $scope.transportFees = {
                Id: null,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                StartKM: null,
                EndKM: null,
                Fees: null
            };
        };

        $scope.getTransportFees();

    });