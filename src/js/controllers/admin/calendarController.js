angular.module('app')
    .controller('CalendarController', function($scope, toastr, CalendarFactory, LoginFactory) {
        $scope.calendarEvents = [];
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1)
        $scope.loggedInUser = LoginFactory.loggedInUser;
        var tomorrowsDate = new Date();
        tomorrowsDate.setDate(tomorrowsDate.getDate() + 2);

        $scope.newEvent = {
            Id: null,
            EventName: "",
            EventStartDate: currentDate,
            EventEndDate: tomorrowsDate,
            CollegeId: LoginFactory.loggedInUser.CollegeId
        };
        $scope.dateInput = {
            min: moment().add(1, 'days').format('YYYY-MM-DD'),
            max: moment().add(10, 'years').format('YYYY-MM-DD')
        };
        $scope.selected = {
            eventType: 1
        };

        $scope.getAllCalendarEvents = function() {
            $scope.calendarEvents = [];
            CalendarFactory.getAllCalendarEvents(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No events created yet!');
                    } else {
                        $scope.calendarEvents = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.delete = function(event) {
            var r = confirm("Are you sure you want to delete this event?");
            if (r == true) {
                CalendarFactory.deleteEvent(event)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Event could not be deleted. Please try later!');
                        } else {
                            toastr.success('Event deleted successfully from calendar');
                            $scope.getAllCalendarEvents();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.canShow = function(event) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var d = new Date(event.EventStartDate);
            d.setHours(0, 0, 0, 0);
            if (d >= today) {
                return true;
            } else {
                return false;
            }
        }

        $scope.isOneDayEvent = function(event) {
            if (new Date(event.EventStartDate).getTime() == new Date(event.EventEndDate).getTime()) {
                return true;
            } else {
                return false;
            }
        };

        $scope.create = function() {
            if ($scope.newEvent.EventName == "") {
                toastr.warning('Please enter the Name of the Calendar Event');
            } else {
                if ($scope.selected.eventType == 1) {
                    $scope.newEvent.EventEndDate = $scope.newEvent.EventStartDate;
                }
                if (new Date($scope.newEvent.EventStartDate) > new Date($scope.newEvent.EventEndDate)) {
                    toastr.warning('Start Date cannot be greater than End Date');
                } else {
                    CalendarFactory.addCalendarEvent($scope.newEvent)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.error('Could not create calendar event!');
                            } else {
                                toastr.info('Calendar Event created successfully');
                                $scope.getAllCalendarEvents();
                                $scope.newEvent = {
                                    Id: null,
                                    EventName: "",
                                    EventStartDate: tomorrowsDate,
                                    EventEndDate: tomorrowsDate,
                                    CollegeId: LoginFactory.loggedInUser.CollegeId
                                };
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                }
            }
        };

        $scope.$watch('newEvent.EventName', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newEvent.EventName = oldVal;
            }
        });

        $scope.getAllCalendarEvents();
    });