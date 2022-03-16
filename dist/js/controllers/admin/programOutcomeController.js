angular.module('app')
    .controller('ProgramOutcomeController', function($scope, DashboardFactory, toastr, ProgramOutcomeFactory, LoginFactory) {

        $scope.newPO = {
            Id: null,
            Name: null,
            Description: null,
            CollegeId: null,
            CourseId: null,
            BranchId: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.programOutcomes = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            po: null
        };

        $scope.pos = [{
            Name: "PSO1"
        }, {
            Name: "PSO2"
        }, {
            Name: "PSO3"
        }, {
            Name: "PSO4"
        }, {
            Name: "PSO5"
        }, {
            Name: "PSO6"
        }];

        $scope.getAllCourses = function() {
            $scope.newPO.CourseId = null;
            $scope.newPO.BranchId = null;
            $scope.selected.po = null;
            $scope.courses = [];
            $scope.branches = [];
            $scope.programOutcomes = [];
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get list of courses. Please try later!');
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function() {
            $scope.newPO.BranchId = null;
            $scope.selected.po = null;
            $scope.branches = [];
            $scope.programOutcomes = [];
            DashboardFactory.getAllBranches($scope.newPO.CourseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get branches for this course. Please try later!');
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function() {
            $scope.selected.po = null;
            $scope.programOutcomes = [];
            $scope.getAllProgramOutcomes();
        };

        $scope.getAllProgramOutcomes = function() {
            ProgramOutcomeFactory.getAllProgramOutcomes(LoginFactory.loggedInUser.CollegeId, $scope.newPO.CourseId, $scope.newPO.BranchId)
                .then(function(success) {
                    $scope.programOutcomes = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no program outcomes for this branch!');
                    } else {
                        $scope.programOutcomes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createPO = function() {
            var obj = {
                Id: null,
                Name: $scope.newPO.Name,
                Description: $scope.newPO.Description,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                CourseId: $scope.newPO.CourseId,
                BranchId: $scope.newPO.BranchId
            };
            ProgramOutcomeFactory.addProgramOutcome(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Program Outcome created successfully');
                        $scope.newPO.Description = "";
                        $scope.newPO.Name = null;
                        $scope.getAllProgramOutcomes();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deletePO = function(po) {
            var r = confirm("Are you sure you want delete this program outcome?");
            if (r == true) {
                ProgramOutcomeFactory.deleteProgramOutcome(po)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Program Outcome deleted successfully');
                            $scope.getAllProgramOutcomes();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourses();
    });