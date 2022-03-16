angular.module('app')
    .controller('EnquiryController', function($scope, $state, EnquiryFactory, DashboardFactory, LoginFactory, toastr, $uibModal, $filter, FeesStructureFactory) {
        $scope.enquiries = [];
        $scope.enquiriesToShow = [];
        $scope.academicYear = moment().year() + "-" + moment().add(1, 'years').year();
        $scope.selected = {
            enquiries: [],
            all: false,
            ltj: null,
            search: null
        };
        $scope.ltjs = [{
            Id: "Yes",
            Name: 'Yes'
        }, {
            Id: "No",
            Name: 'No'
        }, {
            Id: "Maybe",
            Name: 'Maybe'
        }];
        $scope.dateInput = {
            min: moment().add(1, 'days').format('YYYY-MM-DD'),
            max: moment().add(1, 'years').format('YYYY-MM-DD')
        };
        $scope.enquiriesToDelete = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.keywords = DashboardFactory.keywords;
        $scope.app_base = LoginFactory.getAppBase();
        $scope.enquiryStats = {
            Total: 0,
            Converted: 0,
            FollowUpsCount: 0
        };
        $scope.getAllEnquiries = function() {
            $scope.enquiries = [];
            EnquiryFactory.getAllEnquiries(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No enquiries found!');
                    } else {
                        $scope.enquiries = success.data.Data;
                        $scope.getEnquiryStats($scope.enquiries);
                        $scope.enquiriesToShow = angular.copy($scope.enquiries);
                        for (var i = 0; i < $scope.enquiries.length; i++) {
                            $scope.enquiries[i].FollowupDate = new Date($scope.enquiries[i].FollowupDate);
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.followUpChanged = function(enquiry) {
            var obj = {
                Id: enquiry.Id,
                FollowupDate: moment(enquiry.FollowupDate).format("YYYY/MM/DD")
            };
            EnquiryFactory.updateEnquiry(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        toastr.success('Updation successful');
                        $scope.getAllEnquiries();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.allEnquiriesSelected = function() {
            if ($scope.selected.all) {
                for (var i = 0; i < $scope.enquiriesToShow.length; i++) {
                    $scope.enquiriesToShow[i].isSelected = true;
                    $scope.enquiriesToDelete.push($scope.enquiriesToShow[i]);
                }
            } else {
                for (var i = 0; i < $scope.enquiriesToShow.length; i++) {
                    $scope.enquiriesToShow[i].isSelected = false;
                    $scope.enquiriesToDelete = [];
                }
            }
        };

        $scope.addEnquiry = function() {
            $state.go("app.students.addEnquiry", { isEdit: 0 });
        };

        $scope.sendSMS = function() {
            $scope.phoneNumbers = [];
            for (var i = 0; i < $scope.enquiriesToShow.length; i++) {
                if ($scope.enquiriesToShow[i].isSelected) {
                    $scope.phoneNumbers.push($scope.enquiriesToShow[i].PhoneNumber);
                }
            }
            if ($scope.phoneNumbers.length == 0) {
                toastr.warning('Please select an enquiry to send sms');
            } else {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: $scope.app_base + 'views/templates/SendSMSTemplate.html',
                    controller: 'SendSMSController',
                    resolve: {
                        phoneNumbers: function() {
                            return $scope.phoneNumbers;
                        }
                    }
                });

                modalInstance.result.then(function(response) {
                    toastr.success(response);
                }, function() {
                    console.log('Cancelled');
                });
            }
        };

        $scope.admitStudent = function(enquiry) {
            EnquiryFactory.selectedEnquiry = enquiry;
            $state.go("app.students.addStudent", { flag: 3 });
        };

        $scope.delete = function(enquiry) {
            var r = confirm("Are you sure you want to delete this enquiry?");
            if (r == true) {
                EnquiryFactory.deleteEnquiry(enquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Enquiry deleted successfully');
                            $scope.getAllEnquiries();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.enquirySelected = function(enquiry) {
            $scope.enquiriesToDelete.push(enquiry.Id);
        };

        $scope.deleteEnquiries = function() {
            var r = confirm("Are you sure you want to delete selected enquiries?");
            if (r == true) {
                var obj = {
                    Ids: $scope.enquiriesToDelete.map(a => a.Id)
                };
                EnquiryFactory.deleteEnquiries(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Enquiries deleted successfully');
                            $scope.enquiriesToDelete = [];
                            $scope.getAllEnquiries();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.changeEnquiryStatus = function(enquiry, status) {
            var r = confirm("Are you sure you want to update enquiry status?");
            if (r == true) {
                enquiry.Status = status;
                EnquiryFactory.changeEnquiryStatus(enquiry)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            toastr.success('Enquiry status updated successfully');
                            $scope.getAllEnquiries();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.viewNotes = function(enquiry) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + 'views/templates/EnquiryNotesTemplate.html',
                controller: 'EnquiryNotesController',
                resolve: {
                    enq: function() {
                        return enquiry;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                console.log(response);
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.edit = function(enquiry) {
            EnquiryFactory.selectedEnquiry = enquiry;
            $state.go("app.students.addEnquiry", { isEdit: 1 });
        };

        $scope.$watch('search', function(val) {
            $scope.enquiriesToShow = $filter('filter')($scope.enquiries, val);
        });

        $scope.enquirySortFunction = function(enquiry) {
            return moment() < moment(new Date(enquiry.FollowUpDate)) < moment().add(7, 'days');
        };

        $scope.getFeesStructure = function(enquiry) {
            FeesStructureFactory.getFeesStructure(LoginFactory.loggedInUser.CollegeId, enquiry.BranchId, $scope.academicYear)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set yet!');
                    } else {
                        $scope.feesStructure = success.data.Data[0];
                        if ($scope.feesStructure.ApplicationFormFees == 0 || $scope.feesStructure.ApplicationFormFees == null) {
                            toastr.warning('Application Fees has not been set for ' + enquiry.BranchName);
                        } else {
                            $scope.printReceipt(enquiry);
                        }
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.printReceipt = function(enquiry) {
            var name = enquiry.Name;
            var appFormNo = enquiry.UniqueId;
            var academicYear = moment().year() + "-" + moment().add(1, 'years').year();
            var receiptNo = enquiry.Id;
            var today = moment().format('DD-MM-YYYY');
            var amountInNumbers = $scope.feesStructure.ApplicationFormFees;
            var amountInWords = amount_in_words(amountInNumbers);

            var docDefinition = {
                content: [{
                        columns: [{
                                text: '\n\n\n\n\n\n\n\n\n\nName: ' + name + '\n Application Form No: ' + appFormNo + '\n Academic Year: ' + academicYear + '\n\n',
                                bold: true

                            },
                            {

                            },
                            {
                                text: '\n\n\n\n\n\n\n\n\n\nReceipt No: ' + receiptNo + '\n Date: ' + today + '\n\n',
                                bold: true
                            }
                        ]
                    },
                    {
                        table: {
                            widths: [350, 150],
                            body: [
                                [{ text: 'Particulars', alignment: 'center', bold: true, fontSize: 15 }, { text: 'Amount (In Rs.)', alignment: 'center', bold: true, fontSize: 15 }],
                                ['Application Fees.\n', { text: amountInNumbers, alignment: 'right' }],
                                [{ text: 'Grand Total:', italics: true, alignment: 'right', bold: true }, { text: amountInNumbers, alignment: 'right' }]
                            ]
                        }
                    },
                    '\n\nPayment Type: Cash',
                    'Rupees (In Words): ' + amountInWords + ' Only',
                    {
                        columns: [{
                                text: 'Place: Bengaluru'

                            },
                            {

                            },
                            {

                            },
                            {

                            },
                            {
                                text: 'Cashier'
                            }
                        ]
                    },
                    { text: '\nAlso fill in Application form Online - http://bit.ly/aspirare', alignment: 'center', bold: true },
                ]
            }
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

        $scope.getEnquiryStats = function(enquiries) {
            $scope.enquiryStats = {
                Total: enquiries.length,
                Converted: enquiries.filter(x => x.Status == 'CONVERTED').length,
                FollowUpsCount: enquiries.filter(x => moment(x.FollowUpDate).month() == moment().month()).length
            };
        };

        $scope.getAllEnquiries();

    })
    .controller('SendSMSController', function($scope, $state, phoneNumbers, $uibModalInstance, EnquiryFactory, toastr) {
        $scope.phoneNumbersToShow = phoneNumbers.join(", ");
        $scope.sendSms = {
            PhoneNumbers: phoneNumbers,
            Message: null
        };

        $scope.ok = function() {
            if ($scope.sendSms.Message == null || $scope.sendSms.Message == "") {
                toastr.warning('Enter a message to send');
            } else {
                EnquiryFactory.sendSms($scope.sendSms)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.warning('There was a problem encountered with the server!');
                        } else {
                            $uibModalInstance.close('SMS Sent Successfully');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$watch('sendSms.Message', function(newVal, oldVal) {
            if (newVal != undefined && newVal.length > 160) {
                $scope.sendSms.Message = oldVal;
            }
        });
    })
    .controller('EnquiryNotesController', function($scope, enq, $uibModalInstance) {
        $scope.enq = enq;

        $scope.ok = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });