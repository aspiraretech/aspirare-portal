angular.module('app')
    .controller('AssignmentsController', function($scope, $state, AssignmentFactory, DashboardFactory, SelectClassFactory, LoginFactory, $sce, toastr, $filter) {
        $scope.assignments = [];
        $scope.selectedAssignment = null;
        $scope.descriptionToShow = {
            text: null
        };
        $scope.years = [];
        $scope.currentYear = AssignmentFactory.currentYear;
        $scope.createdAt = moment(LoginFactory.loggedInUser.CreatedAt).format('YYYY');
        $scope.isEdit = false;
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.keywords = DashboardFactory.keywords;
        $scope.app_base = LoginFactory.getAppBase();
        $scope.selected = {
            subject: null,
            class: null,
            year: null
        };
        if ($scope.loggedInUser.Role == 'FACULTY') {
            $scope.selected.subject = SelectClassFactory.selected.subject;
            $scope.selected.class = SelectClassFactory.selected.class;
        }

        $scope.getAllAssignments = function(year) {
            if ($scope.loggedInUser.Role == 'ADMIN') {
                AssignmentFactory.getAllAssignments(LoginFactory.loggedInUser.CollegeId, year)
                    .then(function(success) {
                        $scope.assignments = [];
                        if (success.data.Code != "S001") {
                            toastr.info('Nothing has been shared yet!');
                        } else {
                            $scope.assignments = $filter('orderBy')(success.data.Data, '-CreatedAt');
                            $scope.selectedAssignment = $scope.assignments[0];
                            if ($scope.selectedAssignment.VideoURL != "" || $scope.selectedAssignment.VideoURL != null) {
                                $scope.selectedAssignment.VideoURL = $sce.trustAsResourceUrl($scope.selectedAssignment.VideoURL);
                            }
                            $scope.getImagesForAssignment();
                            $scope.descriptionToShow.text = $sce.trustAsHtml($scope.convertLinksToAnchor());
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                var obj = {
                    SubjectIds: SelectClassFactory.SubjectIds,
                    ClassIds: SelectClassFactory.ClassIds,
                    Year: year
                };
                AssignmentFactory.getAllAssignmentsForSubject(obj)
                    .then(function(success) {
                        $scope.assignments = [];
                        if (success.data.Code != "S001") {
                            toastr.info('Nothing has been shared yet!');
                        } else {
                            $scope.assignments = $filter('orderBy')(success.data.Data, '-CreatedAt');
                            $scope.selectedAssignment = $scope.assignments[0];
                            if ($scope.selectedAssignment.VideoURL != "" || $scope.selectedAssignment.VideoURL != null) {
                                $scope.selectedAssignment.VideoURL = $sce.trustAsResourceUrl($scope.selectedAssignment.VideoURL);
                            }
                            $scope.getImagesForAssignment();
                            $scope.descriptionToShow.text = $sce.trustAsHtml($scope.convertLinksToAnchor());
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getImagesForAssignment = function() {
            AssignmentFactory.getAssignmentImages($scope.selectedAssignment.Id)
                .then(function(success) {
                    $scope.selectedAssignment.Images = [];
                    if (success.data.Code != "S001") {
                        toastr.info('There are no images attached for this share');
                    } else {
                        $scope.selectedAssignment.Images = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getYearList = function() {
            for (var i = parseInt($scope.createdAt); i <= new Date().getFullYear(); i++) {
                $scope.years.push(i);
            }
            $scope.selected.year = $scope.years[$scope.years.length - 1];
        };

        $scope.yearSelected = function(year) {
            if (year != null) {
                $scope.currentYear = year;
                $scope.getAllAssignments(year);
            }
        };

        $scope.assignmentSelected = function(assignment) {
            $scope.selectedAssignment = assignment;
            if ($scope.selectedAssignment.VideoURL != "" || $scope.selectedAssignment.VideoURL != null) {
                $scope.selectedAssignment.VideoURL = $sce.trustAsResourceUrl($scope.selectedAssignment.VideoURL);
            }
            $scope.getImagesForAssignment();
            $scope.descriptionToShow.text = $sce.trustAsHtml($scope.convertLinksToAnchor());
        };

        $scope.viewDocument = function() {
            window.open($scope.selectedAssignment.DocumentURL);
        };

        $scope.convertLinksToAnchor = function() {
            var str = $scope.selectedAssignment.Description;
            var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
            var result = str.replace(urlRegEx, "<a href='$1' target='_blank'>$1</a>");
            return result;
        };

        $scope.deleteAssignment = function() {
            var r = confirm("Are you sure you want to delete this event?");
            if (r == true) {
                AssignmentFactory.deleteAssignment($scope.selectedAssignment)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('There was a problem deleting this share!');
                        } else {
                            toastr.success('Share deleted successfully');
                            $scope.getAllAssignments($scope.currentYear);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.toggleEditMode = function() {
            $scope.isEdit = !$scope.isEdit;
            if ($scope.isEdit) {
                $scope.editedAssignment = angular.copy($scope.selectedAssignment);
            }
        };

        $scope.update = function() {
            if ($scope.editedAssignment.Name == "") {
                toastr.warning('Please enter Name of the Assignment');
            } else {
                if ($scope.editedAssignment.VideoURL != "" && typeof($scope.editedAssignment.VideoURL) == 'string') {
                    $scope.editedAssignment.VideoURL = $scope.convertToEmbedURL($scope.editedAssignment.VideoURL);
                } else if ($scope.editedAssignment.VideoURL != "" && typeof($scope.editedAssignment.VideoURL) == 'object') {
                    $scope.editedAssignment.VideoURL = $sce.getTrustedResourceUrl($scope.editedAssignment.VideoURL);
                }
                AssignmentFactory.updateAssignment($scope.editedAssignment)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not update assignment. Please try later!');
                        } else {
                            toastr.success('Assignment updated successfully');
                            $scope.toggleEditMode();
                            $scope.getAllAssignments($scope.currentYear);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.convertToEmbedURL = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return 'https://www.youtube.com/embed/' + match[2] + '?rel=0&amp;showinfo=0';
            } else {
                return 'error';
            }
        };

        $scope.getUniqueIds = function(array, key) {
            return AssignmentFactory.Students.reduce(function(carry, item) {
                if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
                return carry;
            }, []);
        };

        $scope.createAssignment = function() {
            AssignmentFactory.selectedSubject = $scope.selected.subject;
            AssignmentFactory.selectedClass = $scope.selected.class;
            $state.go('app.addAssignment');
        };

        $scope.getYearList();
        $scope.getAllAssignments($scope.currentYear);

    });