angular.module('app')
    .controller('AssignStudentsToSectionsController', function($scope, toastr, LoginFactory, DashboardFactory, AssignStudentsToSectionsFactory, StudentsFactory) {

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
            $scope.students = [];

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
            $scope.students = [];

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
            $scope.students = [];

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
            $scope.students = [];

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
            $scope.students = [];

            StudentsFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, $scope.selected.branch.Id, $scope.selected.semester.Id, $scope.selected.class.Id)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No students found!');
                    } else {
                        $scope.students = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.changeSection = function() {
            var r = confirm("Are you sure you want to change the " + $scope.keywords.ClassKeyword + "?");
            if (r == true) {
                var selectedStudentIds = [];
                for (var i = 0; i < $scope.students.length; i++) {
                    if ($scope.students[i].isSelected) {
                        selectedStudentIds.push($scope.students[i].Id);
                    }
                }
                var obj = {
                    StudentIds: selectedStudentIds,
                    ClassId: $scope.selected.destination.Id,
                    CollegeId: LoginFactory.loggedInUser.CollegeId
                }
                AssignStudentsToSectionsFactory.changeSection(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Students were transferred successfully');
                            $scope.selected.destination = null;
                            $scope.classSelected();
                        }
                    }, function(error) {
                        toastr.success(error);
                    });
            }
        };

        $scope.getAllCourses();

    });