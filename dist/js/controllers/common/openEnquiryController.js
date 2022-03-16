angular.module('app')
    .controller('OpenEnquiryController', function($scope, $state, $stateParams, EnquiryFactory, DashboardFactory, LoginFactory, toastr) {

        $scope.newEnquiry = {
            Id: null,
            CollegeId: $stateParams.CollegeId,
            EnquirySession: "",
            Name: null,
            GenderId: null,
            CourseId: $stateParams.CourseId,
            BranchId: $stateParams.BranchId,
            SemesterId: 9, //hardcoded to first semester
            DateOfBirth: new Date(),
            FatherName: null,
            MotherName: null,
            PhoneNumber: null,
            MotherPhoneNumber: null,
            FollowUpDate: new Date(),
            UniqueId: null,
            Status: 'ACTIVE',
            Searchterm: null
        };

        $scope.CollegeName = $stateParams.CollegeName;
        $scope.CourseName = $stateParams.CourseName;
        $scope.BranchName = $stateParams.BranchName;

        $scope.dateInput = {
            min: moment(new Date(1990, 0, 1)).format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.dateInput2 = {
            min: moment().add(1, 'days').format('YYYY-MM-DD'),
            max: moment().add(1, 'years').format('YYYY-MM-DD')
        };

        $scope.genders = [];

        $scope.addEnquiry = function() {
            if ($scope.newEnquiry.DateOfBirth == undefined) {
                $scope.newEnquiry.DateOfBirth = new Date();
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
                EnquiryFactory.addEnquiryWithoutToken($scope.newEnquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Your application has been submitted');
                            $scope.newEnquiry = {
                                Id: null,
                                CollegeId: $stateParams.CollegeId,
                                EnquirySession: "",
                                Name: null,
                                GenderId: null,
                                CourseId: $stateParams.CourseId,
                                BranchId: $stateParams.BranchId,
                                SemesterId: 9, //hardcoded to first semester
                                DateOfBirth: new Date(),
                                FatherName: null,
                                MotherName: null,
                                PhoneNumber: null,
                                MotherPhoneNumber: null,
                                FollowUpDate: new Date(),
                                UniqueId: null,
                                Status: 'ACTIVE',
                                Searchterm: null
                            };
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };
    });