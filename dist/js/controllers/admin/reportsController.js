angular.module('app')
    .controller('ReportsController', function($scope, toastr, ReportsFactory, DashboardFactory, LoginFactory, StudentsFactory, TestsFactory, CriteriaFactory, $filter) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null,
            subjectId: null
        };

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.subjects = [];

        $scope.students = [];

        $scope.tests = [];

        $scope.primeSkills = [];

        let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);

        $scope.allCriterias = function() {
            var allCriterias = [],
                criteriaCount = 0;
            for (var k = 0; k < $scope.primeSkills.length; k++) {
                criteriaCount = 0;
                for (var j = 0; j < $scope.primeSkills[k].Test.Criterias.length; j++) {
                    allCriterias.push($scope.primeSkills[k].Test.Criterias[j]);
                    criteriaCount++;
                }
                $scope.primeSkills[k].Colspan = criteriaCount;
            }
            return allCriterias;
        };

        $scope.identifyPrimeSkill = function() {
            $scope.primeSkills = [];
            for (var i = 0; i < $scope.tests.length; i++) {
                var individualTags = [];
                for (var j = 0; j < $scope.tests[i].Criterias.length; j++) {
                    individualTags = individualTags.concat($scope.tests[i].Criterias[j].Tags.split(','));
                }
                var duplicates = findDuplicates(individualTags);
                var uniqueDuplicates = duplicates.filter((x, i, a) => a.indexOf(x) == i);

                //add tests under the primeskill
                $scope.primeSkills.push({
                    Name: uniqueDuplicates[0],
                    Test: $scope.tests[i]
                });
            }
        };

        $scope.getCriteriaScores = function() {
            var testsScanned = 0;
            angular.forEach($scope.tests, function(test, testIndex) {
                test.Criterias = [];
                angular.forEach($scope.students, function(student, studentIndex) {
                    CriteriaFactory.getAllCriteriaForStudentAndTest(student.Id, test.Id)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.info('There are no questions entered for this assessment!');
                            } else {
                                student.CriteriaScores = student.CriteriaScores.concat(success.data.Data);
                                if (test.Criterias.length == 0) {
                                    $scope.tests[testIndex].Criterias = success.data.Data;
                                    if (++testsScanned == $scope.tests.length) {
                                        $scope.identifyPrimeSkill();
                                    }
                                }
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                });
            });
        };

        $scope.getAllTests = function() {
            var obj = {
                SubjectIds: [$scope.selected.subjectId],
                ClassIds: [$scope.selected.classId],
                ConductedTestsOnly: false //its always false
            };
            TestsFactory.getAllTests(obj)
                .then(function(success) {
                    $scope.tests = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No tests have been created yet!');
                    } else {
                        $scope.tests = $filter('orderBy')(success.data.Data, 'TestDate');
                        $scope.getCriteriaScores();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        //course branch semester
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
            $scope.subjects = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getSemesters(branchId);
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.classId = null;
            $scope.selected.subjectId = null;
            $scope.getClasses(semesterId);
            $scope.getSubjects(semesterId);
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

        $scope.getSubjects = function(semesterId) {
            DashboardFactory.getAllSubjectsForSemester($scope.selected.courseId, $scope.selected.branchId, semesterId)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        toastr.warning('There was a problem encountered with the server!');
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    toastr.success(error);
                });
        };

        $scope.getStudents = function() {
            $scope.students = [];
            StudentsFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId, $scope.selected.classId)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        toastr.info('No students found!');
                    } else {
                        $scope.students = success.data.Data;
                        angular.forEach($scope.students, function(student) {
                            student.CriteriaScores = [];
                        });
                        $scope.getAllTests();
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };
        $scope.getAllCourses();

    })
    .filter('showFirstCharacter', function() {
        return function(input) {
            return input.charAt(0);
        }
    });;