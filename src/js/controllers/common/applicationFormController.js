angular.module('app')
    .controller('ApplicationFormController', function($scope, toastr, ApplicationFormFactory) {

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
        // #################

        $scope.errorMessage = null;
        $scope.displayApplicationForm = false;
        $scope.form = {
            UniqueId: null
        };
        $scope.enquiry = null;

        $scope.verifyUniqueId = function() {
            if ($scope.form.UniqueId == null || $scope.form.UniqueId == "") {
                $scope.errorMessage = "Please enter the Unique Id provided by the institution";
            } else {
                $scope.errorMessage = null;
                ApplicationFormFactory.verifyUniqueId($scope.form)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            $scope.errorMessage = 'Invalid Unique Id';
                        } else {
                            $scope.form.UniqueId = null;
                            $scope.errorMessage = null;
                            $scope.displayApplicationForm = true;
                            $scope.enquiry = success.data.Data[0];
                            $scope.enquiry.PhoneNumber = parseInt($scope.enquiry.PhoneNumber);
                            $scope.enquiry.FatherPhoneNumber = parseInt($scope.enquiry.PhoneNumber); // taken from add enquiry page
                            $scope.enquiry.MotherPhoneNumber = parseInt($scope.enquiry.MotherPhoneNumber);
                            $scope.initializeNewApplication();
                        }
                    }, function(error) {
                        console.log(error);
                    });
            }
        };


        //  application form code
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
        $scope.initializeNewApplication = function() {
            $scope.newApplication = {
                Id: null,
                EnquiryId: $scope.enquiry.Id,
                CollegeId: $scope.enquiry.CollegeId,
                CourseId: $scope.enquiry.CourseId,
                BranchId: $scope.enquiry.BranchId,
                SemesterId: $scope.enquiry.SemesterId,
                ClassId: $scope.enquiry.ClassId,
                Name: $scope.enquiry.Name,
                GenderId: $scope.enquiry.GenderId,
                DateOfBirth: new Date($scope.enquiry.DateOfBirth),
                AadhaarNumber: null,
                FatherName: $scope.enquiry.FatherName,
                MotherName: $scope.enquiry.MotherName,
                PhoneNumber: $scope.enquiry.PhoneNumber,
                FatherPhoneNumber: $scope.enquiry.FatherPhoneNumber,
                MotherPhoneNumber: $scope.enquiry.MotherPhoneNumber,
                Address: $scope.enquiry.Address,
                Email: $scope.enquiry.Email,
                FatherOccupation: null,
                MotherOccupation: null,
                BloodGroup: null,
                MotherTongue: null,
                SocialCategory: null,
                Nationality: null,
                Religion: null,
                Caste: null,
                SubCaste: null,
                CasteCertificateNumber: null,
                PreviousSchoolName: null,
                PreviousClass: null,
                PreviousMediumOfInstruction: null,
                TransferCertificateNumber: null,
                SATSNumber: null,
                ApplicationFormNumber: $scope.enquiry.UniqueId
            };
        };

        $scope.submitApplication = function() {
            if ($scope.newApplication.Name == "" ||
                $scope.newApplication.FatherPhoneNumber == null ||
                $scope.newApplication.FatherPhoneNumber == undefined ||
                $scope.newApplication.FatherName == "") {
                toastr.warning('Please fill all the required details');
            } else {
                $scope.newApplication.DateOfBirth = moment($scope.newApplication.DateOfBirth).format("YYYY-MM-DD");
                console.log($scope.newApplication);
                ApplicationFormFactory.registerStudent($scope.newApplication)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Something went wrong. Please try later!');
                        } else {
                            toastr.success('Registration was done successfully');
                            $scope.newApplication = {};
                            $scope.displayApplicationForm = false;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

    });