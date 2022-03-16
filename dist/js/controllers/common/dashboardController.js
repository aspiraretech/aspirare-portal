angular.module('app')
    .controller('DashboardController', function($scope, $state, DashboardFactory, LoginFactory, toastr, SelectClassFactory) {

        $scope.labels = ["Academic Performance", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];

        $scope.marksStatistics = [];
        $scope.attendanceStatistics = [];
        $scope.graph = {
            color: ""
        };
        $scope.colleges = LoginFactory.colleges;
        $scope.selectedCollege = LoginFactory.loggedInUser;
        $scope.selected = {
            collegeId: ""
        };
        $scope.template = {
            url: null
        };
        $scope.isModalOpen = false;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.studentCount = 0;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.attendance = {
            ChartConfig: {
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    name: "Attendance",
                    data: $scope.attendanceStatistics.Percentages
                }]
            }
        };


        //admin dashboard
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
                    toastr.success(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.selected.classId = null;
            $scope.getClasses(semesterId);
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

        $scope.getSemesters = function(branchId) {
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getClasses = function(semesterId) {
            DashboardFactory.getAllClasses($scope.selected.branchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getAttendanceStatistics = function(obj) {
            $scope.attendanceStatistics = [];
            DashboardFactory.getCollegeAttendanceStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem in fetching attendance');
                    } else {
                        if (success.data.Data.Dates.length == 0) {
                            toastr.info('Attendance has not been marked yet!');
                        } else {
                            $scope.attendanceStatistics = success.data.Data;
                            $scope.renderLineChart();
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getMarksStatistics = function(obj) {
            $scope.marksStatistics = [];
            DashboardFactory.getCollegeMarksStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem in fetching percentages');
                    } else {
                        $scope.marksStatistics = success.data.Data;
                        if ($scope.marksStatistics.Percentage >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.marksStatistics.Percentage >= 50 && $scope.marksStatistics.Percentage < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getAllStatistics = function() {
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                CourseId: $scope.selected.courseId,
                BranchId: $scope.selected.branchId,
                SemesterId: $scope.selected.semesterId,
                ClassId: $scope.selected.classId
            }
            if ($scope.selectedCollege.PackageCode != 'EXTENDED') {
                $scope.getAttendanceStatistics(obj);
            }
            if ($scope.selectedCollege.PackageCode != 'LM') {
                $scope.getMarksStatistics(obj);
            }
        };

        $scope.renderLineChart = function() {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    data: $scope.attendanceStatistics.Percentages
                }]
            });
        };

        //faculty dashboard
        $scope.getMarksStatisticsForFaculty = function(subjectIds, classIds) {
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds
            };
            DashboardFactory.getMarksStatisticsForFaculty(obj)
                .then(function(success) {
                    $scope.tests = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Could not fetch marks statistics. Please try later!');
                    } else {
                        $scope.tests = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
            DashboardFactory.getClassStatsForSubject(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Could not fetch marks statistics. Please try later!');
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
                    toastr.warning(error);
                });
        };

        $scope.getAttendanceStatisticsForFaculty = function(subjectIds, classIds) {
            var obj = {
                SubjectIds: subjectIds,
                ClassIds: classIds,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                IsElective: SelectClassFactory.selected.subject.IsElective
            };
            DashboardFactory.getAttendanceStatisticsForFaculty(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('Attendance has not been marked yet!');
                    } else {
                        $scope.attendanceStatistics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getStats = function(subjectIds, classIds) {
            if ($scope.loggedInUser.PackageCode != 'LM') {
                $scope.getMarksStatisticsForFaculty(subjectIds, classIds);
            }
            $scope.getAttendanceStatisticsForFaculty(subjectIds, classIds);
        };

        if ($scope.loggedInUser.Role == 'ADMIN') {
            $scope.template.url = './views/templates/AdminDashboardTemplate.html';
            $scope.getAllCourses();
            $scope.getAllStatistics();
        } else if ($scope.loggedInUser.Role == 'FACULTY') {
            $scope.template.url = './views/templates/FacultyDashboardTemplate.html';
            if (SelectClassFactory.SubjectIds.length > 0) {
                $scope.getStats(SelectClassFactory.SubjectIds, SelectClassFactory.ClassIds);
            }
        } else {
            $state.go('app.students.viewStudents');
        }

        $scope.$on('subjectsLoaded', function(event, data) {
            $scope.getStats(SelectClassFactory.SubjectIds, SelectClassFactory.ClassIds);
        });

    });