angular.module('app')
    .controller('EventsController', function($scope, $state, LoginFactory, EventsFactory, $sce, toastr, $filter) {
        $scope.events = [];
        $scope.years = [];
        $scope.currentYear = EventsFactory.currentYear;
        $scope.descriptionToShow = {
            text: null
        };
        $scope.selected = {
            year: null
        };
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.createdAt = moment(LoginFactory.loggedInUser.CreatedAt).format('YYYY');

        $scope.addEvent = function() {
            $state.go('app.addEvent');
        };

        $scope.getAllEvents = function(year) {
            $scope.events = [];
            EventsFactory.getAllEvents(LoginFactory.loggedInUser.CollegeId, year)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info("Nothing has been shared yet!");
                    } else {
                        $scope.events = $filter('orderBy')(success.data.Data, '-CreatedAt');
                        $scope.selectedEvent = $scope.events[0];
                        if ($scope.selectedEvent.VideoURL != "" || $scope.selectedEvent.VideoURL != null) {
                            $scope.selectedEvent.VideoURL = $sce.trustAsResourceUrl($scope.selectedEvent.VideoURL);
                        }
                        $scope.getImagesForEvent();
                        $scope.descriptionToShow.text = $sce.trustAsHtml($scope.convertLinksToAnchor());
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getImagesForEvent = function() {
            EventsFactory.getEventImages($scope.selectedEvent.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info("There are no images attached for this news or event!");
                    } else {
                        $scope.selectedEvent.Images = success.data.Data;
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
            if (year != undefined) {
                $scope.currentYear = year;
                $scope.getAllEvents(year);
            }
        };

        $scope.eventSelected = function(event) {
            $scope.selectedEvent = event;
            if (($scope.selectedEvent.VideoURL != "" || $scope.selectedEvent.VideoURL != null) && typeof($scope.selectedEvent.VideoURL) != 'string') {
                $scope.selectedEvent.VideoURL = $sce.trustAsResourceUrl($scope.selectedEvent.VideoURL);
            }
            $scope.getImagesForEvent();
            $scope.descriptionToShow.text = $sce.trustAsHtml($scope.convertLinksToAnchor());
        };

        $scope.convertLinksToAnchor = function() {
            var str = $scope.selectedEvent.Description;
            var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
            var result = str.replace(urlRegEx, "<a href='$1' target='_blank'>$1</a>");
            return result;
        };

        $scope.deleteEvent = function() {
            var r = confirm("Are you sure you want to delete this event?");
            if (r == true) {
                EventsFactory.deleteEvent($scope.selectedEvent)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('There was a problem deleting this event!');
                        } else {
                            toastr.success('Event deleted successfully');
                            $scope.getAllEvents($scope.currentYear);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllEvents($scope.currentYear);
        $scope.getYearList();
    });