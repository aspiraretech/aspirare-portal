angular.module('app')
    .controller('AddEnquiryController', function($scope, $state, $stateParams, EnquiryFactory, DashboardFactory, LoginFactory, toastr) {

        $scope.isEdit = parseInt($stateParams.isEdit);
        $scope.newEnquiry = {
            Id: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            EnquirySession: "",
            Name: null,
            GenderId: null,
            CourseId: null,
            BranchId: null,
            SemesterId: null,
            DateOfBirth: new Date(),
            FatherName: null,
            MotherName: null,
            PhoneNumber: null,
            MotherPhoneNumber: null,
            FollowUpDate: new Date(),
            UniqueId: null,
            Status: 'ACTIVE',
            Searchterm: null,
            CollegeName: LoginFactory.loggedInUser.Nickname,
            CollegePhone: LoginFactory.loggedInUser.CollegePhone
        };

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.dateInput = {
            min: moment(new Date(1990, 0, 1)).format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.dateInput2 = {
            min: moment().add(1, 'days').format('YYYY-MM-DD'),
            max: moment().add(1, 'years').format('YYYY-MM-DD')
        };

        $scope.genders = [];
        $scope.courses = [];
        $scope.branches = [];
        $scope.keywords = DashboardFactory.keywords;

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.newEnquiry.CourseId = null;
            $scope.newEnquiry.BranchId = null;
            $scope.newEnquiry.SemesterId = null;
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.courses = success.data.Data;
                        if ($scope.isEdit) {
                            $scope.getBranches(EnquiryFactory.selectedEnquiry.CourseId);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.newEnquiry.BranchId = null;
            $scope.newEnquiry.SemesterId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.newEnquiry.SemesterId = null;
            $scope.getSemesters(branchId);
        };

        $scope.getBranches = function(courseId) {
            DashboardFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.branches = success.data.Data;
                        if ($scope.isEdit) {
                            $scope.getSemesters($scope.newEnquiry.BranchId);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getSemesters = function(branchId) {
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.newEnquiry.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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

        $scope.addEnquiry = function() {
            if ($scope.newEnquiry.DateOfBirth == undefined) {
                $scope.newEnquiry.DateOfBirth = new Date();
            }
            if ($scope.newEnquiry.FollowUpDate == undefined) {
                $scope.newEnquiry.FollowUpDate = new Date();
            }
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                // $scope.newEnquiry.UniqueId = $scope.getUniqueId();
                EnquiryFactory.addEnquiry($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Enquiry was added Successfully');
                            history.back();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateEnquiry = function() {
            if ($scope.newEnquiry.DateOfBirth == undefined) {
                $scope.newEnquiry.DateOfBirth = new Date();
            }
            if ($scope.newEnquiry.FollowUpDate == undefined) {
                $scope.newEnquiry.FollowUpDate = new Date();
            }
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                EnquiryFactory.updateEnquiry($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem with the server!');
                        } else {
                            toastr.success('Enquiry was updated successfully');
                            $state.go('app.students.enquiry');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateAndAdmitEnquiry = function() {
            if ($scope.newEnquiry.DateOfBirth == undefined) {
                $scope.newEnquiry.DateOfBirth = new Date();
            }
            if ($scope.newEnquiry.FollowUpDate == undefined) {
                $scope.newEnquiry.FollowUpDate = new Date();
            }
            if ($scope.newEnquiry.Name == null ||
                $scope.newEnquiry.PhoneNumber == null ||
                $scope.newEnquiry.FatherName == null ||
                $scope.newEnquiry.GenderId == null ||
                $scope.newEnquiry.CourseId == null ||
                $scope.newEnquiry.BranchId == null ||
                $scope.newEnquiry.DateOfBirth == null ||
                $scope.newEnquiry.Name == "" ||
                $scope.newEnquiry.PhoneNumber == undefined ||
                $scope.newEnquiry.FatherName == "" ||
                $scope.newEnquiry.DateOfBirth == ""
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newEnquiry.DateOfBirth = moment($scope.newEnquiry.DateOfBirth).format("YYYY-MM-DD");
                EnquiryFactory.updateEnquiry($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem with the server!');
                        } else {
                            toastr.success('Enquiry was updated successfully');
                            // admit student page
                            EnquiryFactory.selectedEnquiry = $scope.newEnquiry;
                            $state.go("app.students.addStudent", { flag: 3 });
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.discardEnquiry = function() {
            history.back();
        };

        $scope.calculateAge = function() {
            var a = moment();
            var b = moment($scope.newEnquiry.DateOfBirth);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            $scope.age = {
                Years: years,
                Months: months,
                Days: days
            };
        };

        $scope.calculateAgeAsOfJune = function() {
            var dateObj = new Date();
            dateObj.setDate(1);
            dateObj.setMonth(5);
            var a = moment(dateObj);
            var b = moment($scope.newEnquiry.DateOfBirth);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            $scope.ageAsOfJune = {
                Years: years,
                Months: months,
                Days: days
            };
        };

        $scope.$watch('newEnquiry.DateOfBirth', function(newVal, oldVal) {
            $scope.calculateAge();
            $scope.calculateAgeAsOfJune();
        });

        $scope.getAllCourses();
        $scope.calculateAge();
        $scope.calculateAgeAsOfJune();

        if ($scope.isEdit) {
            EnquiryFactory.getEnquiryById(EnquiryFactory.selectedEnquiry.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.newEnquiry = success.data.Data;
                        $scope.newEnquiry.PhoneNumber = parseInt($scope.newEnquiry.PhoneNumber);
                        $scope.newEnquiry.MotherPhoneNumber = parseInt($scope.newEnquiry.MotherPhoneNumber);
                        $scope.newEnquiry.DateOfBirth = new Date($scope.newEnquiry.DateOfBirth);
                        $scope.newEnquiry.FollowUpDate = new Date($scope.newEnquiry.FollowUpDate);
                        $scope.newEnquiry.GenderId = $scope.newEnquiry.GenderId.toString();
                        $scope.calculateAge();
                        $scope.calculateAgeAsOfJune();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        }

        $scope.getUniqueId = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
    });