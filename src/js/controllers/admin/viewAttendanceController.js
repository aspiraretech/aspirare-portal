angular.module('app')
    .controller('ViewAttendanceController', function($scope, DashboardFactory, LoginFactory, toastr, AttendanceFactory, SelectClassFactory, UsersFactory, TakeAttendanceFactory) {

        $scope.selected = {
            user: null,
            subject: null,
            class: null,
        };
        $scope.users = [];
        $scope.usersToShow = [];
        $scope.subjects = [];
        $scope.classes = [];
        $scope.attendance = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;

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

        $scope.userSelected = function(user) {
            $scope.attendance = [];
            $scope.subjects = [];
            $scope.classes = [];
            $scope.selected.subject = null;
            $scope.selected.class = null;
            SelectClassFactory.getAllSubjectsForUser(user.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get subject list for faculty. Please try later!');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function(selectedSubject) {
            $scope.attendance = [];
            $scope.selected.subjectId = selectedSubject.Id;
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            SelectClassFactory.getAllClassesForSubject($scope.selected.subject.Id, $scope.selected.user.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get classes for the subject. Please try later!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.checkAttendance = function() {
            $scope.attendance = [];
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            TakeAttendanceFactory.getAllStudentsInClass(LoginFactory.loggedInUser.CollegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get students in this class. Please try later!');
                    } else {
                        $scope.Students = success.data.Data;
                        $scope.ClassIds = $scope.getUniqueIds($scope.Students, 'ClassId');
                        if ($scope.selected.subject.IsElective == "true") {
                            $scope.SubjectIds = $scope.getUniqueIds($scope.Students, 'NormalSubjectId');
                        } else {
                            $scope.SubjectIds.push($scope.selected.subject.Id);
                        }
                        var obj = {
                            SubjectIds: $scope.SubjectIds,
                            ClassIds: $scope.ClassIds,
                            IsElective: $scope.selected.subject.IsElective
                        }
                        AttendanceFactory.getAttendanceForWeb(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.error(success.data.Message);
                                } else {
                                    $scope.attendance = success.data.Data;
                                }
                            }, function(error) {
                                toastr.error(error);
                            });
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getUniqueIds = function(array, key) {
            return array.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.exportToXLS = function() {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('attendance-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'Attendance.xls';
            a.click();
        };

        if ($scope.loggedInUser.Role == 'FACULTY') {
            $scope.selected.class = angular.copy(SelectClassFactory.selected.class);
            $scope.selected.subject = angular.copy(SelectClassFactory.selected.subject);
            $scope.checkAttendance();
        } else {
            $scope.getAllUsers();
        }

    });