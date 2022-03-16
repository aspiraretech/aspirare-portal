angular.module('app')
    .controller('BookHistoryController', function($scope, toastr, LoginFactory, LibraryFactory) {

        $scope.booksHistory = [];

        $scope.getAllBooksHistory = function() {
            LibraryFactory.getAllBooksHistory(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get the details, please try later!');
                    } else {
                        $scope.booksHistory = success.data.Data
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.exportToXLS = function() {
            var data_type = 'data:application/vnd.ms-excel';
            var table_div = document.getElementById('book-list');
            var table_html = table_div.outerHTML.replace(/ /g, '%20');

            var a = document.createElement('a');
            a.href = data_type + ', ' + table_html;
            a.download = 'Book History.xls';
            a.click();
        };

        $scope.getAllBooksHistory();
    });