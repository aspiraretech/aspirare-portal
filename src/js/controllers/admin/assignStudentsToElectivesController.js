angular.module('app')
    .controller('AssignStudentsToElectivesController', function($scope, toastr, LoginFactory, DashboardFactory, AssignStudentsToElectivesFactory) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.courses = [];
        $scope.studentsInThisSemester = [];
        $scope.studentsInClass = [];
        $scope.selected = {
            course: null,
            branch: null,
            semester: null,
            specialSubject: null,
            specialClass: null
        };
        $scope.uniqueBranches = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.specialClasses = [];
            $scope.specialSubjects = [];
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []

            $scope.selected.course = null;
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.selected.specialClass = null;
            $scope.selected.specialSubject = null;

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
            $scope.specialClasses = [];
            $scope.specialSubjects = [];
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.selected.specialClass = null;
            $scope.selected.specialSubject = null;

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
            $scope.specialClasses = [];
            $scope.specialSubjects = [];
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []
            $scope.selected.semester = null;
            $scope.selected.specialClass = null;
            $scope.selected.specialSubject = null;
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
            $scope.specialClasses = [];
            $scope.specialSubjects = [];
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []
            $scope.selected.specialClass = null;
            $scope.selected.specialSubject = null;
            DashboardFactory.getAllSpecialSubjects(LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, semester.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no special subjects in this selection');
                    } else {
                        $scope.specialSubjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.specialSubjectSelected = function(specialSubject) {
            $scope.specialClasses = [];
            $scope.selected.specialClass = null;
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []
            DashboardFactory.getAllSpecialClasses(specialSubject.Id, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no special subjects in this selection');
                    } else {
                        $scope.specialClasses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.specialClassSelected = function() {
            $scope.studentsInThisSemester = [];
            $scope.studentsInClass = []
            AssignStudentsToElectivesFactory.getAllStudentsInCourseAndSem(LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, $scope.selected.semester.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no students in this semester!');
                    } else {
                        $scope.studentsInThisSemester = success.data.Data;
                        AssignStudentsToElectivesFactory.getAllStudentsInSpecialClass($scope.selected.specialClass.Id)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.info('There are no students in this semester!');
                                } else {
                                    $scope.studentsInClass = success.data.Data;
                                    for (var i = 0; i < $scope.studentsInThisSemester.length; i++) {
                                        for (var j = 0; j < $scope.studentsInClass.length; j++) {
                                            if ($scope.studentsInThisSemester[i].Id == $scope.studentsInClass[j].Id) {
                                                $scope.studentsInThisSemester[i].isSelected = "true";
                                            }
                                        }
                                    }
                                    $scope.formatStudentsByBranch();
                                }
                            }, function(error) {
                                toastr.error(error);
                            });
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.studentSelectionChanged = function(student) {
            var obj = {
                Student: {
                    Id: student.Id,
                    ClassId: student.ClassId,
                    BranchId: student.BranchId
                },
                SpecialSubjectId: $scope.selected.specialSubject.Id,
                SpecialClassId: $scope.selected.specialClass.Id
            };
            if (student.isSelected == 'true') {
                AssignStudentsToElectivesFactory.assignStudentsToElectives(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Student successfully assigned to this class');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                AssignStudentsToElectivesFactory.unAssignStudent(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.info('Could not un-assign student. Please try later!');
                        } else {
                            toastr.success('Student un-assigned from class');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.formatStudentsByBranch = function() {
            for (var i = 0; i < $scope.branches.length; i++) {
                $scope.branches[i].Students = [];
                for (var j = 0; j < $scope.studentsInThisSemester.length; j++) {
                    if ($scope.branches[i].Id == $scope.studentsInThisSemester[j].BranchId) {
                        $scope.branches[i].Students.push($scope.studentsInThisSemester[j]);
                    }
                }
            }
            $scope.chunkedBranches = chunk($scope.branches, 5);
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