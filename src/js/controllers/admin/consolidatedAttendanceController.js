angular.module('app')
    .controller('ConsolidatedAttendanceController', function($scope, toastr, LoginFactory, DashboardFactory, AttendanceFactory) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.courses = [];
        $scope.selected = {
            course: null,
            branch: null,
            semester: null,
            class: null,
            destination: null
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];

            $scope.selected.course = null;
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.selected.class = null;
            $scope.selected.destination = null;

            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(course) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];

            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.selected.class = null;
            $scope.selected.destination = null;

            DashboardFactory.getAllBranches(course.Id, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function(branch) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];

            $scope.selected.semester = null;
            $scope.selected.class = null;
            $scope.selected.destination = null;
            DashboardFactory.getAllSemesters(branch.Id, LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.semesterSelected = function(semester) {
            $scope.classes = [];
            $scope.subjects = [];

            $scope.selected.class = null;
            $scope.selected.destination = null;
            DashboardFactory.getAllClasses($scope.selected.branch.Id, semester.Id, LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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

        $scope.classSelected = function(cls) {
            $scope.subjects = [];
            DashboardFactory.getAllSubjectsForSemester($scope.selected.course.Id, $scope.selected.branch.Id, $scope.selected.semester.Id)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.subjects = success.data.Data;
                        var total_subjects = $scope.subjects.length,
                            iteration = 0;
                        angular.forEach($scope.subjects, function(subject, subjectInded) {
                            var obj = {
                                SubjectIds: [subject.Id],
                                ClassIds: [cls.Id],
                                IsElective: subject.IsElective
                            }
                            AttendanceFactory.getAttendanceForWeb(obj)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error(success.data.Message);
                                    } else {
                                        subject.attendance = success.data.Data;
                                    }
                                    if (++iteration == total_subjects) {
                                        $scope.chunkedSubjects = chunk($scope.subjects, 3);
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                });
                        });
                    }
                });
        };

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.getAllCourses();

    });