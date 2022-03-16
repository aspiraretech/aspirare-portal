angular.module('app')
    .controller('FacultyPerformanceController', function($scope, UsersFactory, toastr, DashboardFactory, SelectClassFactory, LearningOutcomeFactory) {
        $scope.subjects = [];
        $scope.seleced = {
            subject: null,
            class: null
        };
        $scope.user = UsersFactory.selectedUser;
        $scope.chapters = [];
        $scope.keywords = DashboardFactory.keywords;

        $scope.dateRange = {
            startDate: moment().subtract(1, 'year').toISOString(),
            endDate: moment().toISOString()
        };

        $scope.classSelected = function() {
            var obj = {
                SubjectId: $scope.selected.subject.Id,
                ClassId: $scope.selected.class.Id,
                DateRange: $scope.dateRange
            };
            LearningOutcomeFactory.getLessonPlan(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('No lesson plan added yet');
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllSubjectsForUser = function() {
            SelectClassFactory.getAllSubjectsForUser(UsersFactory.selectedUser.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no subjects assigned to this user');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.subjectSelected = function() {
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            SelectClassFactory.getAllClassesForSubject($scope.selected.subject.Id, UsersFactory.selectedUser.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no classes assigned for the subject!');
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.toggleChapter = function(chapter) {
            chapter.show = !chapter.show;
            for (var i = 0; i < $scope.chapters.length; i++) {
                if ($scope.chapters[i].Id != chapter.Id) {
                    $scope.chapters[i].show = false;
                }
            }
        };

        $scope.isChapterShown = function(chapter) {
            return chapter.show;
        };

        $scope.getAllSubjectsForUser();
    });