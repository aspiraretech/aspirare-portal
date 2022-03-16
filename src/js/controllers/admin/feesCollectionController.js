angular.module('app')
    .controller('FeesCollectionController', function($scope, $state, toastr, DashboardFactory, FeesStructureFactory, LoginFactory, StudentsFactory) {

        $scope.student = angular.copy(FeesStructureFactory.student);
        $scope.loggedInUser = LoginFactory.loggedInUser;
        FeesStructureFactory.student = null;
        $scope.feesKeywords = DashboardFactory.feesKeywords;
        $scope.discount = {
            TuitionFees: 0,
            DevelopmentFees: 0,
            TransportFees: 0
        };
        $scope.addOn = {
            DevelopmentFees: 0
        };
        $scope.years = [{
            year: moment().subtract(1, 'years').year() + "-" + moment().year()
        }, {
            year: moment().year() + "-" + moment().add(1, 'years').year()
        }];
        if (new Date().getMonth() <= 3) {
            $scope.academicYear = $scope.years[0].year;
        } else {
            $scope.academicYear = $scope.years[1].year;
        }


        // #########################################################################################
        // Regular fees logic
        $scope.totalFeesToBePaid = 0;
        $scope.currentPayment = 0;
        $scope.balancePayable = 0;
        $scope.fees_per_month = 0;
        $scope.monthsForRegularFees = [{
            Name: "May"
        }, {
            Name: "Jun"
        }, {
            Name: "Jul"
        }, {
            Name: "Aug"
        }, {
            Name: "Sep"
        }, {
            Name: "Oct"
        }, {
            Name: "Nov"
        }, {
            Name: "Dec"
        }, {
            Name: "Jan"
        }, {
            Name: "Feb"
        }, {
            Name: "Mar"
        }, {
            Name: "Apr"
        }];
        const monthNamesArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        $scope.regularFees = {
            PaymentMode: "Cash",
            PaymentDate: new Date(),
            Note: null,
            ReceiptNumber: null
        };
        $scope.dateInput = {
            min: moment().subtract(30, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.getFeesStructure = function() {
            FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, $scope.student.BranchId, $scope.academicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set yet!');
                        $scope.feesStructure = null;
                        $scope.totalTuitionFees = 0;
                        $scope.totalRegularFees = 0;
                        $scope.currentPayment = 0;
                        $scope.invoiceValue = 0;
                        $scope.totalFeesToBePaid = 0;
                        $scope.balancePayable = 0;
                        $scope.balanceDevelopmentFees = 0;
                    } else {
                        $scope.feesStructure = success.data.Data[0];
                        $scope.totalTuitionFees = ($scope.feesStructure.TuitionFees * 12) - $scope.discount.TuitionFees;
                        $scope.totalRegularFees = $scope.feesStructure.RegularComponent1 +
                            $scope.feesStructure.RegularComponent2 +
                            $scope.feesStructure.RegularComponent3 +
                            $scope.feesStructure.RegularComponent4 +
                            $scope.feesStructure.RegularComponent5 +
                            $scope.feesStructure.RegularComponent6 +
                            $scope.feesStructure.RegularComponent7 +
                            $scope.feesStructure.RegularComponent8 +
                            $scope.feesStructure.RegularComponent9 +
                            $scope.feesStructure.RegularComponent10 +
                            $scope.feesStructure.RegularComponent11;
                        $scope.currentPayment = angular.copy($scope.totalRegularFees);
                        $scope.invoiceValue = angular.copy($scope.totalRegularFees);
                        $scope.totalFeesToBePaid = (($scope.feesStructure.TuitionFees * 12) + $scope.totalRegularFees - $scope.discount.TuitionFees);
                        $scope.balancePayable = $scope.totalFeesToBePaid - $scope.currentPayment;
                        // for developmentfees
                        if ($scope.student.StudentType == 1) {
                            $scope.balanceDevelopmentFees = $scope.feesStructure.OtherComponent1;
                        } else {
                            $scope.balanceDevelopmentFees = $scope.feesStructure.OtherComponent2;
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.tuitionDiscountEntered = function() {
            if ($scope.discount.TuitionFees > ($scope.feesStructure.TuitionFees * 12)) {
                $scope.discount.TuitionFees = 0;
                toastr.warning('Discount cannot be less than tuition fee');
            }
            $scope.totalFeesToBePaid = (($scope.feesStructure.TuitionFees * 12) + $scope.totalRegularFees - $scope.discount.TuitionFees);
            $scope.calculateBalance();
        };

        $scope.selectAllMonthsForRegularFees = function() {
            for (var i = 0; i < $scope.monthsForRegularFees.length; i++) {
                $scope.monthsForRegularFees[i].isChecked = true;
            }
            $scope.calculateBalance();
        };
        $scope.unselectAllMonthsForRegularFees = function() {
            for (var i = 0; i < $scope.monthsForRegularFees.length; i++) {
                $scope.monthsForRegularFees[i].isChecked = false;
            }
            $scope.calculateBalance();
        };

        $scope.monthSelectedForRegularFees = function(mon) {
            if (mon.Name != 'Jan') {
                var previousMonthName = monthNamesArray[monthNamesArray.indexOf(mon.Name) - 1];
                var previousMonthObject = $scope.monthsForRegularFees.filter(x => x.Name == previousMonthName)[0];
            } else {
                var previousMonthName = ['Dec'];
                var previousMonthObject = $scope.monthsForRegularFees.filter(x => x.Name == previousMonthName)[0];
            }
            if (mon.Name != 'May' && !previousMonthObject.isChecked) {
                toastr.warning('Cannot select ' + mon.Name + ' without selecting ' + previousMonthName);
                mon.isChecked = false;
            } else {
                $scope.calculateBalance();
            }
        };

        $scope.calculateBalance = function() {
            var no_of_months = $scope.monthsForRegularFees.filter(a => (a.isChecked == true)).length;
            if (no_of_months == 0) {
                $scope.currentPayment = angular.copy($scope.totalRegularFees);
                $scope.invoiceValue = angular.copy($scope.totalRegularFees);
            } else {
                $scope.fees_per_month = ($scope.totalTuitionFees) / 12;
                $scope.currentPayment = ($scope.fees_per_month * no_of_months) + $scope.totalRegularFees - $scope.discount.TuitionFees;
                $scope.invoiceValue = ($scope.fees_per_month * no_of_months) + $scope.totalRegularFees;
            }
            $scope.balancePayable = $scope.totalFeesToBePaid - $scope.currentPayment;
        };

        $scope.submitRegularFees = function() {
            // var no_of_months = $scope.monthsForRegularFees.filter(a => (a.isChecked == true)).length;
            // if (no_of_months != 0) {
            // if ($scope.discount.TuitionFees != 0 && ($scope.regularFees.Note == "" || $scope.regularFees.Note == null)) {
            //     toastr.warning("Please enter a note for the discount provided in tuition fees");
            // } else {
            var obj = [];
            for (var i = 0; i < $scope.monthsForRegularFees.length; i++) {
                var template = {
                    StudentId: $scope.student.Id,
                    AcademicYear: $scope.academicYear,
                    Month: $scope.monthsForRegularFees[i].Name,
                    Type1Fees: ($scope.feesStructure.TuitionFees), //tuition fees is monthly and discount is annual
                    Type1Status: $scope.monthsForRegularFees[i].isChecked ? 1 : 0,
                    Type2Fees: ($scope.totalRegularFees / 12), // total fees is annual
                    PaymentDate: $scope.monthsForRegularFees[i].isChecked ? moment($scope.regularFees.PaymentDate).format("YYYY-MM-DD") : null,
                    PaymentMode: $scope.monthsForRegularFees[i].isChecked ? $scope.regularFees.PaymentMode : null,
                    Note: $scope.monthsForRegularFees[i].isChecked ? $scope.regularFees.Note : null,
                    ReceiptNumber: $scope.monthsForRegularFees[i].isChecked ? $scope.student.Id : null
                }
                obj.push(template);
            }
            FeesStructureFactory.saveRegularFees(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        var receipt = {
                            Id: null,
                            StudentId: $scope.student.Id,
                            AcademicYear: $scope.academicYear,
                            InvoiceValue: $scope.invoiceValue,
                            Months: $scope.monthsForRegularFees.filter(x => x.isChecked).map(x => x.Name).join(","),
                            Discount: $scope.discount.TuitionFees,
                            AddOnFees: 0,
                            FeesType: "Type1",
                            PaymentType: $scope.regularFees.PaymentMode,
                            PaymentDate: moment($scope.regularFees.PaymentDate).format("YYYY-MM-DD"),
                            BranchId: $scope.student.BranchId
                        }
                        FeesStructureFactory.createReceipt(receipt)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.warning('There was a problem encountered with the server!');
                                } else {
                                    toastr.success('Tuition Fees updated successfully!');
                                    $scope.submitDevelopmentFees();
                                }
                            }, function(error) {
                                toastr.success(error);
                            });
                    }
                }, function(error) {
                    toastr.success(error);
                });
            // }
            // } else {
            //     toastr.warning('Please select at least 1 month to pay the fees');
            // }
        };

        // ###############################################################################################
        // Development fees logic
        $scope.developmentFees = {
            studentType: $scope.student.StudentType,
            downPayment: 0,
            PaymentDate: new Date(),
            PaymentMode: "Cash",
            Note: null,
            ReceiptNumber: null
        };

        $scope.submitDevelopmentFees = function() {
            if ($scope.developmentFees.downPayment == 0) {
                $scope.submitTransportFees();
            } else {
                var obj = {
                    Id: null,
                    StudentId: $scope.student.Id,
                    AcademicYear: $scope.academicYear,
                    Discount: $scope.discount.DevelopmentFees,
                    AddOnFees: $scope.addOn.DevelopmentFees,
                    Type4Fees: $scope.developmentFees.downPayment,
                    PaymentDate: moment($scope.developmentFees.PaymentDate).format("YYYY-MM-DD"),
                    PaymentMode: $scope.developmentFees.PaymentMode,
                    Note: $scope.developmentFees.Note,
                    ReceiptNumber: $scope.student.Id
                };
                FeesStructureFactory.saveDevelopmentFees(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            var receipt = {
                                Id: null,
                                StudentId: $scope.student.Id,
                                AcademicYear: $scope.academicYear,
                                InvoiceValue: $scope.developmentFees.downPayment,
                                Months: null,
                                Discount: $scope.discount.DevelopmentFees,
                                AddOnFees: $scope.addOn.DevelopmentFees,
                                FeesType: "Type4",
                                PaymentType: $scope.developmentFees.PaymentMode,
                                PaymentDate: moment($scope.developmentFees.PaymentDate).format("YYYY-MM-DD"),
                                BranchId: $scope.student.BranchId
                            }
                            FeesStructureFactory.createReceipt(receipt)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.warning('There was a problem encountered with the server!');
                                    } else {
                                        toastr.success('Development Fees updated successfully!');
                                        $scope.submitTransportFees();
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

        $scope.developmentFeesDownPaymentEntered = function() {
            var optedFees = $scope.developmentFees.studentType == "1" ? ($scope.feesStructure.OtherComponent1 + $scope.addOn.DevelopmentFees - $scope.discount.DevelopmentFees) : ($scope.feesStructure.OtherComponent2 + $scope.addOn.DevelopmentFees - $scope.discount.DevelopmentFees);
            if ($scope.developmentFees.downPayment > optedFees) {
                $scope.developmentFees.downPayment = 0;
                toastr.warning("Cannot pay more than the fees");
                $scope.balanceDevelopmentFees = optedFees;
            } else {
                $scope.balanceDevelopmentFees = optedFees - $scope.developmentFees.downPayment;
            }
        };


        // #####################################################################################
        // Transport Fees logic
        $scope.transportFees = {
            selectedFees: null,
            PaymentMode: "Cash",
            PaymentDate: new Date(),
            Note: null,
            ReceiptNumber: null
        }
        $scope.transportFeesArray = [];
        $scope.totalTransportFees = 0;
        $scope.monthsForTransportFees = [{
            Name: "May"
        }, {
            Name: "Jun"
        }, {
            Name: "Jul"
        }, {
            Name: "Aug"
        }, {
            Name: "Sep"
        }, {
            Name: "Oct"
        }, {
            Name: "Nov"
        }, {
            Name: "Dec"
        }, {
            Name: "Jan"
        }, {
            Name: "Feb"
        }, {
            Name: "Mar"
        }, {
            Name: "Apr"
        }];

        $scope.getTransportFees = function() {
            FeesStructureFactory.getTransportFees(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.transportFeesArray = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Transport Fees has not been set yet!');
                    } else {
                        $scope.transportFeesArray = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.selectAllMonthsForTransportFees = function() {
            for (var i = 0; i < $scope.monthsForTransportFees.length; i++) {
                $scope.monthsForTransportFees[i].isChecked = true;
            }
            $scope.calculateTransportFees();
        };
        $scope.unselectAllMonthsForTransportFees = function() {
            for (var i = 0; i < $scope.monthsForTransportFees.length; i++) {
                $scope.monthsForTransportFees[i].isChecked = false;
            }
            $scope.calculateTransportFees();
        };

        $scope.calculateTransportFees = function() {
            var no_of_months = $scope.monthsForTransportFees.filter(a => (a.isChecked == true)).length;
            if (no_of_months == 0) {
                $scope.totalTransportFees = 0;
            } else {
                $scope.totalTransportFees = $scope.transportFees.selectedFees * no_of_months;
            }
        };

        $scope.submitTransportFees = function() {
            var obj = [];
            for (var i = 0; i < $scope.monthsForTransportFees.length; i++) {
                var template = {
                    StudentId: $scope.student.Id,
                    AcademicYear: $scope.academicYear,
                    Month: $scope.monthsForTransportFees[i].Name,
                    Type3Fees: $scope.transportFees.selectedFees,
                    Type3Status: $scope.monthsForTransportFees[i].isChecked ? 1 : 0,
                    PaymentDate: $scope.monthsForTransportFees[i].isChecked ? moment($scope.transportFees.PaymentDate).format("YYYY-MM-DD") : null,
                    PaymentMode: $scope.monthsForTransportFees[i].isChecked ? $scope.transportFees.PaymentMode : null,
                    Note: $scope.monthsForTransportFees[i].isChecked ? $scope.transportFees.Note : null,
                    ReceiptNumber: $scope.monthsForTransportFees[i].isChecked ? $scope.student.Id : null
                }
                obj.push(template);
            }
            FeesStructureFactory.saveTransportFees(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        var selected_months = $scope.monthsForTransportFees.filter(x => x.isChecked);
                        if (selected_months.length > 0) {
                            var receipt = {
                                Id: null,
                                StudentId: $scope.student.Id,
                                AcademicYear: $scope.academicYear,
                                InvoiceValue: $scope.totalTransportFees,
                                Months: selected_months.map(x => x.Name).join(","),
                                Discount: 0,
                                AddOnFees: 0,
                                FeesType: "Type3",
                                PaymentType: $scope.transportFees.PaymentMode,
                                PaymentDate: moment($scope.transportFees.PaymentDate).format("YYYY-MM-DD"),
                                BranchId: $scope.student.BranchId
                            }
                            FeesStructureFactory.createReceipt(receipt)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.warning('There was a problem encountered with the server!');
                                    } else {
                                        toastr.success('Transport Fees updated successfully!');
                                        $state.go('app.main');
                                    }
                                }, function(error) {
                                    toastr.success(error);
                                });
                        } else {
                            toastr.success('Transport Fees updated successfully!');
                            //go to edit student for receipts
                            StudentsFactory.selectedStudent = $scope.student;
                            // StudentsFactory.branchNameForReceipt = $scope.branches.filter(x => x.Id == $scope.selected.branchId)[0].Name;
                            $state.go("app.students.addStudent", { flag: 2 });
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.submitFees = function() {
            if ($scope.student.Id == null) { // manual admission
                $scope.admissionType = 'add';
                $scope.admitStudent();
            } else { //coming from activate student
                $scope.admissionType = 'update';
                $scope.updateStudent();
            }
        }

        $scope.admitStudent = function() {
            StudentsFactory.admitStudent($scope.student)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        toastr.success('Admission was done Successfully');
                        $scope.student.Id = success.data.Data.insertId;
                        $scope.submitRegularFees();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updateStudent = function() {
            $scope.student.Payment = []; //update api expects payment array
            StudentsFactory.updateStudent($scope.student)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        toastr.success('Student was updated Successfully');
                        $scope.submitRegularFees();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };
        $scope.getFeesStructures = function() {
            $scope.getFeesStructure();
            $scope.getTransportFees();
        }

        $scope.getFeesStructures();

    });