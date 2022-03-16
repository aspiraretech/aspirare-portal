angular.module('app')
    .controller('QuestionPaperController', function($scope, TestsFactory, CriteriaFactory, LearningOutcomeFactory, toastr, SelectClassFactory, $uibModal) {

        $scope.questions = [];
        $scope.criterias = [];

        $scope.getQuestionPaper = function() {
            CriteriaFactory.getQuestionPaper(TestsFactory.selectedTest.Id)
                .then(function(success) {
                    $scope.questions = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no questions!');
                    } else {
                        $scope.questions = success.data.Data;
                        $scope.hidePlusForAddedQuestions();
                    }
                }, function(error) {
                    toastr.error(error);
                })
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
                        toastr.info('There are no chapters with this subject!');
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllCriteria = function() {
            CriteriaFactory.getAllCriteria($scope.selected.chapter.Id, $scope.selected.topic.Id)
                .then(function(success) {
                    $scope.criterias = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no questions!');
                    } else {
                        $scope.criterias = success.data.Data;
                        $scope.hidePlusForAddedQuestions();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.removeQuestionFromTest = function(question) {
            var r = confirm("Are you sure you want to remove this question?");
            if (r == true) {
                var obj = {
                    TestId: TestsFactory.selectedTest.Id,
                    CriteriaId: question.Id
                }
                CriteriaFactory.removeQuestionFromTest(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not remove question. Please try later!');
                        } else {
                            toastr.success('Question removed from question paper!', 'bottom', false, 2500);
                            $scope.getQuestionPaper();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.hidePlusForAddedQuestions = function() {
            for (var j = 0; j < $scope.criterias.length; j++) {
                $scope.criterias[j].isAlreadyPresent = false;
                for (var i = 0; i < $scope.questions.length; i++) {
                    if ($scope.questions[i].Id == $scope.criterias[j].Id) {
                        $scope.criterias[j].isAlreadyPresent = true;
                    }
                }
            }
        };

        $scope.openModal = function(criteria) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/views/templates/AddQuestionToQPTemplate.html',
                controller: 'AddQuestionToQPController',
                resolve: {
                    criteria: function() {
                        return criteria;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getQuestionPaper();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.getQuestionPaper();
        $scope.getLessonPlan();
    })
    .controller('AddQuestionToQPController', function($scope, criteria, $uibModalInstance, toastr, TestsFactory, SelectClassFactory, CriteriaFactory, LoginFactory) {

        $scope.newQuestion = {
            TestId: TestsFactory.selectedTest.Id,
            CriteriaId: criteria.Id,
            MaxScore: null,
            COId: null,
            BTId: criteria.BTId
        };
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.cos = [];
        $scope.bts = [];
        $scope.currentCriteria = criteria;

        $scope.ok = function() {
            if ($scope.newQuestion.MaxScore == null || $scope.newQuestion.MaxScore == undefined || $scope.newQuestion.BTId == null) {
                toastr.warning('Please enter max marks and choose a blooms level');
            } else {
                CriteriaFactory.addQuestionToTest($scope.newQuestion)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.info('There are no questions!');
                        } else {
                            toastr.success('Question added to question paper!');
                            $uibModalInstance.close();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCOAndBT = function() {
            var obj = {
                SubjectIds: SelectClassFactory.SubjectIds,
                ClassIds: SelectClassFactory.ClassIds,
            }
            if ($scope.loggedInUser.Type == "OBE") {
                CriteriaFactory.getCourseOutcomes(obj)
                    .then(function(success) {
                        $scope.cos = [];
                        if (success.data.Code != "S001") {
                            toastr.info('There are no COs created');
                        } else {
                            $scope.cos = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }

            CriteriaFactory.getBloomsTaxonomy()
                .then(function(success) {
                    $scope.bts = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no Bloom levels');
                    } else {
                        $scope.bts = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.getAllCOAndBT();

    });