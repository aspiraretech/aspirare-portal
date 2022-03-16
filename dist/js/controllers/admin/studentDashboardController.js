angular.module('app')
    .controller('StudentDashboardController', function($scope, LearningOutcomeFactory, LoginFactory, DashboardFactory, StudentsFactory, toastr, $uibModal) {

        $scope.student = angular.copy(StudentsFactory.selectedStudent);
        $scope.selectedCriteria = angular.copy(StudentsFactory.selectedCriteria);
        StudentsFactory.selectedStudent = null;
        $scope.chapters = [];

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.keywords = DashboardFactory.keywords;
        $scope.currentSubject = null;

        $scope.marksStatistics = null;
        $scope.attendanceStatistics = {};
        $scope.averageRating = 0;
        $scope.graph = {
            color: ""
        };
        $scope.currentSlide = 0;
        $scope.app_base = LoginFactory.getAppBase();

        $scope.getMarksStatistics = function() {
            $scope.average = 0;
            var obj = {
                StudentId: $scope.student.Id,
                ClassId: $scope.student.ClassId
            }
            DashboardFactory.getAllSubjectStatsForStudent(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No assessments have been entered yet!');
                    } else {
                        var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                        var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                        var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                        $scope.average = DashboardFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);;
                        if ($scope.average >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.average >= 50 && $scope.average < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                        $scope.averageRating = $scope.getaverage;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllAttendanceStatistics = function() {
            for (var i = 0; i < $scope.subjects.length; i++) {
                getStats(i);
            }
        };

        $scope.getAllSubjects = function() {
            DashboardFactory.getAllSubjects($scope.selectedCriteria.courseId, $scope.selectedCriteria.branchId, $scope.selectedCriteria.semesterId, $scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no subjects for this course!');
                    } else {
                        $scope.subjects = success.data.Data;
                        if ($scope.loggedInUser.PackageCode == 'LM' || $scope.loggedInUser.Type == 'LM') {
                            $scope.getAllAttendanceStatistics();
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.slideChanged = function(index) {
            $scope.activateTab(index);
            if (index == 0) {
                $scope.attendanceStatistics = {};
                $scope.getMarksStatistics();
            } else {
                $scope.marksStatistics = null;
                $scope.currentSubject = $scope.subjects[index - 1];
                var obj = {
                    StudentId: $scope.student.Id,
                    ClassId: $scope.student.ClassId,
                    SubjectId: $scope.currentSubject.Id
                }
                DashboardFactory.getSubjectStatsForStudent(obj)
                    .then(function(success) {
                        $scope.average = 0;
                        if (success.data.Code != "S001") {
                            toastr.info('No assessments have been entered yet!');
                        } else {
                            var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                            var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                            var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                            $scope.average = DashboardFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                            if ($scope.average >= 75) {
                                $scope.graph.color = "#2ba14b";
                            } else if ($scope.average >= 50 && $scope.average < 75) {
                                $scope.graph.color = "#f1b500";
                            } else {
                                $scope.graph.color = "#e33e2b";
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
                DashboardFactory.getMarksStatistics($scope.currentSubject.Id, $scope.selectedCriteria.classId, $scope.student.Id)
                    .then(function(success) {
                        $scope.tests = [];
                        if (success.data.Code != "S001") {
                            toastr.info('No assessments have been entered yet!');
                        } else {
                            $scope.tests = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
                $scope.getAttendanceStatistics($scope.subjects[index - 1].Id, $scope.student.Id);
            }
        };

        $scope.getAttendanceStatistics = function(subjectId, studentId) {
            DashboardFactory.getAttendanceStatistics(subjectId, studentId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('Attendance has not been marked yet!');
                    } else {
                        $scope.attendanceStatistics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        var getStats = function(i) {
            DashboardFactory.getAttendanceStatistics($scope.subjects[i].Id, $scope.student.Id)
                .then(function(success) {
                    $scope.subjects[i].AttendanceStatistics = success.data.Data;
                    if (i == $scope.subjects.length - 1) {
                        $scope.chunkedSubjects = chunk($scope.subjects, 3);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.activateTab = function(index) {
            $scope.currentSlide = index;
            var tabs = document.getElementsByClassName('subject-nav-item');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active')
            }
            if (index == 0) {
                document.getElementById('sub0').classList.add('active');
            } else {
                document.getElementById('sub' + $scope.subjects[index - 1].Id).classList.add('active');
                $scope.getLessonPlan();
            }
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectIds: [$scope.subjects[$scope.currentSlide - 1].Id],
                ClassIds: [$scope.selectedCriteria.classId],
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
                        $scope.getTopicsForClass();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getTopicsForClass = function() {
            LearningOutcomeFactory.getTopicsForStudent($scope.student.Id, $scope.subjects[$scope.currentSlide - 1].Id)
                .then(function(success) {
                    $scope.completedTopics = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No topic scores available for these chapters');
                    } else {
                        $scope.completedTopics = success.data.Data;
                        if ($scope.completedTopics[0].TopicId != null) {
                            var chapterScore = 0,
                                topicsCompleted = 0;
                            for (var i = 0; i < $scope.chapters.length; i++) {
                                chapterScore = 0;
                                topicsCompleted = 0;
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

        $scope.studentAttendance = function(subject) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + '/views/templates/StudentAttendanceTemplate.html',
                controller: 'StudentAttendanceController',
                resolve: {
                    student: function() {
                        return $scope.student;
                    },
                    currentSubject: function() {
                        return $scope.currentSubject;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                console.log(response);
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        $scope.addDaysAttendanceToStudent = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + '/views/templates/DaysAttendanceTemplate.html',
                controller: 'DaysAttendanceController',
                resolve: {
                    student: function() {
                        return $scope.student;
                    },
                    currentSubject: function() {
                        return $scope.currentSubject;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                console.log(response);
                $scope.getAttendanceStatistics($scope.currentSubject.Id, $scope.student.Id);
            }, function() {
                console.log('Cancelled');
            });
        };

        if ($scope.loggedInUser.PackageCode != 'LM' && $scope.loggedInUser.Type != 'LM') {
            $scope.getMarksStatistics();
        }
        $scope.getAllSubjects();
    }).controller('StudentAttendanceController', function($scope, $uibModalInstance, toastr, StudentsFactory, student, currentSubject) {

        $scope.student = student;
        $scope.currentSubject = currentSubject;
        $scope.getStudentAttendance = function() {
            StudentsFactory.getStudentAttendance($scope.student.Id, $scope.currentSubject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('Could not fetch attendance info. Please try later!');
                    } else {
                        $scope.attendance = success.data.Data;
                        angular.forEach($scope.attendance, function(att) {
                            att.IsPresent = (att.IsPresent == "true");
                        });
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.attendanceChange = function(att) {
            var obj = {
                Id: att.Id ? att.Id : null,
                IsPresent: att.IsPresent.toString()
            };
            StudentsFactory.editAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not edit attendance. Please try later!');
                    } else {
                        toastr.success('Attendance was edited successfully');
                        $scope.getStudentAttendance();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.ok = function() {
            $uibModalInstance.dismiss();
        };

        $scope.getStudentAttendance();

    }).controller('DaysAttendanceController', function($scope, $uibModalInstance, toastr, LoginFactory, student, currentSubject, AttendanceFactory) {

        $scope.student = student;
        $scope.attendanceObj = {
            Id: null,
            AttendanceDate: new Date(),
            IsPresent: false,
            TakenBy: LoginFactory.loggedInUser.Id,
            StudentId: student.Id,
            SubjectId: currentSubject.Id,
            ClassId: student.ClassId
        };
        $scope.dateInput = {
            min: moment().subtract(2, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };
        $scope.submitAttendance = function() {
            $scope.attendanceObj.AttendanceDate = moment($scope.attendanceObj.AttendanceDate).format('YYYY-MM-DD H:mm:ss')
            AttendanceFactory.addDaysAttendanceToStudent($scope.attendanceObj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not add attendance. Please try later!');
                    } else {
                        toastr.success('Attendance was added successfully');
                        $uibModalInstance.close();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    });