'use strict';
angular.module('app')
    .controller('BookListController', function($scope, $state, LoginFactory, LibraryFactory, toastr, $uibModal, $filter) {

        $scope.books = [];
        $scope.app_base = LoginFactory.getAppBase();
        $scope.searchText = null;

        $scope.getAvailableBooks = function() {
            $scope.books = [];
            LibraryFactory.getAllAvailableBooks(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There are no books available!');
                    } else {
                        $scope.books = success.data.Data;
                        $scope.booksToShow = angular.copy($scope.books);
                    }
                }, function(error) {
                    toastr.error('There was a problem. Please try later!');
                })
        };

        $scope.deleteBook = function(book) {
            var r = confirm("Are you sure you want to delete this book?");
            if (r == true) {
                LibraryFactory.deleteBook(book)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Book was deleted successfully');
                            $scope.getAvailableBooks();
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.issueBook = function(selectedBook) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.app_base + 'views/templates/IssueBookTemplate.html',
                controller: 'IssueBookController',
                resolve: {
                    book: function() {
                        return selectedBook;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getAvailableBooks();
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.editBook = function(book) {
            LibraryFactory.selectedBook = book;
            $state.go('app.library.addBook', { isEdit: true });
        };

        $scope.searchBooks = function(searchText) {
            $scope.booksToShow = $filter('filter')($scope.books, searchText);
        };

        $scope.getAvailableBooks();
    })
    .controller('IssueBookController', function($scope, $state, book, $uibModalInstance, LibraryFactory, LoginFactory, toastr) {

        $scope.selected = {
            book: book,
            student: null,
            returnDate: new Date()
        };

        $scope.ok = function() {
            if ($scope.selected.student == null || $scope.selected.book == null) {
                toastr.warning('Please select a student and a book!');
            } else {
                var obj = {
                    StudentId: $scope.selected.student.Id,
                    DeviceId: $scope.selected.student.DeviceId,
                    BookId: $scope.selected.book.Id,
                    BookName: $scope.selected.book.Name,
                    BorrowDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    ReturnDate: moment($scope.selected.returnDate).format('YYYY-MM-DD HH:mm:ss')
                };
                LibraryFactory.issueBook(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('There was a problem. Please try later!');
                        } else {
                            toastr.success('Book issue was successful');
                            $uibModalInstance.close();
                        }
                    }, function(error) {
                        toastr.error('There was a problem. Please try later!');
                    });
            }
        };

        $scope.searchStudent = function() {
            $scope.selected.student = null;
            LibraryFactory.getStudentByPhoneNumber($scope.entered.phoneNumber, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('Student with the Phone Number does not exist');
                    } else {
                        $scope.selected.student = success.data.Data[0];
                    }
                }, function(error) {
                    toastr.error('There was a problem. Please try later!');
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });