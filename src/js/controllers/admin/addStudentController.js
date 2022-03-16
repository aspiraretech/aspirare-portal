angular.module('app')
    .controller('AddStudentController', function($scope, $state, $stateParams, LoginFactory, FeesStructureFactory, DashboardFactory, toastr, StudentsFactory, EnquiryFactory) {

        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.feesKeywords = DashboardFactory.feesKeywords;
        $scope.feesComponentValues = [
            $scope.feesKeywords.RegularComponent1,
            $scope.feesKeywords.RegularComponent2,
            $scope.feesKeywords.RegularComponent3,
            $scope.feesKeywords.RegularComponent4,
            $scope.feesKeywords.RegularComponent5,
            $scope.feesKeywords.RegularComponent6,
            $scope.feesKeywords.RegularComponent7,
            $scope.feesKeywords.RegularComponent8,
            $scope.feesKeywords.RegularComponent9,
            $scope.feesKeywords.RegularComponent10,
            $scope.feesKeywords.RegularComponent11,
        ]
        $scope.showApplicationFeesButton = false;
        $scope.selected = {
            receiptType: "",
            academicYear: ""
        };
        // dropdown values
        $scope.receiptTypes = [{
            Type: "All",
            SearchTerm: ""
        }, {
            Type: "Tuition Fees",
            SearchTerm: "Type1"
        }, {
            Type: "Transport Fees",
            SearchTerm: "Type3"
        }, {
            Type: $scope.loggedInUser.Type == 'LM' ? "Annual Fees" : "Development Fees",
            SearchTerm: "Type4"
        }, {
            Type: "Application Form Fees",
            SearchTerm: "Type5"
        }];
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
        }, {
            Name: "Marathi"
        }, {
            Name: "Bengali"
        }, {
            Name: "Odia"
        }, {
            Name: "Nishi"
        }, {
            Name: "Konkani"
        }, {
            Name: "Gujarati"
        }, {
            Name: "Assamese"
        }, {
            Name: "Nishi"
        }, {
            Name: "Manipuri"
        }, {
            Name: "Punjabi"
        }, {
            Name: "Mizo"
        }, {
            Name: "Others"
        }];
        $scope.socialCategories = [{
            Name: "General"
        }, {
            Name: "OBC"
        }, {
            Name: "SC"
        }, {
            Name: "ST"
        }, {
            Name: "Others"
        }];
        $scope.nationalities = [{
            Name: "Indian"
        }, {
            Name: "Others"
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
        }, {
            Name: "Others"
        }];
        $scope.castes = [{
            Name: "Bramhin"
        }, {
            Name: "Jain"
        }, {
            Name: "Others"
        }];
        $scope.subCastes = [{
            Name: "Bramhin"
        }, {
            Name: "Jain"
        }, {
            Name: "Others"
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
        $scope.newPreviousMarks = {
            Id: null,
            StudentId: null,
            UniversityName: null,
            MaxMarks: null,
            MarksObtained: null,
            CreatedAt: moment().format('YYYY-MM-DD'),
            UpdatedAt: moment().format('YYYY-MM-DD')
        };
        $scope.previousMarks = [];
        $scope.years = [{
            year: moment().subtract(1, 'years').year() + "-" + moment().year()
        }, {
            year: moment().year() + "-" + moment().add(1, 'years').year()
        }];
        if (new Date().getMonth() <= 3) {
            $scope.selected.academicYear = $scope.years[0].year;
        } else {
            $scope.selected.academicYear = $scope.years[1].year;
        }
        // #################

        $scope.isEdit = ($stateParams.flag == 2);
        if ($stateParams.flag == 1) {
            $scope.student = null;
        } else if ($stateParams.flag == 3) {
            $scope.enquiry = angular.copy(EnquiryFactory.selectedEnquiry);
            EnquiryFactory.selectedEnquiry = null;
        } else {
            $scope.student = angular.copy(StudentsFactory.selectedStudent);
            $scope.studentToVerify = angular.copy(StudentsFactory.selectedStudent);
            StudentsFactory.selectedStudent = null;
        }
        $scope.keywords = DashboardFactory.keywords;
        $scope.documents = [];
        $scope.selectedDocuments = [];
        $scope.genders = [{
                Id: 1,
                Name: "Male"
            },
            {
                Id: 2,
                Name: "Female"
            }
        ];
        $scope.studentTypes = [{
                Id: 1,
                Name: "New"
            },
            {
                Id: 2,
                Name: "Old"
            }
        ];
        $scope.dateInput = {
            min: moment().subtract(30, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.newAdmission = {
            Id: null,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Name: null,
            GenderId: null,
            CourseId: null,
            SemesterId: null,
            BranchId: null,
            ClassId: null,
            DateOfBirth: new Date(),
            AadhaarNumber: null,
            FatherName: null,
            FatherOccupation: null,
            MotherName: null,
            MotherOccupation: null,
            FatherPhoneNumber: null,
            MotherPhoneNumber: null,
            PhoneNumber: null,
            Email: null,
            Address: null,
            TotalFees: 0,
            Remarks: null,
            BloodGroup: null,
            EnquiryId: null,
            MotherTongue: null,
            SocialCategory: null,
            Nationality: "Indian",
            Caste: null,
            SubCaste: null,
            CasteCertificateNumber: null,
            PreviousSchoolName: null,
            PreviousClass: null,
            PreviousMediumOfInstruction: null,
            TransferCertificateNumber: null,
            SATSNumber: null,
            ApplicationFormNumber: null,
            StudentType: 1,
            IsRTE: 0,
            Payment: []
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.courses = success.data.Data;
                        if ($stateParams.flag == 2) {
                            StudentsFactory.getStudentForApplicationVerification($scope.student.Id) // this api gets all the fields in admission. getstudentbyid gets old form values
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error(success.data.Message);
                                    } else {
                                        $scope.newAdmission = success.data.Data[0];
                                        $scope.newAdmission.PhoneNumber = parseInt($scope.newAdmission.PhoneNumber);
                                        $scope.newAdmission.FatherPhoneNumber = parseInt($scope.newAdmission.FatherPhoneNumber);
                                        $scope.newAdmission.MotherPhoneNumber = parseInt($scope.newAdmission.MotherPhoneNumber);
                                        $scope.newAdmission.AadhaarNumber = parseInt($scope.newAdmission.AadhaarNumber);
                                        $scope.newAdmission.DateOfBirth = new Date($scope.newAdmission.DateOfBirth);
                                        $scope.getBranches($scope.newAdmission.CourseId);
                                        $scope.getSemesters($scope.newAdmission.BranchId);
                                        $scope.getClasses($scope.newAdmission.SemesterId);
                                        $scope.newPreviousMarks.StudentId = $scope.newAdmission.Id;
                                        $scope.getAllPreviousMarks($scope.newPreviousMarks.StudentId);
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                })
                        }
                        if ($stateParams.flag == 3) {
                            StudentsFactory.getEnquiryDetails($scope.enquiry.Id)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.error(success.data.Message);
                                    } else {
                                        $scope.newAdmission = success.data.Data;
                                        $scope.newAdmission.Id = null;
                                        $scope.newAdmission.Payment = [];
                                        $scope.newAdmission.PhoneNumber = parseInt(success.data.Data.PhoneNumber);
                                        $scope.newAdmission.FatherPhoneNumber = parseInt(success.data.Data.PhoneNumber);
                                        $scope.newAdmission.MotherPhoneNumber = parseInt(success.data.Data.MotherPhoneNumber);
                                        $scope.newAdmission.FatherName = success.data.Data.FatherName;
                                        $scope.newAdmission.MotherName = success.data.Data.MotherName;
                                        $scope.newAdmission.TotalFees = 0;
                                        $scope.newAdmission.DateOfBirth = new Date($scope.newAdmission.DateOfBirth);
                                        $scope.newAdmission.EnquiryId = $scope.enquiry.Id;
                                        $scope.newAdmission.StudentType = 1;
                                        $scope.newAdmission.IsRTE = 0;
                                        $scope.newAdmission.ApplicationFormNumber = $scope.enquiry.UniqueId;
                                        $scope.getBranches($scope.newAdmission.CourseId);
                                        $scope.getSemesters($scope.newAdmission.BranchId);
                                        $scope.getClasses($scope.newAdmission.SemesterId);
                                    }
                                }, function(error) {
                                    toastr.error(error);
                                })
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
            $scope.newAdmission.BranchId = null;
            $scope.newAdmission.SemesterId = null;
            $scope.newAdmission.ClassId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.newAdmission.SemesterId = null;
            $scope.newAdmission.ClassId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.newAdmission.ClassId = null;
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
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.newAdmission.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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
            DashboardFactory.getAllClasses($scope.newAdmission.BranchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.newAdmission.CourseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
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

        $scope.addStudent = function() {
            $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                console.log($scope.newAdmission);
                FeesStructureFactory.student = angular.copy($scope.newAdmission);
                $state.go('app.students.feesCollection');
            }
        };


        $scope.addStudentAndGoBack = function() {
            $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                StudentsFactory.admitStudent($scope.newAdmission)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Admission was done Successfully');
                            $state.go('app.students.viewStudents');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateStudent = function() {
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newAdmission.Payment = []; // update api expects payment array
                $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
                StudentsFactory.updateStudent($scope.newAdmission)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Updation was done Successfully');
                            FeesStructureFactory.student = $scope.newAdmission;
                            FeesStructureFactory.academicYear = $scope.selected.academicYear;
                            if ($scope.newAdmission.BranchId != $scope.studentToVerify.BranchId) {
                                $state.go("app.students.feesCollection");
                            } else {
                                if ($scope.receipts.length != 0) {
                                    FeesStructureFactory.student.BranchId = $scope.receipts[0].BranchId;
                                    $state.go("app.students.updateFees");
                                } else {
                                    $state.go("app.students.feesCollection");
                                }
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.updateAndGoBack = function() {
            if ($scope.newAdmission.Name == null ||
                $scope.newAdmission.FatherName == null ||
                $scope.newAdmission.GenderId == null ||
                $scope.newAdmission.SemesterId == null ||
                $scope.newAdmission.BranchId == null ||
                $scope.newAdmission.ClassId == null ||
                $scope.newAdmission.CourseId == null ||
                $scope.newAdmission.DateOfBirth == null
            ) {
                toastr.warning('Please add all the required information in this form');
            } else {
                $scope.newAdmission.Payment = []; // update api expects payment array
                $scope.newAdmission.DateOfBirth = moment($scope.newAdmission.DateOfBirth).format("YYYY-MM-DD");
                StudentsFactory.updateStudent($scope.newAdmission)
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

        $scope.clearAllFields = function() {
            $scope.newAdmission = {
                Id: null,
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                Name: null,
                GenderId: null,
                CourseId: null,
                SemesterId: null,
                BranchId: null,
                ClassId: null,
                DateOfBirth: new Date(),
                AadhaarNumber: null,
                FatherName: null,
                FatherOccupation: null,
                MotherName: null,
                MotherOccupation: null,
                FatherPhoneNumber: null,
                MotherPhoneNumber: null,
                PhoneNumber: null,
                Email: null,
                Address: null,
                TotalFees: 0,
                Remarks: null,
                BloodGroup: null,
                EnquiryId: null,
                MotherTongue: null,
                SocialCategory: null,
                Nationality: "Indian",
                Caste: null,
                SubCaste: null,
                CasteCertificateNumber: null,
                PreviousSchoolName: null,
                PreviousClass: null,
                PreviousMediumOfInstruction: null,
                TransferCertificateNumber: null,
                SATSNumber: null,
                StudentType: 1,
                Payment: []
            };
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
        };

        $scope.discardAdmission = function() {
            $state.go('app.students.viewStudents');
        };

        $scope.getAllDocumentsForCollege = function() {
            StudentsFactory.getDocumentsForCollege(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning("There are no documents to collect!");
                    } else {
                        $scope.documents = success.data.Data;
                        $scope.getAllDocumentsForStudent();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllDocumentsForStudent = function() {
            StudentsFactory.getDocumentsForStudent($scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning("There are no documents submitted by this student!");
                    } else {
                        $scope.selectedDocuments = success.data.Data;
                        for (var i = 0; i < $scope.documents.length; i++) {
                            for (var j = 0; j < $scope.selectedDocuments.length; j++) {
                                if ($scope.documents[i].Id == $scope.selectedDocuments[j].Id) {
                                    $scope.documents[i].isChecked = true;
                                }
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllReceiptsForStudent = function() {
            $scope.receipts = [];
            $scope.receiptsToShow = [];
            $scope.showApplicationFeesButton = false;
            StudentsFactory.getAllReceiptsForStudent($scope.student.Id, $scope.selected.academicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning("There are no receipts for this student!");
                    } else {
                        $scope.receipts = success.data.Data;
                        $scope.receiptsToShow = angular.copy($scope.receipts);
                        $scope.totalInvoiceValue = $scope.receipts.reduce(function(prev, cur) { return prev + cur.InvoiceValue }, 0);
                        var applicationFees = $scope.receipts.filter(x => x.FeesType == "Type5");
                        if (applicationFees.length == 0) {
                            $scope.showApplicationFeesButton = true;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.documentChecked = function(document) {
            var obj = {
                StudentId: $scope.student.Id,
                DocumentId: document.Id,
                Type: document.isChecked ? 1 : 0
            }
            StudentsFactory.addDocumentForStudent(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success("Document added successfully");
                        $scope.getAllDocumentsForStudent();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.printReceipt = function(receipt) {
            if (receipt.FeesType == 'Type1') {
                $scope.getFeesStructure(receipt);
            } else if (receipt.FeesType == 'Type4') {
                $scope.printDevelopmentReceipt(receipt);
            } else if (receipt.FeesType == 'Type3') {
                $scope.printTransportReceipt(receipt);
            } else if (receipt.FeesType == 'Type5') {
                $scope.printApplicationFormReceipt(receipt);
            }
        };

        $scope.getFeesStructure = function(receipt) {
            var yearReceived = parseInt(moment().year());
            var today1 = new Date();
            var today2 = new Date();
            if (today1.getMonth() <= 6) {
                today1.setYear(yearReceived - 1);
                today2.setYear(yearReceived);
            } else {
                today1.setYear(yearReceived);
                today2.setYear(yearReceived + 1);
            }
            today1.setMonth(6);
            today2.setMonth(7);
            today1.setDate(1);
            today2.setDate(31);
            var startYear = moment(today1).format("YYYY-MM-DD");
            var endYear = moment(today2).format("YYYY-MM-DD");
            // let academicYear = moment(startYear).year() + '-' + moment(endYear).year();
            let academicYear = $scope.selected.academicYear;
            FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, $scope.newAdmission.BranchId, academicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set yet!');
                    } else {
                        $scope.feesStructure = success.data.Data[0];
                        $scope.regularFeesComponents = pickRegularComponents($scope.feesStructure);
                        $scope.componentsToPrint = [];
                        var keys = Object.keys($scope.regularFeesComponents);
                        var values = Object.values($scope.regularFeesComponents);
                        for (var i = 0; i < values.length; i++) {
                            if (values[i] != 0) {
                                $scope.componentsToPrint.push($scope.feesComponentValues[i]);
                            }
                        }
                        $scope.printTuitionReceipt(receipt);
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        var pickRegularComponents = function(feesStructure) {
            return {
                RegularComponent1: feesStructure.RegularComponent1,
                RegularComponent2: feesStructure.RegularComponent2,
                RegularComponent3: feesStructure.RegularComponent3,
                RegularComponent4: feesStructure.RegularComponent4,
                RegularComponent5: feesStructure.RegularComponent5,
                RegularComponent6: feesStructure.RegularComponent6,
                RegularComponent7: feesStructure.RegularComponent7,
                RegularComponent8: feesStructure.RegularComponent8,
                RegularComponent9: feesStructure.RegularComponent9,
                RegularComponent10: feesStructure.RegularComponent10,
                RegularComponent11: feesStructure.RegularComponent11,
            }
        };

        $scope.printTuitionReceipt = function(receipt) {
            var name = $scope.newAdmission.Name;
            var today = moment(receipt.PaymentDate).format('DD/MM/YYYY');
            var branchName = $scope.branches.filter(x => x.Id == $scope.newAdmission.BranchId)[0].Name;
            var academicYear = receipt.AcademicYear;
            var receiptNumber = receipt.Id;
            var monthNames = receipt.Months;
            var invoiceValue = receipt.InvoiceValue;
            var totalAmount = receipt.InvoiceValue - receipt.Discount;
            var discount = receipt.Discount;
            var amountInNumbers = totalAmount;
            var paymentMode = receipt.PaymentType;
            var amountInWords = amount_in_words(totalAmount) + "Only";
            var tuitionFees = monthNames.length == 0 ? 0 : ($scope.feesStructure.TuitionFees * monthNames.split(",").length);
            var otherComponentsFees = invoiceValue - tuitionFees;
            var feesComponents = $scope.componentsToPrint.join(", ");
            var place = LoginFactory.loggedInUser.Address;

            var docDefinition = {
                content: [{
                        style: ['fontSize1', 'initialMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Name: ' + name,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Receipt No: ' + receiptNumber,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    text: 'Standard: ' + branchName,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Date: ' + today,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    colSpan: 2,
                                    text: 'Academic Year: ' + academicYear,
                                    border: [false, false, false, false]

                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [175, 175, 100],
                            body: [
                                [{
                                    text: 'Particulars',
                                    colSpan: 2,
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }, {}, {
                                    text: 'Amount (IN Rs.)',
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }],
                                [{
                                    stack: [{
                                        text: 'TUITION FEE for the months of\n',
                                        style: 'fontSize2'

                                    }, {
                                        text: '(' + monthNames + ')',
                                        style: 'fontSize3'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    border: [true, true, true, false]

                                }, {}, {
                                    text: tuitionFees,
                                    style: ['fontSize2', 'margins'],
                                    alignment: 'right',
                                    border: [true, true, true, false]
                                }],
                                [{
                                    stack: [{
                                        text: feesComponents,
                                        style: 'fontSize2'
                                    }],
                                    margin: [5, 0, 5, 5],
                                    colSpan: 2,
                                    border: [true, false, true, true]

                                }, {}, {
                                    text: otherComponentsFees,
                                    style: ['fontSize2'],
                                    alignment: 'right',
                                    margin: [5, 0, 5, 5],
                                    border: [true, false, true, true]
                                }],
                                [{
                                    stack: [{
                                        text: 'Waived Off: Rs.' + discount,
                                        style: ['fontSize2', 'margins'],
                                        alignment: 'center'
                                    }]

                                }, {
                                    text: 'Total',
                                    style: ['fontSize2', 'margins'],
                                    alignment: 'right'

                                }, {
                                    text: invoiceValue,
                                    style: ['fontSize2', 'margins'],
                                    alignment: 'right'
                                }],
                                [{
                                    stack: [{
                                        text: 'Grand Total',
                                        style: 'biggerFont'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    alignment: 'right',
                                    bold: true

                                }, {}, {
                                    text: amountInNumbers,
                                    style: ['biggerFont', 'margins'],
                                    alignment: 'right',
                                    bold: true
                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Payment Mode: ' + paymentMode,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Rupees (In Words): ' + amountInWords,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Place: ' + place,
                                    border: [false, false, false, false]
                                }, {
                                    text: 'Cashier',
                                    border: [false, false, false, false],
                                    alignment: 'center'
                                }]
                            ]
                        }
                    }
                ],
                styles: {
                    biggerFont: {
                        fontSize: 13
                    },
                    fontSize1: {
                        fontSize: 11
                    },
                    fontSize2: {
                        fontSize: 10
                    },
                    fontSize3: {
                        fontSize: 9
                    },
                    margins: {
                        margin: [5, 5, 5, 5]
                    },
                    topMargin: {
                        margin: [20, 10, 0, 0]
                    },
                    initialMargin: {
                        margin: [20, 70, 0, 0]
                    }
                }
            };
            if (monthNames.length == 0) {
                docDefinition.content[1].table.body.splice(1, 1);
                docDefinition.content[1].table.body[1][0].margin[1] = 5;
            }
            if (otherComponentsFees == 0) {
                docDefinition.content[1].table.body.splice(2, 1);
            }
            pdfMake.createPdf(docDefinition).open();
        };

        $scope.printDevelopmentReceipt = function(receipt) {
            var name = $scope.newAdmission.Name;
            var branchName = $scope.branches.filter(x => x.Id == $scope.newAdmission.BranchId)[0].Name;
            var receiptNumber = receipt.Id;
            var fatherName = $scope.newAdmission.FatherName;
            var academicYear = receipt.AcademicYear;
            var paymentMode = receipt.PaymentType;
            var today = moment(receipt.PaymentDate).format('DD/MM/YYYY');
            var amountInNumbers = receipt.InvoiceValue;
            var amountInWords = amount_in_words(amountInNumbers);
            var place = LoginFactory.loggedInUser.Address;
            var docDefinition = {
                content: [{
                        style: ['fontSize1', 'initialMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Name: ' + name,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Receipt No: ' + receiptNumber,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    text: 'Standard: ' + branchName,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Date: ' + today,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'contentMargin'],
                        text: [{
                            text: 'Received with thanks from ' + fatherName.toUpperCase() + ', a sum of '
                        }, {
                            text: amountInWords,
                            bold: true

                        }, {
                            text: ' Rupees Only towards the Annual Development Fees for the Academic Year ' + academicYear + '.'

                        }]
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Payment Mode: ' + paymentMode,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: [{
                                        text: 'Amount: '
                                    }, {
                                        text: 'Rs.' + amountInNumbers,
                                        bold: true
                                    }],
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Place: ' + place,
                                    border: [false, false, false, false]
                                }, {
                                    text: 'Cashier',
                                    border: [false, false, false, false],
                                    alignment: 'center'
                                }]
                            ]
                        }
                    }
                ],
                styles: {
                    fontSize1: {
                        fontSize: 10
                    },
                    topMargin: {
                        margin: [20, 20, 0, 0]
                    },
                    contentMargin: {
                        margin: [25, 20, 0, 0]
                    },
                    initialMargin: {
                        margin: [20, 70, 0, 0]
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
        };

        $scope.printTransportReceipt = function(receipt) {
            var name = $scope.newAdmission.Name;
            var today = moment(receipt.PaymentDate).format('DD/MM/YYYY');
            var branchName = $scope.branches.filter(x => x.Id == $scope.newAdmission.BranchId)[0].Name;
            var academicYear = receipt.AcademicYear;
            var receiptNumber = receipt.Id;
            var monthNames = receipt.Months;
            var totalAmount = receipt.InvoiceValue;
            var amountInNumbers = totalAmount;
            var paymentMode = receipt.PaymentType;
            var amountInWords = amount_in_words(totalAmount) + "Only";
            var place = LoginFactory.loggedInUser.Address;
            var docDefinition = {
                content: [{
                        style: ['fontSize1', 'initialMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Name: ' + name,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Receipt No: ' + receiptNumber,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    text: 'Standard: ' + branchName,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Date: ' + today,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    colSpan: 2,
                                    text: 'Academic Year: ' + academicYear,
                                    border: [false, false, false, false]

                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [250, 100, 100],
                            body: [
                                [{
                                    text: 'Particulars',
                                    colSpan: 2,
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }, {}, {
                                    text: 'Amount (IN Rs.)',
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }],
                                [{
                                    stack: [{
                                        text: 'Bus Fees for the months of\n',
                                        style: 'fontSize2'

                                    }, {
                                        text: '(' + monthNames + ')',
                                        style: 'fontSize3'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    border: [true, true, true, false]

                                }, {}, {
                                    text: amountInNumbers,
                                    style: ['fontSize2', 'margins'],
                                    alignment: 'right',
                                    border: [true, true, true, false]
                                }],
                                [{
                                    stack: [{
                                        text: 'Grand Total',
                                        style: 'biggerFont'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    alignment: 'right',
                                    bold: true

                                }, {}, {
                                    text: amountInNumbers,
                                    style: ['biggerFont', 'margins'],
                                    alignment: 'right',
                                    bold: true
                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Payment Mode: ' + paymentMode,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Rupees (In Words): ' + amountInWords,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Place: ' + place,
                                    border: [false, false, false, false]
                                }, {
                                    text: 'Cashier',
                                    border: [false, false, false, false],
                                    alignment: 'center'
                                }]
                            ]
                        }
                    }
                ],
                styles: {
                    biggerFont: {
                        fontSize: 13
                    },
                    fontSize1: {
                        fontSize: 11
                    },
                    fontSize2: {
                        fontSize: 10
                    },
                    fontSize3: {
                        fontSize: 9
                    },
                    margins: {
                        margin: [5, 5, 5, 5]
                    },
                    topMargin: {
                        margin: [20, 10, 0, 0]
                    },
                    initialMargin: {
                        margin: [20, 70, 0, 0]
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
        };

        $scope.printApplicationFormReceipt = function(receipt) {
            var name = $scope.newAdmission.Name;
            var applicationFormNumber = $scope.newAdmission.ApplicationFormNumber;
            var receiptNumber = receipt.Id;
            var today = moment(receipt.PaymentDate).format('DD/MM/YYYY');
            var amountInNumbers = receipt.InvoiceValue;
            var amountInWords = amount_in_words(amountInNumbers);
            var branchName = $scope.branches.filter(x => x.Id == $scope.newAdmission.BranchId)[0].Name;
            var paymentMode = receipt.PaymentType;
            var place = LoginFactory.loggedInUser.Address;

            var docDefinition = {
                content: [{
                        style: ['fontSize1', 'initialMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Name: ' + name,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Receipt No: ' + receiptNumber,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }],
                                [{
                                    text: 'Application Form No: ' + applicationFormNumber,
                                    border: [false, false, false, false]

                                }, {
                                    text: 'Date: ' + today,
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [250, 100, 100],
                            body: [
                                [{
                                    text: 'Particulars',
                                    colSpan: 2,
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }, {}, {
                                    text: 'Amount (IN Rs.)',
                                    alignment: 'center',
                                    bold: true,
                                    style: 'margins'

                                }],
                                [{
                                    stack: [{
                                        text: 'Application Fees for ' + branchName,
                                        style: 'fontSize2'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    border: [true, true, true, false]

                                }, {}, {
                                    text: amountInNumbers,
                                    style: ['fontSize2', 'margins'],
                                    alignment: 'right',
                                    border: [true, true, true, false]
                                }],
                                [{
                                    stack: [{
                                        text: 'Grand Total',
                                        style: 'biggerFont'

                                    }],
                                    style: 'margins',
                                    colSpan: 2,
                                    alignment: 'right',
                                    bold: true

                                }, {}, {
                                    text: amountInNumbers,
                                    style: ['biggerFont', 'margins'],
                                    alignment: 'right',
                                    bold: true
                                }]
                            ]
                        }
                    },
                    {
                        style: ['fontSize1', 'topMargin'],
                        table: {
                            widths: [350, 100],
                            body: [
                                [{
                                    text: 'Payment Mode: ' + paymentMode,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Rupees (In Words): ' + amountInWords,
                                    border: [false, false, false, false]
                                }, {
                                    text: '',
                                    border: [false, false, false, false]
                                }],
                                [{
                                    text: 'Place: ' + place,
                                    border: [false, false, false, false]
                                }, {
                                    text: 'Cashier',
                                    border: [false, false, false, false],
                                    alignment: 'center'
                                }]
                            ]
                        }
                    }
                ],
                styles: {
                    biggerFont: {
                        fontSize: 13
                    },
                    fontSize1: {
                        fontSize: 11
                    },
                    fontSize2: {
                        fontSize: 10
                    },
                    fontSize3: {
                        fontSize: 9
                    },
                    margins: {
                        margin: [5, 5, 5, 5]
                    },
                    topMargin: {
                        margin: [20, 10, 0, 0]
                    },
                    initialMargin: {
                        margin: [20, 70, 0, 0]
                    }
                }
            };
            pdfMake.createPdf(docDefinition).open();
        };

        function amount_in_words(amount) {
            var words = new Array();
            words[0] = '';
            words[1] = 'One';
            words[2] = 'Two';
            words[3] = 'Three';
            words[4] = 'Four';
            words[5] = 'Five';
            words[6] = 'Six';
            words[7] = 'Seven';
            words[8] = 'Eight';
            words[9] = 'Nine';
            words[10] = 'Ten';
            words[11] = 'Eleven';
            words[12] = 'Twelve';
            words[13] = 'Thirteen';
            words[14] = 'Fourteen';
            words[15] = 'Fifteen';
            words[16] = 'Sixteen';
            words[17] = 'Seventeen';
            words[18] = 'Eighteen';
            words[19] = 'Nineteen';
            words[20] = 'Twenty';
            words[30] = 'Thirty';
            words[40] = 'Forty';
            words[50] = 'Fifty';
            words[60] = 'Sixty';
            words[70] = 'Seventy';
            words[80] = 'Eighty';
            words[90] = 'Ninety';
            amount = amount.toString();
            var atemp = amount.split(".");
            var number = atemp[0].split(",").join("");
            var n_length = number.length;
            var words_string = "";
            if (n_length <= 9) {
                var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                var received_n_array = new Array();
                for (var i = 0; i < n_length; i++) {
                    received_n_array[i] = number.substr(i, 1);
                }
                for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                    n_array[i] = received_n_array[j];
                }
                for (var i = 0, j = 1; i < 9; i++, j++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        if (n_array[i] == 1) {
                            n_array[j] = 10 + parseInt(n_array[j]);
                            n_array[i] = 0;
                        }
                    }
                }
                value = "";
                for (var i = 0; i < 9; i++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        value = n_array[i] * 10;
                    } else {
                        value = n_array[i];
                    }
                    if (value != 0) {
                        words_string += words[value] + " ";
                    }
                    if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Crores ";
                    }
                    if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Lakhs ";
                    }
                    if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Thousand ";
                    }
                    if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                        words_string += "Hundred and ";
                    } else if (i == 6 && value != 0) {
                        words_string += "Hundred ";
                    }
                }
                words_string = words_string.split("  ").join(" ");
            }
            return words_string;
        };

        $scope.receiptTypeChanged = function() {
            if ($scope.selected.receiptType == "") {
                $scope.receiptsToShow = angular.copy($scope.receipts);
            } else {
                $scope.receiptsToShow = $scope.receipts.filter(x => x.FeesType == $scope.selected.receiptType);
            }
            $scope.totalInvoiceValue = $scope.receiptsToShow.reduce(function(prev, cur) { return prev + (cur.InvoiceValue - cur.Discount) }, 0);
        };

        $scope.collectApplicationFees = function() {
            var r = confirm("Confirm Application Fees Collection?");
            if (r == true) {
                FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, $scope.newAdmission.BranchId, $scope.selected.academicYear)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('Application Fees has not been set for this academic year!');
                        } else {
                            $scope.feesStructure = success.data.Data[0];
                            var receipt = {
                                Id: null,
                                StudentId: $scope.newAdmission.Id,
                                AcademicYear: $scope.selected.academicYear,
                                InvoiceValue: $scope.feesStructure.ApplicationFormFees,
                                Months: null,
                                Discount: 0,
                                AddOnFees: 0,
                                FeesType: "Type5",
                                PaymentType: "N/A",
                                PaymentDate: moment().format("YYYY-MM-DD"),
                                BranchId: $scope.newAdmission.BranchId
                            }
                            FeesStructureFactory.createReceipt(receipt)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.warning('There was a problem encountered with the server!');
                                    } else {
                                        toastr.success('Application Fees updated successfully!');
                                        $scope.getAllReceiptsForStudent();
                                    }
                                }, function(error) {
                                    toastr.success(error);
                                });
                        }
                    }, function(error) {
                        toastr.success(error);
                    });
            }
        };

        $scope.addPreviousMarks = function() {
            StudentsFactory.addPreviousMarks($scope.newPreviousMarks)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.newPreviousMarks = {
                            Id: null,
                            StudentId: null,
                            UniversityName: null,
                            MaxMarks: null,
                            MarksObtained: null,
                            CreatedAt: moment().format('YYYY-MM-DD'),
                            UpdatedAt: moment().format('YYYY-MM-DD')
                        };
                        toastr.success('Update Successful');
                        $scope.getAllPreviousMarks();
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getAllPreviousMarks = function(studentId) {
            StudentsFactory.getAllPreviousMarks(studentId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.previousMarks = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getAllCourses();
        if ($scope.isEdit) {
            $scope.getAllDocumentsForCollege();
            $scope.getAllReceiptsForStudent();
        }
    });