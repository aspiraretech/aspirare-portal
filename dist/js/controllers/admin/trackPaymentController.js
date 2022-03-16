angular.module('app')
    .controller('TrackPaymentController', function($scope, toastr, LoginFactory, DashboardFactory, NotificationsFactory, TrackPaymentFactory) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.courses = [];
        $scope.selected = {
            course: null,
            branch: null
        };
        $scope.years = [{
            year: moment().subtract(1, 'years').year() + "-" + moment().year()
        }, {
            year: moment().year() + "-" + moment().add(1, 'years').year()
        }];
        if (new Date().getMonth() <= 3) {
            $scope.academicYear = $scope.years[0].year;
        } else {
            $scope.academicYear = $scope.years[1].year;
        }

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];

            $scope.selected.course = null;
            $scope.selected.branch = null;

            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(course) {
            $scope.branches = [];

            $scope.selected.branch = null;

            DashboardFactory.getAllBranches(course.Id, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.branches = success.data.Data;
                        $scope.selected.branch = $scope.branches[0];
                        $scope.getFeesInfo($scope.selected.branch);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getFeesInfo = function() {
            $scope.students = [];
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                CourseId: $scope.selected.course.Id,
                BranchId: $scope.selected.branch.Id,
                AcademicYear: $scope.academicYear
            };
            TrackPaymentFactory.getFeesInfo(obj)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('Fees Structure has not been set for the selected criteria!');
                    } else {
                        $scope.students = success.data.Data;
                        $scope.students.forEach(function(student) {
                            student.IsSelected = true;
                        });
                        $scope.studentsToShow = angular.copy($scope.students);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.sendNotification = function() {
            $scope.deviceIds = $scope.studentsToShow.filter(x => x.IsSelected).map(x => x.DeviceId);
            $scope.fatherDeviceIds = $scope.studentsToShow.filter(x => x.IsSelected).map(x => x.FatherDeviceId);
            $scope.motherDeviceIds = $scope.studentsToShow.filter(x => x.IsSelected).map(x => x.MotherDeviceId);
            $scope.deviceIds = $scope.deviceIds.concat($scope.fatherDeviceIds).concat($scope.motherDeviceIds);
            $scope.deviceIds = [...new Set($scope.deviceIds)];
            $scope.deviceIds = $scope.deviceIds.filter(x => (x != "null" && x != null));
            var obj = {
                Id: null,
                Title: "Fees Reminder",
                Description: "Please pay the remaining fees",
                NotCode: "N003",
                VideoURL: null,
                DeviceIds: $scope.deviceIds,
                StudentIds: $scope.studentsToShow.filter(x => x.IsSelected).map(x => x.Id),
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

        $scope.getAllCourses();

    });