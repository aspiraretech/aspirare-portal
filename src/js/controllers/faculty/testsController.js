'use strict';
angular.module('app')
    .controller('TestsController', function($scope, $state, DashboardFactory, SelectClassFactory, LoginFactory, TestsFactory, toastr, $uibModal, $filter) {

        $scope.tests = [];
        var conductedTestsOnly = false;

        $scope.keywords = DashboardFactory.keywords;
        $scope.app_base = LoginFactory.getAppBase();

        $scope.getAllTests = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds,
                ConductedTestsOnly: conductedTestsOnly
            };
            TestsFactory.getAllTests(obj)
                .then(function(success) {
                    $scope.tests = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No tests have been created yet!');
                    } else {
                        $scope.tests = $filter('orderBy')(success.data.Data, '-CreatedAt');
                        $scope.selectedTest = $scope.tests[0];
                        $scope.getTestDetails();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getTestDetails = function() {
            var obj = {
                Id: $scope.selectedTest.Id,
                ClassIds: SelectClassFactory.ClassIds,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                SubjectIds: SelectClassFactory.SubjectIds,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            TestsFactory.getTestDetails(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not fetch test details!');
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteTest = function() {
            var r = confirm("Are you sure you want to delete this assessment?");
            if (r == true) {
                TestsFactory.deleteTest($scope.selectedTest)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete assessment. Please try later!');
                        } else {
                            toastr.success('Assessment was successfully deleted');
                            $scope.getAllTests();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.testSelected = function(test) {
            $scope.selectedTest = test;
            $scope.getTestDetails();
        };

        $scope.addAssessment = function() {
            $state.go('app.addTest');
        };

        $scope.getUniqueIds = function(array, key) {
            return TestsFactory.Students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.openModal = function(student) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + '/views/templates/UpdateTestScoreTemplate.html',
                controller: 'UpdateTestScoreController',
                resolve: {
                    student: function() {
                        return student;
                    },
                    selectedTest: function() {
                        return $scope.selectedTest;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                console.log(response);
                $scope.getAllTests();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.markAbsent = function(student) {
            var r = confirm("Are you sure you want to mark absent?");
            if (r == true) {
                TestsFactory.updateMarks(student.Id, $scope.selectedTest.Id, "Ab", 0)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not update student marks. Please try later!');
                        } else {
                            toastr.success('Successfully updated the marks of student');
                            $scope.getAllTests();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.questionPaper = function() {
            TestsFactory.selectedTest = $scope.selectedTest;
            $state.go('app.questionPaper');
        };

        $scope.getAllTests();
    })
    .controller('UpdateTestScoreController', function($scope, $uibModalInstance, toastr, TestsFactory, student, selectedTest, CriteriaFactory) {

        $scope.student = angular.copy(student);
        if ($scope.student.Marks != 'Ab') {
            $scope.student.Marks = parseFloat($scope.student.Marks);
        }
        $scope.selectedTest = selectedTest;
        $scope.criterias = [];

        $scope.getAllCriteriaForTest = function() {
            $scope.criterias = [];
            CriteriaFactory.getAllCriteriaForStudentAndTest($scope.student.Id, $scope.selectedTest.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no questions entered for this assessment!');
                    } else {
                        $scope.criterias = success.data.Data;
                        for (var i = 0; i < $scope.criterias.length; i++) {
                            $scope.criterias[i].MaxScore = parseFloat($scope.criterias[i].MaxScore);
                            $scope.criterias[i].MarksScored = parseFloat($scope.criterias[i].MarksScored);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.criteriaMarksEntered = function(criteriaIndex) {
            if ($scope.criterias[criteriaIndex].MarksScored > $scope.criterias[criteriaIndex].MaxScore || $scope.criterias[criteriaIndex].MarksScored == undefined) {
                toastr.warning('Marks should be less than max marks');
                $scope.criterias[criteriaIndex].MarksScored = null;
            }
            var total = 0;
            for (var i = 0; i < $scope.criterias.length; i++) {
                if ($scope.criterias[i].MarksScored != undefined) {
                    total = total + $scope.criterias[i].MarksScored;
                }
            }
            $scope.student.Marks = total;
        };

        $scope.isMarksMoreThanMaxMarks = function() {
            if (parseFloat($scope.student.Marks) > parseInt($scope.selectedTest.MaxMarks)) {
                toastr.warning('Marks should be less than or equal to Max Marks');
                $scope.student.Marks = "";
            }
        };

        $scope.update = function() {
            if ($scope.student.Marks > parseFloat($scope.selectedTest.MaxMarks)) {
                toastr.warning('Test score cannot be more than max score of the test');
                return;
            } else {
                var resultPercentage = ($scope.student.Marks / parseFloat($scope.selectedTest.MaxMarks)) * 100;
            }
            TestsFactory.updateMarks($scope.student.Id, $scope.selectedTest.Id, $scope.student
                    .Marks, resultPercentage)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not update student marks. Please try later!');
                    } else {
                        if ($scope.criterias.length > 0) {
                            var obj = {
                                Criteria: $scope.criterias,
                                Test: $scope.selectedTest,
                                Student: $scope.student
                            };
                            for (var i = 0; i < $scope.criterias.length; i++) {
                                $scope.criterias[i].ResultPercentage = ($scope.criterias[i].MarksScored / $scope.criterias[i].MaxScore) * 100;
                            }
                            TestsFactory.updateCriteriaForStudent(obj)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error('Could not update the marks of student. Please try later!');
                                    } else {
                                        $scope.marksUpdateSuccessful();
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                });
                        } else {
                            $scope.marksUpdateSuccessful();
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.marksUpdateSuccessful = function() {
            toastr.success('Successfully updated the marks of student');
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

        $scope.getAllCriteriaForTest();
    });