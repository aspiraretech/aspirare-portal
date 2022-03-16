'use strict';
angular.module('app')
    .controller('AddTestController', function($scope, SelectClassFactory, LoginFactory, TestsFactory, toastr) {

        $scope.newTest = {
            Name: null,
            MaxMarks: null,
            TestDate: new Date(),
            GivenBy: LoginFactory.loggedInUser.Id,
            TestCategoryId: null,
            Students: [],
            IsFinal: false,
            SubjectName: SelectClassFactory.selected.subject.Name
        };
        $scope.dateInput = {
            min: moment().subtract(2, 'years').format('YYYY-MM-DD'),
            max: moment().format('YYYY-MM-DD')
        };

        $scope.students = SelectClassFactory.Students;
        for (var i = 0; i < $scope.students.length; i++) {
            $scope.students[i].Marks = null;
            $scope.students[i].IsAbsent = false;
        }

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.addTest = function() {
            if ($scope.newTest.Name == "" || $scope.newTest.Name == null ||
                $scope.newTest.MaxMarks == undefined || $scope.newTest.MaxMarks == null) {
                toastr.warning('Please enter all required information');
            } else {
                if ($scope.loggedInUser.PackageCode == 'LM' && ($scope.newTest.TestCategoryId == undefined || $scope.newTest.TestCategoryId == null)) {
                    toastr.warning('Please enter all required information');
                } else {
                    var flag = 0;
                    for (var i = 0; i < $scope.students.length; i++) {
                        if (!$scope.students[i].IsAbsent) {
                            if ($scope.students[i].Marks == null || $scope.students[i].Marks == undefined || ($scope.students[i].Marks > $scope.newTest.MaxMarks)) {
                                toastr.warning('Please enter a valid score or mark absent');
                                flag = 1;
                            }
                        }
                    }
                    if (!flag) {
                        for (var i = 0; i < $scope.students.length; i++) {
                            $scope.newTest.Students.push({
                                StudentId: $scope.students[i].Id,
                                IsAbsent: $scope.students[i].IsAbsent,
                                Marks: $scope.students[i].Marks,
                                ResultPercentage: ($scope.students[i].Marks / $scope.newTest.MaxMarks) * 100,
                                DeviceId: $scope.students[i].DeviceId,
                                FatherDeviceId: $scope.students[i].FatherDeviceId,
                                SubjectId: SelectClassFactory.selected.subject.Id,
                                ClassId: $scope.students[i].ClassId
                            });
                            if (SelectClassFactory.selected.subject.IsElective == "true") {
                                $scope.newTest.Students[i].SubjectId = $scope.students[i].NormalSubjectId
                            }
                        }
                        $scope.newTest.TestDate = moment($scope.newTest.TestDate).format('YYYY-MM-DD');
                        TestsFactory.createTest($scope.newTest)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.error('Could not create assessment. Please try later');
                                } else {
                                    toastr.success('Test created successfully');
                                    history.back();
                                }
                            }, function(error) {
                                toastr.error(error);
                            });
                    }
                }
            }
        };

        $scope.isMarksMoreThanMaxMarks = function(student, index) {
            if (parseFloat(student.Marks) > parseInt($scope.newTest.MaxMarks)) {
                toastr.warning('Marks should be less than or equal to Max Marks');
                $scope.students[index].Marks = "";
            }
        };

        $scope.discard = function() {
            history.back();
        };
    });