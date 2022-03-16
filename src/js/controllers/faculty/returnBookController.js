angular.module('app')
    .controller('ReturnBookController', function($scope, LibraryFactory, LoginFactory, toastr, NotificationsFactory, $filter) {

        $scope.borrowedBooks = [];
        $scope.searchText = null;

        $scope.getBorrowedBooks = function() {
            $scope.borrowedBooks = [];
            LibraryFactory.getBorrowedBooks(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        // toastr.warning('No books are issued yet');
                    } else {
                        $scope.borrowedBooks = success.data.Data;
                        $scope.booksToShow = angular.copy($scope.borrowedBooks);
                    }
                }, function(error) {
                    toastr.error('There was a problem. Please try later!');
                })
        };

        $scope.returnBook = function(book) {
            var r = confirm("Are you sure you want to return this book?");
            if (r == true) {
                LibraryFactory.returnBook(book)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('There was a problem. Please try later!');
                        } else {
                            toastr.success('Book return was successful');
                            $scope.getBorrowedBooks();
                        }
                    }, function(error) {
                        toastr.error('There was a problem. Please try later!');
                    });
            }
        };

        $scope.sendNotification = function(bb) {
            var obj = {
                Id: null,
                Title: "Book Return",
                Description: "Please return the book " + bb.Name + ", on or before " + moment(bb.ReturnDate).format("DD-MM-YYYY"),
                NotCode: "N004",
                VideoURL: null,
                DeviceIds: [bb.DeviceId],
                StudentIds: [bb.StudentId],
                ArticleId: null
            };
            NotificationsFactory.broadcastNotification(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        toastr.success('Notification has been sent successfully');
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.searchBooks = function(searchText) {
            $scope.booksToShow = $filter('filter')($scope.borrowedBooks, searchText);
        };

        $scope.getBorrowedBooks();
    });