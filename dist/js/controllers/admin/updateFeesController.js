angular.module('app')
    .controller('UpdateFeesController', function($scope, $state, toastr, FeesStructureFactory, LoginFactory, StudentsFactory) {

        $scope.years = [{
            year: moment().year() + "-" + moment().add(1, 'years').year()
        }, {
            year: moment().subtract(1, 'years').year() + "-" + moment().year()
        }];
        $scope.common = {
            // academicYear: (new Date().getMonth() <= 3) ? moment().subtract(1, 'years').year() + "-" + moment().year() : moment().year() + "-" + moment().add(1, 'years').year()
            academicYear: FeesStructureFactory.academicYear
        };
        $scope.regularFees = [];
        $scope.student = FeesStructureFactory.student;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.showDiscount = false;
        $scope.showTuitionFeesCollectionTable = true;
        $scope.showDevelopmentFeesCollectionTable = true;
        $scope.showTransportFeesCollectionTable = true;
        $scope.showCollectTransportFeesButtonForRTEStudents = false; //initially hide, once months are empty, show!
        $scope.regular = {
            discount: 0,
            payable: 0,
            balance: 0,
            alreadyPaid: 0,
            paymentDate: new Date(),
            paymentMode: "Cash",
            note: null
        };
        const monthNamesArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        $scope.dateInput = {
            min: moment().subtract(30, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.getRegularFeesForStudent = function() {
            FeesStructureFactory.getRegularFeesForStudent($scope.student.Id, $scope.common.academicYear)
                .then(function(success) {
                    $scope.regularFees = [];
                    $scope.transportFees = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Regular Fees has not been paid for this academic year!');
                        if ($scope.student.IsRTE) {
                            $scope.showCollectTransportFeesButtonForRTEStudents = true;
                        }
                    } else {
                        // regular Fees
                        $scope.showCollectTransportFeesButtonForRTEStudents = false;
                        $scope.regularFees = angular.copy(success.data.Data);
                        $scope.totalRegularFeesToBePaid = 0;
                        for (var i = 0; i < $scope.regularFees.length; i++) {
                            $scope.regularFees[i].disabled = true;
                            $scope.regularFees[i].AddOnFees = 0;
                            $scope.regularFees[i].FeesAfterAddOn = $scope.regularFees[i].Type1Fees;
                            $scope.totalRegularFeesToBePaid += $scope.regularFees[i].FeesAfterAddOn;
                            if (!$scope.regularFees[i].Type1Status) {
                                $scope.regularFees[i].disabled = false;
                                $scope.regular.balance += $scope.regularFees[i].Type1Fees;
                            } else {
                                $scope.regular.alreadyPaid += $scope.regularFees[i].Type1Fees;
                            }
                        }
                        if ($scope.regular.alreadyPaid == 0) {
                            $scope.showDiscount = true;
                        }
                        if ($scope.regular.balance == 0) {
                            $scope.showTuitionFeesCollectionTable = false;
                        }

                        // transport Fees
                        $scope.transportFees = angular.copy(success.data.Data);
                        for (var i = 0; i < $scope.transportFees.length; i++) {
                            $scope.transportFees[i].disabled = true;
                            if (!$scope.transportFees[i].Type3Status) {
                                $scope.transportFees[i].disabled = false;
                            } else {
                                $scope.transport.alreadyPaid += $scope.transportFees[i].Type3Fees;
                            }
                        }
                        var remainingTransportMonths = $scope.transportFees.filter(x => x.disabled == false);
                        if (remainingTransportMonths.length == 0) {
                            $scope.showTransportFeesCollectionTable = false;
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getMonthValue = function(mon) {
            var monthNumber = new Date(Date.parse(mon.Month + " 1, 2000")).getMonth() + 1;
            switch (monthNumber) {
                case 1:
                    return 9;
                    break;
                case 2:
                    return 10;
                    break;
                case 3:
                    return 11;
                    break;
                case 4:
                    return 12;
                    break;
                case 5:
                    return 1;
                    break;
                case 6:
                    return 2;
                    break;
                case 7:
                    return 3;
                    break;
                case 8:
                    return 4;
                    break;
                case 9:
                    return 5;
                    break;
                case 10:
                    return 6;
                    break;
                case 11:
                    return 7;
                    break;
                case 12:
                    return 8;
                    break;
            }
        };

        $scope.monthSelectedForRegularFees = function(mon) {
            if (mon.Month != 'Jan') {
                var previousMonthName = monthNamesArray[monthNamesArray.indexOf(mon.Month) - 1];
                var previousMonthObject = $scope.regularFees.filter(x => x.Month == previousMonthName)[0];
            } else {
                var previousMonthName = ['Dec'];
                var previousMonthObject = $scope.regularFees.filter(x => x.Month == previousMonthName)[0];
            }
            if (mon.Month != 'May' && !previousMonthObject.Type1Status) {
                toastr.warning('Cannot select ' + mon.Month + ' without selecting ' + previousMonthName);
                mon.Type1Status = false;
            } else {
                $scope.calculateRegularFees();
            }
        };

        $scope.calculateRegularFees = function() {
            var no_of_months = $scope.regularFees.filter(a => (a.disabled == false && a.Type1Status == 1)).length;
            if (no_of_months == 0) {
                $scope.regular.payable = 0;
            } else {
                $scope.regular.payable = 0;
                angular.forEach($scope.regularFees, function(month) {
                    if (month.Type1Status && !month.disabled) {
                        $scope.regular.payable += month.FeesAfterAddOn;
                    }
                });
                $scope.regular.payable -= $scope.regular.discount;
            }
            $scope.regular.balance = ($scope.totalRegularFeesToBePaid - $scope.regular.alreadyPaid) - $scope.regular.payable;
        };

        $scope.updateTuitionFees = function() {
            var obj = [];
            for (var i = 0; i < $scope.regularFees.length; i++) {
                if ($scope.regularFees[i].disabled == false && $scope.regularFees[i].Type1Status == 1) {
                    var template = {
                        StudentId: $scope.student.Id,
                        AcademicYear: $scope.common.academicYear,
                        Month: $scope.regularFees[i].Month,
                        Type1Fees: $scope.regularFees[i].FeesAfterAddOn,
                        Type1Status: 1,
                        Type2Fees: $scope.regularFees[i].Type2Fees,
                        PaymentDate: moment($scope.regular.paymentDate).format("YYYY-MM-DD"),
                        PaymentMode: $scope.regular.paymentMode,
                        Note: $scope.regular.note,
                        ReceiptNumber: $scope.student.Id
                    }
                    obj.push(template);
                }
            }
            FeesStructureFactory.saveRegularFees(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        var invoiceValue = obj.map(x => x.Type1Fees).reduce(function(total, num) {
                            return total + num;
                        });
                        var receipt = {
                            Id: null,
                            StudentId: $scope.student.Id,
                            AcademicYear: $scope.common.academicYear,
                            InvoiceValue: invoiceValue,
                            Months: obj.map(x => x.Month).join(","),
                            Discount: $scope.regular.discount,
                            AddOnFees: 0,
                            FeesType: "Type1",
                            PaymentType: $scope.regular.paymentMode,
                            PaymentDate: moment($scope.regular.paymentDate).format("YYYY-MM-DD"),
                            BranchId: $scope.student.BranchId
                        }
                        FeesStructureFactory.createReceipt(receipt)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.warning('There was a problem encountered with the server!');
                                } else {
                                    toastr.success('Tuition Fees updated successfully!');
                                    $scope.regular = {
                                        discount: 0,
                                        payable: 0,
                                        balance: 0,
                                        alreadyPaid: 0,
                                        paymentDate: new Date(),
                                        paymentMode: null,
                                        note: null
                                    };
                                    $scope.getRegularFeesForStudent();
                                }
                            }, function(error) {
                                toastr.success(error);
                            });
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.addOnFeesEntered = function(month) {
            month.FeesAfterAddOn = month.Type1Fees + month.AddOnFees;
            $scope.totalRegularFeesToBePaid = 0;
            angular.forEach($scope.regularFees, function(month) {
                $scope.totalRegularFeesToBePaid += month.FeesAfterAddOn;
            });
            $scope.calculateRegularFees();
        };


        // ############transport fees
        $scope.transport = {
            selectedFees: null,
            payable: 0,
            balance: 0,
            alreadyPaid: 0,
            paymentDate: new Date(),
            paymentMode: "Cash",
            note: null
        };

        $scope.getTransportFees = function() {
            FeesStructureFactory.getTransportFees(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.transportFeesArray = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Transport Fees Structure has not been set yet!');
                    } else {
                        $scope.transportFeesArray = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.updateTransportFees = function() {
            var obj = [];
            for (var i = 0; i < $scope.transportFees.length; i++) {
                if ($scope.transportFees[i].disabled == false && $scope.transportFees[i].Type3Status == 1) {
                    var template = {
                        StudentId: $scope.student.Id,
                        AcademicYear: $scope.common.academicYear,
                        Month: $scope.transportFees[i].Month,
                        Type3Fees: $scope.transport.selectedFees,
                        Type3Status: 1,
                        PaymentDate: moment($scope.transport.paymentDate).format("YYYY-MM-DD"),
                        PaymentMode: $scope.transport.paymentMode,
                        Note: $scope.transport.note,
                        ReceiptNumber: $scope.student.Id
                    }
                    obj.push(template);
                }
            }
            FeesStructureFactory.saveTransportFees(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        var invoiceValue = obj.map(x => x.Type3Fees).reduce(function(total, num) {
                            return total + num;
                        });
                        var receipt = {
                            Id: null,
                            StudentId: $scope.student.Id,
                            AcademicYear: $scope.common.academicYear,
                            InvoiceValue: invoiceValue,
                            Months: obj.map(x => x.Month).join(","),
                            Discount: 0,
                            AddOnFees: 0,
                            FeesType: "Type3",
                            PaymentType: $scope.transport.PaymentMode,
                            PaymentDate: moment($scope.transport.paymentDate).format("YYYY-MM-DD"),
                            BranchId: $scope.student.BranchId
                        }
                        FeesStructureFactory.createReceipt(receipt)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.warning('There was a problem encountered with the server!');
                                } else {
                                    toastr.success('Transport Fees updated successfully!');
                                    $scope.transport = {
                                        selectedFees: null,
                                        payable: 0,
                                        balance: 0,
                                        alreadyPaid: 0,
                                        paymentDate: new Date(),
                                        paymentMode: null,
                                        note: null
                                    };
                                    $scope.getRegularFeesForStudent();
                                }
                            }, function(error) {
                                toastr.success(error);
                            });
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.calculateTransportFees = function(month) {
            if ($scope.transport.selectedFees != null) {
                var no_of_months = $scope.transportFees.filter(a => (a.disabled == false && a.Type3Status == 1)).length;
                $scope.transport.payable = $scope.transport.selectedFees * no_of_months;
            } else {
                month.Type3Status = 0;
                toastr.warning('Please choose a variant');
            }
        };

        // ###############development fees
        $scope.development = {
            overall: 0,
            discount: 0,
            addOn: 0,
            payable: 0,
            balance: 0,
            alreadyPaid: 0,
            paymentDate: new Date(),
            paymentMode: "Cash",
            note: null
        };

        $scope.developmentFees = [];

        $scope.getDevelopmentFeesForStudent = function() {
            // 1 is new, 2 is old
            if ($scope.student.StudentType == 1) {
                $scope.development.overall = $scope.feesStructure.OtherComponent1; // this is the fees set by the institution
            } else {
                $scope.development.overall = $scope.feesStructure.OtherComponent2; // this is the fees set by the institution
            }

            FeesStructureFactory.getDevelopmentFeesForStudent($scope.student.Id, $scope.common.academicYear)
                .then(function(success) {
                    $scope.developmentFees = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Development Fees has not been paid for this academic year!');
                    } else {
                        $scope.developmentFees = success.data.Data;
                        for (var i = 0; i < $scope.developmentFees.length; i++) {
                            $scope.development.alreadyPaid += $scope.developmentFees[i].Type4Fees;
                        }
                        $scope.development.discount = angular.copy($scope.developmentFees[$scope.developmentFees.length - 1].Discount); //should take last updated discount
                        $scope.development.addOn = angular.copy($scope.developmentFees[$scope.developmentFees.length - 1].AddOnFees);
                    }
                    $scope.optedFees = $scope.development.overall + $scope.development.addOn - $scope.development.discount;
                    $scope.development.balance = $scope.optedFees - $scope.development.alreadyPaid;
                    $scope.balanceForCalculation = angular.copy($scope.development.balance);
                    if ($scope.development.balance == 0) {
                        $scope.showDevelopmentFeesCollectionTable = false;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.updateDevelopmentFees = function() {
            if ($scope.development.payable == 0) {
                toastr.warning('Enter the fees payable');
            } else {
                var obj = {
                    Id: null,
                    StudentId: $scope.student.Id,
                    AcademicYear: $scope.common.academicYear,
                    Type4Fees: $scope.development.payable,
                    AddOnFees: $scope.development.addOn,
                    Discount: $scope.development.discount,
                    PaymentDate: moment($scope.development.paymentDate).format("YYYY-MM-DD"),
                    PaymentMode: $scope.development.paymentMode,
                    Note: $scope.development.note,
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
                                AcademicYear: $scope.common.academicYear,
                                InvoiceValue: $scope.development.payable,
                                Months: null,
                                Discount: $scope.development.discount,
                                AddOnFees: $scope.development.addOn,
                                FeesType: "Type4",
                                PaymentType: $scope.development.paymentMode,
                                PaymentDate: moment($scope.development.paymentDate).format("YYYY-MM-DD"),
                                BranchId: $scope.student.BranchId
                            }
                            FeesStructureFactory.createReceipt(receipt)
                                .then(function(success) {
                                    if (success.data.Code != "S001") {
                                        toastr.warning('There was a problem encountered with the server!');
                                    } else {
                                        toastr.success('Development Fees updated successfully!');
                                        $scope.development = {
                                            payable: 0,
                                            balance: 0,
                                            alreadyPaid: 0,
                                            paymentDate: new Date(),
                                            paymentMode: "Cash",
                                            note: null
                                        };
                                        $scope.getDevelopmentFeesForStudent();
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

        $scope.calculateDevelopmentFees = function() {
            $scope.optedFees = $scope.development.overall + $scope.development.addOn - $scope.development.discount;
            $scope.development.balance = $scope.optedFees - $scope.development.alreadyPaid;
            $scope.balanceForCalculation = angular.copy($scope.development.balance);
            if ($scope.development.payable > $scope.balanceForCalculation) {
                toastr.warning('Cannot pay more than balance');
                $scope.development.payable = 0;
            }

            var oldDiscount = $scope.development.discount;
            if ($scope.development.discount > $scope.balanceForCalculation) {
                if (oldDiscount == 0) {
                    toastr.warning('Cannot provide discount more than balance');
                }
                $scope.development.discount = oldDiscount;
            }
            $scope.development.balance = $scope.development.overall + $scope.development.addOn - $scope.development.discount - $scope.development.alreadyPaid - $scope.development.payable;
            // if ($scope.development.alreadyPaid == 0) {
            //     $scope.development.balance = $scope.optedFees + $scope.development.addOn - $scope.development.discount - $scope.development.payable;
            // } else {
            //     $scope.development.balance = $scope.optedFees - $scope.development.alreadyPaid - $scope.development.payable;
            // }
        };

        // collect transport fees for RTE students
        $scope.collectTransportFeesForRTEStudents = function() {
            if ($scope.transport.selectedFees == null) {
                toastr.warning('Select a distance to collect transport fees!');
            } else {
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
                var obj = [];
                for (var i = 0; i < $scope.monthsForTransportFees.length; i++) {
                    var template = {
                        StudentId: $scope.student.Id,
                        AcademicYear: $scope.common.academicYear,
                        Month: $scope.monthsForTransportFees[i].Name,
                        Type3Fees: $scope.transport.selectedFees,
                        Type3Status: 0,
                        PaymentDate: new Date(),
                        PaymentMode: "Cash",
                        Note: null,
                        ReceiptNumber: null
                    }
                    obj.push(template);
                }
                FeesStructureFactory.saveTransportFees(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Transport fees created successfully');
                            $scope.getFeesStructure();
                        }
                    }, function(error) {
                        toastr.success(error);
                    });
            }
        };

        // get fees structure
        $scope.getFeesStructure = function() {
            FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, $scope.student.BranchId, $scope.common.academicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set for this academic year!');
                    } else {
                        $scope.feesStructure = success.data.Data[0];
                        $scope.getRegularFeesForStudent();
                        $scope.getDevelopmentFeesForStudent();
                        $scope.getTransportFees();
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        // #common code
        $scope.academicYearChanged = function() {
            $scope.getRegularFeesForStudent();
            $scope.getDevelopmentFeesForStudent();
        };

        $scope.goBack = function() {
            StudentsFactory.selectedStudent = $scope.student;
            // StudentsFactory.branchNameForReceipt = $scope.branches.filter(x => x.Id == $scope.selected.branchId)[0].Name;
            $state.go("app.students.addStudent", { flag: 2 });
        };

        $scope.getFeesStructure();
    });