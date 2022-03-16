angular.module('app')
    .controller('LearningOutcomeController', function($scope, LoginFactory, DashboardFactory, toastr, LearningOutcomeFactory, SelectClassFactory) {

        $scope.tests = [];
        $scope.items = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.studentsToShow = [];
        $scope.chapters = [];
        $scope.rangeSlider = {
            Start: 0,
            End: 100
        };
        $scope.sliderOptions = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 5,
                onEnd: function(sliderId, modelValue, highValue, pointerType) {
                    if ($scope.students.length > 0) {
                        $scope.marksRangeChanged(modelValue, highValue);
                    }
                },
            }
        };
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.students = [];

        $scope.selected = {
            marksRange: {
                Id: 1,
                Name: "All students"
            },
            item: {
                Id: 0,
                Name: "All"
            }
        };

        $scope.getMarksStatisticsByRange = function(classIds, subjectIds) {
            $scope.marksStatistics = null;
            //hardcoding the tests dropdown to all tests by sending 0 in the test id field
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                TestId: 0,
                RangeId: $scope.selected.marksRange.Id,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            LearningOutcomeFactory.getMarksStatisticsByRange(obj)
                .then(function(success) {
                    $scope.studentsToShow = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Could not fetch marks statistics. Please try later!');
                    } else {
                        $scope.students = success.data.Data;
                        calculateAverageWithWeightage();
                        $scope.studentsToShow = angular.copy($scope.students);
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.marksRangeChanged = function(modelValue, highValue) {
            $scope.studentsToShow = $scope.students.filter(function(obj) {
                return (obj.Marks >= modelValue && obj.Marks <= highValue)
            });
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
                    if (success.data.Code != "S001") {
                        toastr.warning('Could not get lesson plan. Please try later!');
                    } else {
                        $scope.chapters = success.data.Data;
                        $scope.getTopicsForClass();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getTopicsForClass = function() {
            LearningOutcomeFactory.getTopicsForClass(SelectClassFactory.selected.class.Id, SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('Chapter and topic performances will reflect once students start taking quiz!');
                    } else {
                        $scope.completedTopics = success.data.Data;
                        if ($scope.completedTopics[0].TopicId != null) {
                            var chapterScore = 0,
                                topicsCompleted = 0;
                            for (var i = 0; i < $scope.chapters.length; i++) {
                                chapterScore = 0;
                                topicsCompleted = 0;
                                $scope.chapters[i].ChapterAverage = null;
                                for (var j = 0; j < $scope.chapters[i].Topics.length; j++) {
                                    $scope.chapters[i].Topics[j].IsCompleted = false;
                                    for (var k = 0; k < $scope.completedTopics.length; k++) {
                                        if ($scope.chapters[i].Topics[j].Id == $scope.completedTopics[k].TopicId) {
                                            $scope.chapters[i].Topics[j].IsCompleted = true;
                                            if ($scope.loggedInUser.Type == "OBE") {
                                                if ($scope.completedTopics[k].TopicAverage == 0 || $scope.completedTopics[k].TopicAverage == null) {
                                                    if ($scope.completedTopics[k].TopicTestAverage == 0) {
                                                        $scope.chapters[i].Topics[j].TopicAverage = 0;
                                                    } else {
                                                        $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicTestAverage;
                                                    }
                                                } else {
                                                    if ($scope.completedTopics[k].TopicTestAverage == 0 || $scope.completedTopics[k].TopicTestAverage == null) {
                                                        $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicAverage;
                                                    } else {
                                                        $scope.chapters[i].Topics[j].TopicAverage = ($scope.completedTopics[k].TopicAverage * 0.1) + ($scope.completedTopics[k].TopicTestAverage * 0.9);
                                                    }
                                                }
                                            } else {
                                                $scope.chapters[i].Topics[j].TopicAverage = $scope.completedTopics[k].TopicAverage;
                                            }
                                            chapterScore += parseFloat($scope.chapters[i].Topics[j].TopicAverage);
                                            topicsCompleted++;
                                        }
                                    }
                                }
                                if (topicsCompleted) {
                                    $scope.chapters[i].ChapterAverage = chapterScore / topicsCompleted;
                                } else {
                                    $scope.chapters[i].ChapterAverage = null;
                                }
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.toggleChapter = function(chapter) {
            chapter.show = !chapter.show;
            for (var i = 0; i < $scope.chapters.length; i++) {
                if ($scope.chapters[i].Id != chapter.Id) {
                    $scope.chapters[i].show = false;
                }
            }
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        function calculateAverageWithWeightage() {
            angular.forEach($scope.students, function(student) {
                student.Marks = DashboardFactory.calculateAverageWithWeightage(student.TestScore, student.ExamScore, student.QuizScore);
            });
        }

        $scope.getMarksStatisticsByRange(SelectClassFactory.ClassIds, SelectClassFactory.SubjectIds);
        if ($scope.loggedInUser.PackageCode != 'BASIC') {
            $scope.getLessonPlan();
        }
    });