angular.module('app')
    .controller('ActivateStudentsController', function($scope, $state, DashboardFactory, StudentsFactory, LoginFactory, toastr) {

        $scope.students = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        };

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

        $scope.getStudents = function() {
            $scope.students = [];
            StudentsFactory.getDeactivatedStudents(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId, $scope.selected.classId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no students to activate!');
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.activateStudent = function(student) {
            StudentsFactory.branchNameForReceipt = $scope.branches.filter(x => (x.Id == $scope.selected.branchId))[0].Name;
            $state.go('app.students.verifyApplication', { StudentId: student.Id });
        };

        $scope.deleteStudent = function(student) {
            var r = confirm("Confirm Application Fees Collection?");
            if (r == true) {
                StudentsFactory.deleteStudent(student)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.info('There was a problem encountered in the server. Please try later!');
                        } else {
                            toastr.success('Student deleted successfully');
                            $scope.getStudents();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllCourses();
    });