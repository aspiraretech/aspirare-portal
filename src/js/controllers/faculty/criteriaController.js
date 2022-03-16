angular.module('app')
    .controller('CriteriaController', function($scope, toastr, CriteriaFactory, LearningOutcomeFactory, SelectClassFactory, LoginFactory, TestsFactory) {

        $scope.chapters = [];
        $scope.criterias = [];
        $scope.cos = [];
        $scope.bts = [];
        $scope.tests = [];

        $scope.newCriteria = {
            Id: null,
            Name: "",
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Topics: [],
            Images: [],
            MaxScore: null,
            COId: null,
            BTId: null,
            TestId: null
        };

        $scope.selected = {
            chapter: null,
            topic: null
        };

        $scope.newCriteriaSelection = {
            chapter: null,
            topic: null
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectId: SelectClassFactory.selected.subject.Id,
                ClassId: SelectClassFactory.selected.class.Id,
                DateRange: {
                    startDate: moment().subtract(1, 'year').toISOString(),
                    endDate: moment().toISOString()
                }
            };
            LearningOutcomeFactory.getLessonPlan(obj)
                .then(function(success) {
                    $scope.chapters = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No chapters added for this subject!');
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllCriteria = function() {
            $scope.criterias = [];
            CriteriaFactory.getAllCriteria(LoginFactory.loggedInUser.CollegeId, $scope.selected.chapter.Id, $scope.selected.topic.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no questions added for this topic');
                    } else {
                        $scope.criterias = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllTests = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds,
                ConductedTestsOnly: false
            };
            TestsFactory.getAllTests(obj)
                .then(function(success) {
                    $scope.tests = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No tests have been created yet!');
                    } else {
                        $scope.tests = success.data.Data;
                        $scope.tests.forEach(function(test, index) {
                            if (test.IsFinal == "1") {
                                $scope.tests.splice(index, 1);
                            }
                        });
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getCourseOutcomes = function() {
            var obj = {
                ClassIds: SelectClassFactory.ClassIds,
                SubjectIds: SelectClassFactory.SubjectIds
            };
            CriteriaFactory.getCourseOutcomes(obj)
                .then(function(success) {
                    $scope.cos = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no Course Outcomes added yet');
                    } else {
                        $scope.cos = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getBloomsTaxonomy = function() {
            CriteriaFactory.getBloomsTaxonomy()
                .then(function(success) {
                    $scope.bts = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no Bloom Levels added yet');
                    } else {
                        $scope.bts = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.createCriteria = function() {
            for (var i = 0; i < $scope.chapters.length; i++) {
                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                    if ($scope.chapters[i].Topics[j].isSelected) {
                        $scope.newCriteria.Topics.push({
                            ChapterId: $scope.chapters[i].Id,
                            TopicId: $scope.chapters[i].Topics[j].Id
                        })
                    }
                }
            };
            if ($scope.newCriteria.COId == null || $scope.newCriteria.Name == "" || $scope.newCriteria.MaxScore == null || $scope.newCriteria.MaxScore == undefined || $scope.newCriteria.Topics.length == 0) {
                toastr.warning('Please enter all the fields');
            } else {
                CriteriaFactory.createCriteria($scope.newCriteria)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not create criteria. Please try later!');
                        } else {
                            toastr.success('Criteria created successfully');
                            $scope.newCriteriaSelection.chapter = null;
                            $scope.newCriteriaSelection.topic = null;
                            $scope.newCriteria = {
                                Id: null,
                                Name: "",
                                CollegeId: LoginFactory.loggedInUser.CollegeId,
                                Topics: [],
                                Images: [],
                                MaxScore: null,
                                COId: null,
                                BTId: null,
                                TestId: null
                            };
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.deleteCriteria = function(criteria) {
            var r = confirm("Are you sure you want to activate this student?");
            if (r == true) {
                CriteriaFactory.deleteCriteria(criteria)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete criteria. Please try later!');
                        } else {
                            toastr.success('Criteria deleted successfully')
                            $scope.getAllCriteria();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.getLessonPlan();
        $scope.getAllTests();
        $scope.getCourseOutcomes();
        $scope.getBloomsTaxonomy();
    });