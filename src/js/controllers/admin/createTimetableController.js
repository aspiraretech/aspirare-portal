angular.module('app')
    .controller('CreateTimetableController', function($scope, DashboardFactory, LoginFactory, CreateTimetableFactory, toastr) {

        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null,
            day: "Monday"
        };

        $scope.keywords = DashboardFactory.keywords;
        $scope.subjects = [];
        $scope.timeTable = [];
        $scope.periods = [{
            Name: "1"
        }, {
            Name: "2"
        }, {
            Name: "3"
        }, {
            Name: "4"
        }, {
            Name: "5"
        }, {
            Name: "6"
        }, {
            Name: "7"
        }, {
            Name: "8"
        }];
        $scope.days = [{
            Name: "Monday"
        }, {
            Name: "Tuesday"
        }, {
            Name: "Wednesday"
        }, {
            Name: "Thursday"
        }, {
            Name: "Friday"
        }, {
            Name: "Saturday"
        }];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.subjects = [];
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

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.semesters = success.data.Data;
                        $scope.selected.semesterId = $scope.semesters[0].Id;
                        $scope.semesterSelected($scope.selected.semesterId);
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.classId = null;
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

        $scope.classSelected = function() {
            $scope.subjects = [];
            var obj = {
                ClassId: $scope.selected.classId
            };
            DashboardFactory.getAllSubjectsForSemester($scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.subjects = success.data.Data;
                        CreateTimetableFactory.getDaysTimetable(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.warning('Timetable has not been set for this day!');
                                } else {
                                    $scope.timeTable = success.data.Data;
                                    for (var i = 0; i < $scope.days.length; i++) {
                                        $scope.days[i].Subjects = [];
                                    }
                                    for (var i = 0; i < $scope.days.length; i++) {
                                        for (var j = 0; j < $scope.subjects.length; j++) {
                                            for (var k = 0; k < $scope.timeTable.length; k++) {
                                                if ($scope.days[i].Name == $scope.timeTable[k].Day && $scope.subjects[j].Id == $scope.timeTable[k].SubjectId) {
                                                    $scope.days[i].Subjects.push($scope.subjects[j]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }, function(error) {
                                toastr.success(error);
                            });
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.subjectSelectedForDay = function(day, subject) {
            var obj = {
                ClassId: $scope.selected.classId,
                SubjectId: subject.Id,
                Day: day.Name,
                Action: "add"
            };
            CreateTimetableFactory.addDaysTimetable(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem. Please try later!');
                    } else {
                        toastr.success('Timetable updated successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.addDaysTimetable = function(subject) {
            var obj = {
                ClassId: $scope.selected.classId,
                SubjectId: subject.Id,
                Day: $scope.selected.day,
                Action: subject.isChecked == true ? "add" : "remove"
            };
            CreateTimetableFactory.addDaysTimetable(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem. Please try later!');
                    } else {
                        toastr.success('Timetable updated successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getAllCourses();
    });