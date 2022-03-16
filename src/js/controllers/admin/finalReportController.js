angular.module('app')
    .controller('FinalReportController', function($scope, toastr, ReportsFactory, DashboardFactory, LoginFactory, StudentsFactory, $filter) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null,
            subjectId: null
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.subjects = [];

        $scope.students = [];

        //course branch semester
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

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getClasses(semesterId);
            $scope.getSubjects(semesterId);
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

        $scope.getSubjects = function(semesterId) {
            DashboardFactory.getAllSubjectsForSemester($scope.selected.courseId, $scope.selected.branchId, semesterId)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getStudents = function() {
            $scope.students = [];
            StudentsFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId, $scope.selected.classId)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No students found!');
                    } else {
                        $scope.students = success.data.Data;
                        $scope.getAllKeywordsForSubject();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllKeywordsForSubject = function() {
            var obj = {
                SubjectId: $scope.selected.subjectId,
                Type: 1
            };
            $scope.tags = [];
            ReportsFactory.getAllTags(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Something went wrong with server. Please try later');
                    } else {
                        $scope.tags = success.data.Data;
                        angular.forEach($scope.students, function(student) {
                            student.Tags = angular.copy($scope.tags);
                        });
                        $scope.getAllTagReport();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllTagReport = function() {
            angular.forEach($scope.students, function(student, studentIndex) {
                angular.forEach(student.Tags, function(tag, tagIndex) {
                    var obj = {
                        StudentId: student.Id,
                        ClassId: student.ClassId,
                        SubjectId: $scope.selected.subjectId,
                        Tag: tag.Name
                    };
                    ReportsFactory.getSubjectStatsForPrimeKeyword(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.warning('Something went wrong with server. Please try later');
                            } else {
                                var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                                var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                                var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                                var overallAvg = DashboardFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                                tag.Score = overallAvg;
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                });
            });
        };

        $scope.getAllCourses();

    });