angular.module('app')
    .controller('ManageAttendanceController', function($scope, toastr, DashboardFactory, SelectClassFactory, LoginFactory, AttendanceFactory, UsersFactory, TakeAttendanceFactory) {

        $scope.selected = {
            subject: null,
            class: null,
            DateRange: {
                startDate: moment().subtract(1, 'year'),
                endDate: moment()
            },
            user: null
        };

        $scope.users = [];
        $scope.usersToShow = [];

        $scope.options = {
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            opens: 'left',
            startDate: moment(),
            endDate: moment().add(1, 'year'),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }

        $scope.subjects = [];
        $scope.classes = [];

        $scope.attendance = [];
        $scope.studentNames = [];
        $scope.dates = [];
        $scope.keywords = DashboardFactory.keywords;

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
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            SelectClassFactory.getAllSubjectsForUser(user.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get subject list for faculty. Please try later!');
                    } else {
                        $scope.subjects = success.data.Data;
                        // for (var i = 0; i < $scope.subjects.length; i++) {
                        //     if ($scope.subjects[i].IsElective == undefined) {
                        //         $scope.subjects.splice(i, 1);
                        //     }
                        // }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function(selectedSubject) {
            $scope.attendance = [];
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            $scope.selected.subject = selectedSubject;
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
            $scope.uniqueDates = [];
            $scope.studentIds = [];
            // for (var i = 0; i < $scope.Students.length; i++) {
            //     $scope.studentIds.push($scope.Students[i].Id);
            // }
            // var obj = {
            //     SubjectIds: $scope.SubjectIds,
            //     ClassIds: $scope.ClassIds,
            //     DateRange: $scope.selected.DateRange,
            //     StudentIds: $scope.studentIds
            // }
            var obj = {
                SubjectId: ($scope.Students[0].NormalSubjectId == undefined) ? $scope.selected.subject.Id : $scope.Students[0].NormalSubjectId,
                ClassId: $scope.Students[0].ClassId,
                DateRange: $scope.selected.DateRange,
                StudentId: $scope.Students[0].Id
            }
            AttendanceFactory.getUniqueAttendanceDates(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No attendance marked for this time period!');
                    } else {
                        $scope.uniqueDates = success.data.Data;
                        angular.forEach($scope.Students, function(student) {
                            student.Attendance = [];
                            var obj = {
                                SubjectId: (student.NormalSubjectId == undefined) ? $scope.selected.subject.Id : student.NormalSubjectId,
                                ClassId: student.ClassId,
                                DateRange: $scope.selected.DateRange,
                                StudentId: student.Id
                            }
                            AttendanceFactory.getDaysAttendance(obj)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.info('No attendance marked for this time period!');
                                    } else {
                                        student.Attendance = success.data.Data;
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                });
                        });
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.openDatePicker = function() {
            $scope.datePicker.opened = true;
        };

        $scope.getAttendance = function() {
            if ($scope.selected.subject != null) {
                $scope.getAllStudentsInClass();
            } else {
                toastr.warning('Choose a subject to show attendance!');
            }
        };

        $scope.getAllStudentsInClass = function() {
            $scope.Students = [];
            $scope.ClassIds = [];
            $scope.SubjectIds = [];
            TakeAttendanceFactory.getAllStudentsInClass($scope.selected.user.CollegeId, $scope.selected.subject.Id, $scope.selected.class.Id, $scope.selected.subject.IsElective)
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
                        $scope.checkAttendance();
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

        $scope.formatAttendance = function() {
            $scope.uniqueDates = [];
            for (var i = 0; i < $scope.attendance.length; i++) {
                if ($scope.Students[0].Id == $scope.attendance[i].StudentId) {
                    $scope.uniqueDates.push($scope.attendance[i].AttendanceDate);
                }
            }
            for (var j = 0; j < $scope.Students.length; j++) {
                $scope.Students[j].Attendance = [];
                for (var i = 0; i < $scope.attendance.length; i++) {
                    if ($scope.Students[j].Id == $scope.attendance[i].StudentId) {
                        $scope.Students[j].Attendance.push($scope.attendance[i]);
                    }
                }
            }
        };

        $scope.deleteDaysAttendance = function(dat) {
            var r = confirm("Are you sure you want to delete attendance?");
            if (r == true) {
                var obj = {
                    SubjectIds: $scope.SubjectIds,
                    ClassIds: $scope.ClassIds,
                    AttendanceDate: dat.AttendanceDate
                };
                AttendanceFactory.deleteDaysAttendance(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete days attendance. Please try later!');
                        } else {
                            toastr.success('Attendance was deleted successfully');
                            $scope.getAllStudentsInClass();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateAttendance = function(att) {
            var obj = {
                Id: att.Id,
                IsPresent: att.IsPresent.toString()
            };
            AttendanceFactory.editAttendance(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not edit attendance. Please try later!');
                    } else {
                        toastr.success('Attendance was edited successfully');
                        $scope.getAllStudentsInClass();
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllUsers();
    });