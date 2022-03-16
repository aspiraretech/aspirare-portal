angular.module('app')
    .controller('SetFeesStructureController', function($scope, toastr, LoginFactory, DashboardFactory, FeesStructureFactory) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.feesKeywords = DashboardFactory.feesKeywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.feesStructure = {
            Id: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            BranchId: null,
            AcademicYear: null,
            TuitionFees: 0,
            OtherComponent1: 0,
            OtherComponent2: 0,
            RegularComponent1: 0,
            RegularComponent2: 0,
            RegularComponent3: 0,
            RegularComponent4: 0,
            RegularComponent5: 0,
            RegularComponent6: 0,
            RegularComponent7: 0,
            RegularComponent8: 0,
            RegularComponent9: 0,
            RegularComponent10: 0,
            RegularComponent11: 0
        };

        $scope.years = [{
            Name: moment().year() + "-" + moment().add(1, 'years').year()
        }, {
            Name: moment().subtract(1, 'years').year() + "-" + moment().year()
        }];


        $scope.selected = {
            courseId: null,
            branchId: null,
            AcademicYear: new Date().getMonth() <= 3 ? $scope.years[0].Name : $scope.years[1].Name
        };

        $scope.courses = [];
        $scope.branches = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getBranches = function(courseId) {
            DashboardFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.selected.branchId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.feesStructure = {
                Id: null,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                BranchId: null,
                AcademicYear: null,
                TuitionFees: 0,
                OtherComponent1: 0,
                OtherComponent2: 0,
                RegularComponent1: 0,
                RegularComponent2: 0,
                RegularComponent3: 0,
                RegularComponent4: 0,
                RegularComponent5: 0,
                RegularComponent6: 0,
                RegularComponent7: 0,
                RegularComponent8: 0,
                RegularComponent9: 0,
                RegularComponent10: 0,
                RegularComponent11: 0
            };
            FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, branchId, $scope.selected.AcademicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set yet!');
                    } else {
                        $scope.feesStructure = success.data.Data[0];
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.setFeesStructure = function() {
            $scope.feesStructure.BranchId = $scope.selected.branchId;
            $scope.feesStructure.AcademicYear = $scope.selected.AcademicYear;
            FeesStructureFactory.setFeesStructure($scope.feesStructure)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem updating the fees structure. Please try later!');
                    } else {
                        toastr.success('Fees Structure set successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.updateFeesStructure = function() {
            FeesStructureFactory.updateFeesStructure($scope.feesStructure)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem updating the fees structure. Please try later!');
                    } else {
                        toastr.success('Fees Structure updated successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.updateFeesKeywords = function() {
            FeesStructureFactory.updateFeesKeywords($scope.feesStructure)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem updating the fees keywords. Please try later!');
                    } else {
                        toastr.success('Fees Keywords updated successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.discard = function() {
            history.back();
        };

        $scope.getAllCourses();

    });