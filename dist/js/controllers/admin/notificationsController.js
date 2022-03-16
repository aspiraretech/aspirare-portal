angular.module('app')
    .controller('NotificationsController', function($scope, LoginFactory, NotificationsFactory, toastr, DashboardFactory) {
        $scope.notification = {
            Title: "",
            Description: "",
            VideoURL: null,
            ImageURL: null,
            SMSBroadcastAvailable: LoginFactory.loggedInUser.SMSBroadcastAvailable == "1" ? true : false
        };
        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        };

        $scope.sendFeesNotification = function() {
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId
            };
            NotificationsFactory.sendFeesNotification(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not send fees reminder. Please try later!');
                    } else {
                        toastr.success('Notification sent successfully');
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.sendCustomNotification = function() {
            if ($scope.notification.Title == "" || $scope.notification.Description == "") {
                toastr.warning('Please enter a title and description to send');
            } else {
                var obj = {
                    Notification: $scope.notification,
                    Target: {
                        CollegeId: LoginFactory.loggedInUser.CollegeId,
                        CourseId: $scope.selected.courseId,
                        BranchId: $scope.selected.branchId,
                        SemesterId: $scope.selected.semesterId,
                        ClassId: $scope.selected.classId
                    }
                }
                NotificationsFactory.sendCustomNotification(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not send notification. Please try later!');
                        } else {
                            toastr.success('Notification sent Successfully');
                            $scope.notification.Title = "";
                            $scope.notification.Description = "";
                        }
                    }, function(error) {
                        toastr.error(error);
                    })
            }
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.selected.classId = null;
            $scope.getClasses(semesterId);
        };

        $scope.getBranches = function(courseId) {
            DashboardFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getSemesters = function(branchId) {
            DashboardFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getClasses = function(semesterId) {
            DashboardFactory.getAllClasses($scope.selected.branchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.$watch('notification.Title', function(newVal, oldVal) {
            if (newVal.length > 100) {
                $scope.notification.Title = oldVal;
            }
        });

        $scope.$watch('notification.Description', function(newVal, oldVal) {
            if (newVal.length > 160) {
                $scope.notification.Description = oldVal;
            }
        });

        $scope.getAllCourses();
    });