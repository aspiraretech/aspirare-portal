angular.module('app')
    .controller('AddAssignmentController', function($scope, AssignmentFactory, toastr, LoginFactory, AssignmentFactory, SelectClassFactory) {

        $scope.newAssignment = {
            Id: null,
            Name: "",
            Description: "",
            VideoURL: "",
            DocumentURL: "",
            SubjectIds: SelectClassFactory.SubjectIds,
            ClassIds: SelectClassFactory.ClassIds,
            GivenBy: LoginFactory.loggedInUser.Id,
            Images: [],
            SubjectName: AssignmentFactory.selectedSubject.Name,
            IsElective: AssignmentFactory.selectedSubject.IsElective
        };
        $scope.students = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.publish = function() {
            if ($scope.newAssignment.Name == "") {
                toastr.warning('Please enter name of the share');
            } else {
                if ($scope.newAssignment.VideoURL != "") {
                    $scope.newAssignment.VideoURL = $scope.convertToEmbedURL($scope.newAssignment.VideoURL);
                }
                AssignmentFactory.publishAssignment($scope.newAssignment)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not create this share. Please try later!');
                        } else {
                            toastr.success('Assignment published successfully');
                            history.back();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.$watch('newAssignment.Name', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newAssignment.Name = oldVal;
            }
        });

        $scope.$watch('newAssignment.VideoURL', function(newVal, oldVal) {
            if (newVal.length > 500) {
                $scope.newAssignment.VideoURL = oldVal;
            }
        });

        $scope.$watch('newAssignment.Description', function(newVal, oldVal) {
            if (newVal.length > 200) {
                $scope.newAssignment.Description = oldVal;
            }
        });

        $scope.convertToEmbedURL = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return 'https://www.youtube.com/embed/' + match[2] + '?rel=0&amp;showinfo=0';
            } else {
                return 'error';
            }
        };

        $scope.discard = function() {
            history.back();
        };
    });