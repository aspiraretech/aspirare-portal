angular.module('app')
    .controller('AddEventController', function($scope, EventsFactory, toastr, LoginFactory) {

        $scope.newEvent = {
            Id: null,
            Name: "",
            Description: "",
            VideoURL: "",
            EventDate: new Date(),
            CreatedBy: LoginFactory.loggedInUser.Id,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Images: []
        };
        $scope.dateInput = {
            min: moment().subtract(2, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.images = [];

        $scope.create = function() {
            if ($scope.newEvent.Name == "") {
                toastr.warning('Please enter name');
            } else {
                if ($scope.newEvent.VideoURL != "") {
                    $scope.newEvent.VideoURL = $scope.convertToEmbedURL($scope.newEvent.VideoURL);
                }
                $scope.newEvent.EventDate = moment($scope.newEvent.EventDate).format("YYYY-MM-DD");
                EventsFactory.createEvent($scope.newEvent)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not create event. Please try later!');
                        } else {
                            toastr.success('Event created successfully');
                            history.back();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.$watch('newEvent.Name', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newEvent.Name = oldVal;
            }
        });

        $scope.$watch('newEvent.VideoURL', function(newVal, oldVal) {
            if (newVal.length > 500) {
                $scope.newEvent.VideoURL = oldVal;
            }
        });

        $scope.$watch('newEvent.Description', function(newVal, oldVal) {
            if (newVal.length > 200) {
                $scope.newEvent.Description = oldVal;
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

        $scope.discardCreation = function() {
            history.back();
        };

        $scope.addImages = function() {
            cloudinary.openUploadWidget({ cloud_name: 'dzerq05zm', upload_preset: 'findinbox' },
                function(error, result) {
                    console.log(error, result)
                });
        };
    });