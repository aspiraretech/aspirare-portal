angular.module('app')
    .controller('CourseOutcomeController', function($scope, SelectClassFactory, toastr, CourseOutcomeFactory, LoginFactory, ProgramOutcomeFactory) {

        $scope.programOutcomes = [];
        $scope.courseOutcomes = [];
        $scope.descriptors = [{
            Name: "1"
        }, {
            Name: "2"
        }, {
            Name: "3"
        }];

        $scope.getUniqueIds = function(array, key) {
            return SelectClassFactory.Students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.newCO = {
            Id: null,
            Name: null,
            Description: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            CourseId: null,
            BranchIds: $scope.getUniqueIds(SelectClassFactory.Students, 'BranchId'),
            SemesterId: null,
            ClassIds: SelectClassFactory.ClassIds,
            SubjectIds: SelectClassFactory.SubjectIds,
            IsElective: null,
            ProgramOutcomes: []
        };

        $scope.cos = [{
            Name: "CO1"
        }, {
            Name: "CO2"
        }, {
            Name: "CO3"
        }, {
            Name: "CO4"
        }, {
            Name: "CO5"
        }, {
            Name: "CO6"
        }, {
            Name: "CO7"
        }, {
            Name: "CO8"
        }, {
            Name: "CO9"
        }, {
            Name: "CO10"
        }];

        $scope.getAllProgramOutcomes = function() {
            $scope.programOutcomes = [];
            if (SelectClassFactory.selected.subject.IsElective == undefined) {
                SelectClassFactory.selected.subject.IsElective = "true";
            }
            ProgramOutcomeFactory.getAllProgramOutcomesForSubject(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.CourseId, SelectClassFactory.selected.subject.Id, SelectClassFactory.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get program outcomes on this subject. Please try later!');
                    } else {
                        $scope.programOutcomes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createNewCo = function() {
            $scope.newCO.CourseId = SelectClassFactory.selected.subject.CourseId;
            $scope.newCO.SemesterId = SelectClassFactory.selected.subject.SemesterId;
            $scope.newCO.IsElective = SelectClassFactory.selected.subject.IsElective;
            for (var i = 0; i < $scope.programOutcomes.length; i++) {
                if ($scope.programOutcomes[i].isChecked) {
                    $scope.newCO.ProgramOutcomes.push({
                        Id: $scope.programOutcomes[i].Id,
                        Descriptor: $scope.programOutcomes[i].Descriptor
                    });
                }
            }
            if ($scope.newCO.ProgramOutcomes.length == 0) {
                toastr.warning('Please select atleast on Program Outcome');
            } else {
                CourseOutcomeFactory.addCourseOutcome($scope.newCO)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not create course outcome. Please try later!');
                        } else {
                            toastr.success('Course Outcome created successfully');
                            $scope.newCO.Description = "";
                            $scope.newCO.Name = null;
                            $scope.newCO.CourseId = null;
                            $scope.newCO.BranchIds = $scope.getUniqueIds(SelectClassFactory.Students, 'BranchId');
                            $scope.newCO.SemesterId = null;
                            $scope.newCO.ClassIds = SelectClassFactory.ClassIds;
                            $scope.newCO.SubjectIds = SelectClassFactory.SubjectIds;
                            $scope.newCO.IsElective = null;
                            $scope.newCO.ProgramOutcomes = [];
                            $scope.programOutcomes = [];
                        }
                        $scope.getAllCourseOutcomesWithDescriptor();
                        $scope.getAllProgramOutcomes();
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourseOutcomesWithDescriptor = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds
            }
            CourseOutcomeFactory.getAllCourseOutcomesWithDescriptor(obj)
                .then(function(success) {
                    $scope.courseOutcomes = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no course outcomes for this subject!');
                    } else {
                        $scope.courseOutcomes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.removeCOPOMapping = function(co) {
            var r = confirm("Are you sure you want unlink this course outcome with program outcome?");
            if (r == true) {
                CourseOutcomeFactory.removeCOPOMapping(co)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Course Outcome unlinked from Program Outcome');
                            $scope.getAllCourseOutcomesWithDescriptor();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourseOutcomesWithDescriptor();
        $scope.getAllProgramOutcomes();
    });