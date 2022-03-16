'use strict';
angular.module('app')
    .controller('COAttainmentController', function($scope, toastr, SelectClassFactory, CourseOutcomeFactory, TestsFactory, ProgramOutcomeFactory, LoginFactory) {

        $scope.cos = [];
        $scope.pos = [];
        $scope.tests = [];
        $scope.chapters = [];
        $scope.coWithDescriptor = [];
        var conductedTestsOnly = false;

        $scope.totalCoAttainmentFromIA = 0;
        $scope.totalCoAttainmentFromSEE = 0;
        $scope.totalCoAttainmentFromSmartTest = 0; //indirect attainment
        $scope.directAttainment = 0;
        $scope.totalCOAttainment = 0;
        $scope.values = {
            first: 60,
            second: 70,
            third: 80
        };

        var updateTotalCoAttainmentFromIA = function(count, sum) {
            $scope.totalCoAttainmentFromIA = sum / count;
            $scope.calculateAttainments();
        };

        var updateTotalCoAttainmentFromSmartTest = function(count, sum) {
            $scope.totalCoAttainmentFromSmartTest = sum / count;
            $scope.calculateAttainments();
        };

        $scope.getAllCourseOutcomes = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds
            }
            CourseOutcomeFactory.getAllCourseOutcomes(obj)
                .then(function(success) {
                    $scope.courseOutcomes = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no course outcomes for this subject!');
                    } else {
                        $scope.cos = success.data.Data;
                        $scope.getAllPOs();
                        directAttainmentCalculation();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

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
                        $scope.tests = success.data.Data;
                        for (var i = 0; i < $scope.tests.length; i++) {
                            if ($scope.tests[i].IsFinal == "1") {
                                $scope.tests.splice(i, 1);
                            }
                        };
                    }
                    $scope.getAllChapters();
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllChapters = function() {
            CourseOutcomeFactory.getAllChaptersForSubject(SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('There are no chapters available!');
                    } else {
                        $scope.chapters = success.data.Data;
                        $scope.getAllCourseOutcomes();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getOverallCOAttainmentFromSEE = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds
            };
            CourseOutcomeFactory.getOverallCOAttainmentFromSEE(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No semester end exams have been created yet!');
                    } else {
                        $scope.totalCoAttainmentFromSEE = (success.data.Data[0].Average) / 100;
                        $scope.calculateAttainments();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        var directAttainmentCalculation = function() {
            for (var i = 0; i < $scope.cos.length; i++) {
                $scope.cos[i].Tests = angular.copy($scope.tests);
                $scope.cos[i].Chapters = angular.copy($scope.chapters);
            }
            //calculate attainment
            var countOfIAAttainments = 0;
            var sumOfIAAttainments = 0;
            var numberOfIAIterations = 0;

            var countOfSTAttainments = 0;
            var sumOfIASTtainments = 0;
            var numberOfSTIterations = 0;
            angular.forEach($scope.cos, function(co) {
                //for tests
                angular.forEach(co.Tests, function(test, testIndex) {
                    CourseOutcomeFactory.getCoAttainmentForTest(test.Id, co.Id)
                        .then(function(success) {
                            numberOfIAIterations++;
                            if (success.data.Code != "S001") {
                                co.Tests[testIndex].Attainment = '-';
                            } else {
                                var students = success.data.Data;
                                var studentsAboveWeightage = students.filter(function(value) {
                                    return value.Average >= 60;
                                });
                                co.Tests[testIndex].Attainment = studentsAboveWeightage.length / students.length;
                                countOfIAAttainments++;
                                sumOfIAAttainments += angular.copy(co.Tests[testIndex].Attainment);
                            }
                            if (numberOfIAIterations == ($scope.cos.length * $scope.tests.length)) {
                                updateTotalCoAttainmentFromIA(countOfIAAttainments, sumOfIAAttainments);
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                });
                //for chapters
                angular.forEach(co.Chapters, function(chapter, chapterIndex) {
                    CourseOutcomeFactory.getOverallCOAttainmentFromChapter(chapter.Id, co.Id)
                        .then(function(success) {
                            numberOfSTIterations++;
                            if (success.data.Code != "S001") {
                                co.Chapters[chapterIndex].Attainment = '-';
                            } else {
                                var students = success.data.Data;
                                var studentsAboveWeightage = students.filter(function(value) {
                                    return value.Average >= 60;
                                });
                                co.Chapters[chapterIndex].Attainment = studentsAboveWeightage.length / students.length;
                                countOfSTAttainments++;
                                sumOfIASTtainments += angular.copy(co.Chapters[chapterIndex].Attainment);
                            }
                            if (numberOfSTIterations == ($scope.cos.length * $scope.chapters.length)) {
                                updateTotalCoAttainmentFromSmartTest(countOfSTAttainments, sumOfIASTtainments);
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                });
            });
        }

        $scope.calculateAttainments = function() {
            if ($scope.totalCoAttainmentFromSEE == 0) { // if there are no final exams
                if ($scope.totalCoAttainmentFromIA != 0 && $scope.totalCoAttainmentFromSmartTest != 0) { // both quiz and test exist
                    $scope.directAttainment = getIAWeightage();
                    $scope.totalCOAttainment = (getIAWeightage() * 0.9) + (getSmartTestWeightage() * 0.1);
                } else {
                    if ($scope.totalCoAttainmentFromIA == 0) { // if there are no tests
                        $scope.directAttainment = 0;
                        $scope.totalCOAttainment = getSmartTestWeightage(); // 100% of quiz
                    } else {
                        $scope.directAttainment = getIAWeightage();
                        $scope.totalCOAttainment = getIAWeightage(); // 100% of tests
                    }
                }
            } else {
                if ($scope.totalCoAttainmentFromIA != 0 && $scope.totalCoAttainmentFromSmartTest != 0) { // if there are tests and quizzes and exam
                    $scope.directAttainment = (getIAWeightage() * 0.6) + (getSEEWeightage() * 0.4);
                    $scope.totalCOAttainment = ((getIAWeightage() * 0.6) + (getSEEWeightage() * 0.4) * 0.9) + (getSmartTestWeightage() * 0.1); // 90%(60% of tests + 40% of exam) + 10%(quiz)
                } else {
                    if ($scope.totalCoAttainmentFromIA == 0) { // if there are no tests
                        $scope.directAttainment = getSEEWeightage();
                        $scope.totalCOAttainment = (getSEEWeightage() * 0.9) + (getSmartTestWeightage() * 0.1); // 10% of quiz + 90% of final exam
                    } else {
                        $scope.directAttainment = (getIAWeightage() * 0.6) + (getSEEWeightage() * 0.4);
                        $scope.totalCOAttainment = (getIAWeightage() * 0.6) + (getSEEWeightage() * 0.4); // 40% of tests + 60% of final exam
                    }
                }
            }
        };

        var calculatePOAttainment = function() {
            //for pos
            $scope.copoTotalEntries = 0;
            angular.forEach($scope.cos, function(co, coIndex) {
                co.TotalDescriptorValue = 0;
                angular.forEach(co.POs, function(po, poIndex) {
                    ProgramOutcomeFactory.getCOPODescriptor(co.Id, po.Id)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                co.POs[poIndex].Descriptor = '-';
                            } else {
                                co.POs[poIndex].Descriptor = success.data.Data[0].Descriptor;
                                $scope.pos[poIndex].TotalDescriptorValue += co.POs[poIndex].Descriptor;
                                $scope.pos[poIndex].TotalCOPOEntries++;
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                });
            });
        }

        $scope.getAllPOs = function() {
            ProgramOutcomeFactory.getAllProgramOutcomes(LoginFactory.loggedInUser.CollegeId, SelectClassFactory.selected.subject.CourseId, SelectClassFactory.selected.subject.BranchId)
                .then(function(success) {
                    $scope.pos = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no program outcomes for this branch!');
                    } else {
                        $scope.pos = success.data.Data;
                        for (var i = 0; i < $scope.pos.length; i++) {
                            $scope.pos[i].TotalDescriptorValue = 0;
                            $scope.pos[i].TotalCOPOEntries = 0;
                        }
                        for (var i = 0; i < $scope.cos.length; i++) {
                            $scope.cos[i].POs = angular.copy($scope.pos);
                        }
                        calculatePOAttainment();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        var getIAWeightage = function() {
            if ($scope.totalCoAttainmentFromIA >= 0.6 && $scope.totalCoAttainmentFromIA < 0.7) {
                return 1
            } else if ($scope.totalCoAttainmentFromIA >= 0.7 && $scope.totalCoAttainmentFromIA < 0.8) {
                return 2
            } else if ($scope.totalCoAttainmentFromIA >= 0.8) {
                return 3
            } else {
                return 0
            }
        }

        var getSEEWeightage = function() {
            if ($scope.totalCoAttainmentFromSEE >= 0.6 && $scope.totalCoAttainmentFromSEE < 0.7) {
                return 1
            }
            if ($scope.totalCoAttainmentFromSEE >= 0.7 && $scope.totalCoAttainmentFromSEE < 0.8) {
                return 2
            }
            if ($scope.totalCoAttainmentFromSEE >= 0.8) {
                return 3
            } else {
                return 0
            }
        }

        var getSmartTestWeightage = function() {
            if ($scope.totalCoAttainmentFromSmartTest >= 0.6 && $scope.totalCoAttainmentFromSmartTest < 0.7) {
                return 1
            }
            if ($scope.totalCoAttainmentFromSmartTest >= 0.7 && $scope.totalCoAttainmentFromSmartTest < 0.8) {
                return 2
            }
            if ($scope.totalCoAttainmentFromSmartTest >= 0.8) {
                return 3
            } else {
                return 0
            }
        }

        $scope.getOverallCOAttainmentFromSEE();
        $scope.getAllTests();
    });