angular.module('app')
    .controller('StudentsController', function($scope, $state, DashboardFactory, StudentsFactory, LoginFactory, toastr, $uibModal, SelectClassFactory, FeesStructureFactory, $filter) {

        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        };

        $scope.students = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.app_base = LoginFactory.getAppBase();
        $scope.showRegisterNumber = false;

        $scope.getTotalFees = function() {
            StudentsFactory.getAllFeesCollected(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.feesCollected = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Unable to get fees information!');
                    } else {
                        $scope.totalTuitionFees = success.data.Data[0].TotalTuitionFees;
                        $scope.collectedTuitionFees = success.data.Data[0].CollectedTuitionFees;
                        $scope.tuitionFeesDiscount = success.data.Data[0].TuitionFeesDiscount;
                        $scope.collectedTransportFees = success.data.Data[0].CollectedTransportFees;
                        $scope.studentCount = success.data.Data[0].StudentCount;
                        // $scope.calculateTotalFees();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getDevelopmentFeesCollected = function() {
            StudentsFactory.getDevelopmentFeesCollected(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.developmentFeesCollected = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Unable to get fees information!');
                    } else {
                        $scope.developmentFeesCollected = success.data.Data[0].CollectedDevelopmentFees;
                        var feesToShow = $filter('INR')($scope.developmentFeesCollected);
                        toastr.info('Total development fees collected is ' + feesToShow);
                        // $scope.calculateTotalFees();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.calculateTotalFees = function() {
            $scope.totalFees = 0;
            $scope.collectedFees = 0;
            for (var i = 0; i < $scope.feesCollected.length; i++) {
                $scope.totalFees += parseFloat($scope.feesCollected[i].TotalFees);
                $scope.collectedFees += $scope.feesCollected[i].FeesPaid;
            }
        };

        $scope.getInstallMetrics = function() {
            StudentsFactory.getInstallMetrics(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.installMetrics = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Unable to get App Installation Metrics!');
                    } else {
                        $scope.installMetrics = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.sendInstallReminder = function() {
            var obj = {
                Students: $scope.installMetrics.NotInstalled,
                CollegeName: $scope.loggedInUser.Nickname
            };
            StudentsFactory.sendInstallReminder(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Could not send reminder. Please try later!');
                    } else {
                        toastr.success('Reminder sent successfully');
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        //courses
        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.students = [];
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.selected = StudentsFactory.selectedValues;
                        if ($scope.selected.courseId != null) {
                            $scope.getBranches($scope.selected.courseId);
                        }
                        if ($scope.selected.branchId != null && $scope.selected.courseId != null) {
                            $scope.getSemesters($scope.selected.branchId);
                        }
                        if ($scope.selected.semesterId != null && $scope.selected.branchId != null && $scope.selected.courseId != null) {
                            $scope.getClasses($scope.selected.semesterId);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            if (courseId != null) {
                $scope.getBranches(courseId);
            }
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            if (branchId != null) {
                $scope.getSemesters(branchId);
            }
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.students = [];
            $scope.selected.classId = null;
            if (semesterId != null) {
                $scope.getClasses(semesterId);
            }
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
                        if (LoginFactory.loggedInUser.Type == 'SCHOOL') {
                            $scope.selected.semesterId = $scope.semesters[0].Id;
                            $scope.getClasses($scope.selected.semesterId);
                        }
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
                        if ($scope.selected.classId != null) {
                            $scope.getStudents();
                        }
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
                        if ($scope.students[0].RollNumber != null) {
                            $scope.showRegisterNumber = true;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deactivateStudent = function(student) {
            var r = confirm("Are you sure you want to de-activate this student?");
            if (r == true) {
                StudentsFactory.reject(student)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Student was deactivated successfully');
                            $scope.getStudents();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.resetPassword = function(student) {
            if (student.PhoneNumber == null || student.PhoneNumber == "") {
                toastr.info('To reset password, please update the Student Contact Number');
            } else {
                var r = confirm("Are you sure you want to reset the password?");
                if (r == true) {
                    var obj = {
                        StudentId: student.Id,
                        PhoneNumber: student.PhoneNumber
                    };
                    StudentsFactory.resetPassword(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.warning('Could not reset student password. Please try later!');
                            } else {
                                toastr.success('Password reset successful. The new password is same as the Student Contact Number!');
                                $scope.getStudents();
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                }
            }
        };

        $scope.updateStudent = function(student) {
            StudentsFactory.selectedStudent = student;
            StudentsFactory.selectedValues = angular.copy($scope.selected);
            StudentsFactory.branchNameForReceipt = $scope.branches.filter(x => x.Id == $scope.selected.branchId)[0].Name;
            $state.go("app.students.addStudent", { flag: 2 });
        };

        $scope.addStudent = function() {
            StudentsFactory.selectedValues = angular.copy($scope.selected);
            $state.go('app.students.addStudent', { flag: 1 });
        };

        $scope.studentDashboard = function(student) {
            StudentsFactory.selectedValues = angular.copy($scope.selected);
            StudentsFactory.selectedStudent = student;
            StudentsFactory.selectedCriteria = $scope.selected;
            $state.go('app.students.studentDashboard');
        };

        $scope.promoteStudents = function(student) {
            var obj = [];
            student.BranchId = $scope.selected.branchId;
            obj.push(student);
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + '/views/templates/PromoteStudentsTemplate.html',
                controller: 'PromoteStudentsController',
                resolve: {
                    students: function() {
                        return obj;
                    },
                    semesters: function() {
                        return $scope.semesters;
                    },
                    keywords: function() {
                        return DashboardFactory.keywords;
                    },
                    branchId: function() {
                        return $scope.selected.branchId;
                    },
                    courseId: function() {
                        return $scope.selected.courseId;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                // $scope.getStudents();
                toastr.success(response);
                FeesStructureFactory.student = student;
                $state.go('app.students.feesCollection');
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.exportToXLS = function() {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('students-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'Students.xls';
            a.click();
        };

        if (LoginFactory.loggedInUser.Role == 'ADMIN') {
            $scope.getTotalFees();
            $scope.getInstallMetrics();
            $scope.getAllCourses();
        }

        if (LoginFactory.loggedInUser.Role == 'FACULTY') {
            $scope.students = SelectClassFactory.Students;
        }

        if (LoginFactory.loggedInUser.Role == 'STAFF') {
            $scope.getAllCourses();
            DashboardFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                }, function(error) {
                    toastr.success(error);
                });
        }

    })
    .controller('PromoteStudentsController', function($scope, students, semesters, keywords, branchId, courseId, $uibModalInstance, toastr, DashboardFactory, LoginFactory, StudentsFactory) {

        $scope.students = students;
        $scope.semesters = semesters;
        $scope.classes = [];
        $scope.keywords = keywords;

        $scope.selected = {
            ClassId: null,
            SemesterId: null
        };

        var obj = {
            StudentIds: [],
            SemesterId: null,
            ClassId: null
        };
        for (var i = 0; i < $scope.students.length; i++) {
            obj.StudentIds.push($scope.students[i].Id);
        };

        $scope.ok = function() {
            obj.SemesterId = $scope.selected.SemesterId;
            obj.ClassId = $scope.selected.ClassId;
            if (obj.SemesterId == null || obj.ClassId == null) {
                toastr.warning('Please choose a semester and a class to promote students!');
            } else {
                console.log(obj);
                StudentsFactory.promoteStudents(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            $uibModalInstance.close('Students promoted Successfully');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.semesterSelected = function(semesterId) {
            DashboardFactory.getAllClasses(branchId, semesterId, LoginFactory.loggedInUser.CollegeId, courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    });