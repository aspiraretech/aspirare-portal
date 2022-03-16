'use strict';
angular.module('app')
    .controller('AddBookController', function($scope, $state, LoginFactory, LibraryFactory, toastr, $stateParams) {

        $scope.isEdit = $stateParams.isEdit == "true" ? true : false;
        if ($scope.isEdit) {
            $scope.newBook = LibraryFactory.selectedBook;
        } else {
            $scope.newBook = {
                Id: null,
                Name: null,
                Author: null,
                SecondAuthor: null,
                AccessionNumber: null,
                IssueOrReference: null,
                Edition: null,
                Place: null,
                Publisher: null,
                Year: null,
                ISBN: null,
                Suppliers: null,
                Price: null,
                InvoiceNumber: null,
                Remarks: null,
                Department: null,
                PurchasedOrGift: null,
                CallNo: null,
                CollegeId: LoginFactory.loggedInUser.CollegeId
            };
        }

        $scope.books = [];

        $scope.addBook = function() {
            if ($scope.newBook.Name == null || $scope.newBook.Author == null) {
                toastr.warning('Book Name and Author cannot be empty');
            } else {
                LibraryFactory.addBook($scope.newBook)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Book was added successfully');
                            $scope.newBook = {
                                Id: null,
                                Name: null,
                                Author: null,
                                SecondAuthor: null,
                                AccessionNumber: null,
                                IssueOrReference: null,
                                Edition: null,
                                Publisher: null,
                                Place: null,
                                Year: null,
                                ISBN: null,
                                Suppliers: null,
                                Price: null,
                                InvoiceNumber: null,
                                Remarks: null,
                                Department: null,
                                PurchasedOrGift: null,
                                CallNo: null,
                                CollegeId: LoginFactory.loggedInUser.CollegeId
                            };
                            $state.go('app.library.bookList');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };


        $scope.editBook = function() {
            if ($scope.newBook.Name == null || $scope.newBook.Author == null) {
                toastr.warning('Book Name and Author cannot be empty');
            } else {
                delete $scope.newBook.CreatedAt;
                delete $scope.newBook.UpdatedAt;
                delete $scope.newBook.CollegeId;
                LibraryFactory.updateBook($scope.newBook)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('Book was updated successfully');
                            $state.go('app.library.bookList');
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.discard = function() {
            $state.go('app.library.bookList');
        };

    });