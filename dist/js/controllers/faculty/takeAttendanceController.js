angular.module('app')
    .controller('TakeAttendanceController', function($scope, DashboardFactory, TakeAttendanceFactory, LoginFactory, toastr, UsersFactory, SelectClassFactory) {

        $scope.subjects = [];
        $scope.classes = [];
        $scope.users = [];
        $scope.usersToShow = [];
        $scope.attendanceList = [];
        $scope.presentCount = 0;
        $scope.keywords = DashboardFactory.keywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.selected = {
            user: null,
            class: null,
            subject: null,
            attendanceDate: new Date()
        };
        $scope.dateInput = {
            min: moment().subtract(2, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };
        $scope.selectAll = function() {
            for (var i = 0; i < $scope.students.length; i++) {
                $scope.students[i].isPresent = true;
            };
            $scope.updateStudentsCount();
        };

        $scope.unselectAll = function() {
            for (var i = 0; i < $scope.students.length; i++) {
                $scope.students[i].isPresent = false;
            };
            $scope.updateStudentsCount();
        };

        $scope.updateStudentsCount = function() {
            $scope.presentCount = 0;
            angular.forEach($scope.students, function(student) {
                if (student.isPresent) {
                    $scope.presentCount++;
                }
            });
        };
        if ($scope.loggedInUser.Role == 'ADMIN') {
            $scope.students = [];
        } else {
            $scope.selected.user = angular.copy($scope.loggedInUser);
            $scope.selected.subject = SelectClassFactory.selected.subject;
            $scope.selected.class = SelectClassFactory.selected.class;
            $scope.students = SelectClassFactory.Students;
            $scope.selectAll();
        }
        $scope.collegeId = LoginFactory.loggedInUser.CollegeId;

        $scope.getAllSubjectsForUser = function(user) {
            SelectClassFactory.getAllSubjectsForUser(user.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no subjects assigned to this user');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function(selectedSubject) {
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            SelectClassFactory.getAllClassesForSubject($scope.selected.subject.Id, $scope.selected.user.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no classes assigned for the subject!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllStudentsInClass = function() {
            TakeAttendanceFactory.getAllStudentsInClass($scope.collegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no students in class');
                    } else {
                        $scope.students = success.data.Data;
                        $scope.selectAll();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.submitAttendance = function() {
            var attendanceTemplate = {
                Id: null,
                AttendanceDate: moment($scope.selected.attendanceDate).format('YYYY-MM-DD H:mm:ss'),
                IsPresent: "",
                TakenBy: LoginFactory.loggedInUser.Id,
                StudentId: "",
                SubjectId: $scope.selected.subject.Id,
                ClassId: ""
            };
            for (var i = 0; i < $scope.students.length; i++) {
                var temp = angular.copy(attendanceTemplate);
                temp.IsPresent = $scope.students[i].isPresent == undefined ? "false" : $scope.students[i].isPresent.toString();
                temp.StudentId = $scope.students[i].Id;
                temp.ClassId = $scope.students[i].ClassId;
                if ($scope.selected.subject.IsElective == "true") {
                    temp.SubjectId = $scope.students[i].NormalSubjectId;
                }
                $scope.attendanceList.push(temp);
            }
            var attendance = {
                Attendance: $scope.attendanceList,
                TopicsTaught: []
            }
            TakeAttendanceFactory.takeAttendance(attendance)
                .then(function(success) {
                        $scope.attendanceList = [];
                        if (success.data.Code != "S001") {
                            toastr.warning('Could not mark attendance. Please try later!');
                        } else {
                            toastr.success('Attendance was marked successfully');
                            if ($scope.loggedInUser.Role == 'ADMIN') {
                                $scope.selected.subject = null;
                                $scope.selected.class = null;
                                $scope.students = [];
                            } else {
                                for (var i = 0; i < $scope.students.length; i++) {
                                    $scope.students[i].isPresent = "false";
                                }
                            }
                            $scope.updateStudentsCount();
                        }
                    },
                    function(error) {
                        toastr.error(error);
                    });
        };

        function twoDigits(d) {
            if (0 <= d && d < 10) return "0" + d.toString();
            if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
            return d.toString();
        }

        Date.prototype.toMysqlFormat = function() {
            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
        }

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get faculty list. Please try later!');
                        $scope.users = success.data.Data;
                        $scope.usersToShow = [];
                    } else {
                        $scope.users = success.data.Data;
                        $scope.usersToShow = [];
                        for (var i = 0; i < $scope.users.length; i++) {
                            if ($scope.users[i].Role != 'STAFF' && $scope.users[i].Role != 'DRIVER' && $scope.users[i].Role != 'LIBRARIAN') {
                                $scope.usersToShow.push($scope.users[i]);
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        if ($scope.loggedInUser.Role == 'ADMIN') {
            $scope.getAllUsers();
        }

    });