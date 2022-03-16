angular.module('app')
    .controller('ExpenseController', function($scope, LoginFactory, toastr, ExpensesFactory) {
        $scope.expenses = [];
        $scope.sumOfExpenses = 0;
        $scope.selected = {
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            DateRange: {
                startDate: moment().subtract(1, 'month').toISOString(),
                endDate: moment().add(1, 'days').toISOString()
            }
        };
        $scope.options = {
            locale: {
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            opens: 'left',
            startDate: moment(),
            endDate: moment().add(1, 'year'),
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }
        $scope.dateInput = {
            min: moment().subtract(2, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };
        $scope.newExpense = {
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Particulars: null,
            Amount: null,
            ExpenseDate: new Date()
        };

        $scope.getAllExpenses = function() {
            $scope.expenses = [];
            ExpensesFactory.getAllExpenses($scope.selected)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No expenses have been entered yet!');
                    } else {
                        $scope.expenses = success.data.Data;
                    }
                    $scope.sumOfExpenses = 0;
                    for (var i = 0; i < $scope.expenses.length; i++) {
                        $scope.sumOfExpenses += $scope.expenses[i].Amount;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.deleteExpense = function(expense) {
            var r = confirm("Are you sure you want to delete this expense?");
            if (r == true) {
                ExpensesFactory.deleteExpense(expense)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete expense. Please try later!');
                        } else {
                            toastr.success('Expense was deleted successfully');
                            $scope.getAllExpenses();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.addExpense = function() {
            if ($scope.newExpense.Particulars == "" || $scope.newExpense.Particulars == null ||
                $scope.newExpense.Amount == "" || $scope.newExpense.Amount == undefined) {
                toastr.warning('Please enter all the details');
            } else {
                if ($scope.newExpense.ExpenseDate == undefined) {
                    $scope.newExpense.ExpenseDate = new Date();
                }
                ExpensesFactory.addExpense($scope.newExpense)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not add expense. Please try later!');
                        } else {
                            toastr.success('Expense added successfully');
                            $scope.newExpense.Particulars = null;
                            $scope.newExpense.Amount = null;
                            $scope.newExpense.ExpenseDate = new Date();
                            $scope.getAllExpenses();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.$watch("selected.DateRange", function(newValue, oldValue) {
            if (newValue.startDate != moment().subtract(1, 'month').toISOString()) {
                $scope.getAllExpenses();
            }
        });

        $scope.getAllExpenses();
    });