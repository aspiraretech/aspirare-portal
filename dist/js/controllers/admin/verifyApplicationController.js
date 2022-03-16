angular.module('app')
    .controller('VerifyApplicationController', function($scope, $state, $stateParams, toastr, DashboardFactory, LoginFactory, StudentsFactory, FeesStructureFactory) {

        // dropdown values
        $scope.motherTongues = [{
            Name: "Kannada"
        }, {
            Name: "Tamil"
        }, {
            Name: "Telugu"
        }, {
            Name: "Hindi"
        }, {
            Name: "English"
        }, {
            Name: "Urdu"
        }, {
            Name: "Malayalam"
        }];
        $scope.socialCategories = [{
            Name: "General"
        }, {
            Name: "OBC"
        }, {
            Name: "SC"
        }, {
            Name: "ST"
        }];
        $scope.nationalities = [{
            Name: "Indian"
        }];
        $scope.religions = [{
            Name: "Hindu"
        }, {
            Name: "Jain"
        }, {
            Name: "Christian"
        }, {
            Name: "Islam"
        }, {
            Name: "Sikh"
        }];
        $scope.castes = [{
            Name: "Bramhin"
        }, {
            Name: "Jain"
        }];
        $scope.subCastes = [{
            Name: "Bramhin"
        }, {
            Name: "Jain"
        }];
        $scope.bloodGroups = [{
            Name: "A+"
        }, {
            Name: "A-"
        }, {
            Name: "B+"
        }, {
            Name: "B-"
        }, {
            Name: "O+"
        }, {
            Name: "O-"
        }, {
            Name: "AB+"
        }, {
            Name: "AB-"
        }];
        $scope.studentTypes = [{
                Id: 1,
                Name: "New"
            },
            {
                Id: 2,
                Name: "Old"
            }
        ];
        // #################

        $scope.keywords = DashboardFactory.keywords;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.genders = [{
                Id: 1,
                Name: "Male"
            },
            {
                Id: 2,
                Name: "Female"
            }
        ];
        $scope.phoneRegEx = /^\+?\d{10}$/;
        $scope.aadhaarRegEx = /^\+?\d{12}$/;

        $scope.getStudentForApplicationVerification = function() {
            StudentsFactory.getStudentForApplicationVerification($stateParams.StudentId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.newApplication = success.data.Data[0];
                        $scope.newApplication.PhoneNumber = parseInt($scope.newApplication.PhoneNumber);
                        $scope.newApplication.FatherPhoneNumber = parseInt($scope.newApplication.FatherPhoneNumber);
                        $scope.newApplication.MotherPhoneNumber = parseInt($scope.newApplication.MotherPhoneNumber);
                        $scope.newApplication.DateOfBirth = new Date($scope.newApplication.DateOfBirth);
                        $scope.newApplication.StudentType = 1;
                        $scope.newApplication.IsRTE = 0;
                        $scope.getBranches($scope.newApplication.CourseId);
                        $scope.getSemesters($scope.newApplication.BranchId);
                        $scope.getClasses($scope.newApplication.SemesterId);
                    }
                }, function(error) {
                    toastr.error(error);
                })
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
            $scope.newApplication.BranchId = null;
            $scope.newApplication.SemesterId = null;
            $scope.newApplication.ClassId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.newApplication.SemesterId = null;
            $scope.newApplication.ClassId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.newApplication.ClassId = null;
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
                    toastr.error(error);
                });
        };

        $scope.getSemesters = function(branchId) {
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.newApplication.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getClasses = function(semesterId) {
            DashboardFactory.getAllClasses($scope.newApplication.BranchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.newApplication.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.proceed = function() {
            FeesStructureFactory.student = $scope.newApplication;
            $state.go('app.students.feesCollection');
        };

        $scope.updateAndExit = function() {
            if ($scope.newApplication.Name == null ||
                $scope.newApplication.FatherName == null ||
                $scope.newApplication.GenderId == null ||
                $scope.newApplication.SemesterId == null ||
                $scope.newApplication.BranchId == null ||
                $scope.newApplication.ClassId == null ||
                $scope.newApplication.CourseId == null ||
                $scope.newApplication.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newApplication.Payment = []; // update api expects payment array
                StudentsFactory.updateStudent($scope.newApplication)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Updation was done Successfully');
                            $state.go('app.students.viewStudents');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.discard = function() {
            history.back();
        };

        $scope.getAllCourses();
        $scope.getStudentForApplicationVerification();
    });