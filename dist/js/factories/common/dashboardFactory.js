'use strict';

angular.module('app').factory('DashboardFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllCourses = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranches = function(courseId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch/getAllByCourse/' + courseId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemesters = function(branchId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranch/' + branchId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClasses = function(branchId, semesterId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySemester/' + branchId + '/' + semesterId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjectsForSemester = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllNonElectiveSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllNonElectiveBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSpecialSubjects = function(collegeId, courseId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/specialSubject/' + collegeId + '/' + courseId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSpecialClasses = function(specialSubjectId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/specialClass/getAllBySpecialSubject/' + specialSubjectId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getCollegeAttendanceStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getCollegeAttendanceStatistics',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getCollegeMarksStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getCollegeMarksStatisticsByIndexing',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllKeywords = function(collegeType) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllKeywords/' + collegeType
        }).then(function(success) {
            factory.keywords = success.data.Data[0];
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentMarksStatisticsForAllSubjects = function(classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentAcademicStatisticsByIndexing/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function(courseId, branchId, semesterId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemesterAndStudent/' + courseId + '/' + branchId + '/' + semesterId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getMarksStatistics = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsNew/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getMarksStatisticsForOBE = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsForOBE',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentMarksStatisticsForOBE = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsForOBE/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getMarksStatisticsForFaculty = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getMarksStatisticsNew',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAttendanceStatistics = function(subjectId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentAttendanceStatistics/' + subjectId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAttendanceStatisticsForFaculty = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAttendanceStatistics',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getClassStatsForSubject = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getClassStatsForSubject',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getSubjectStatsForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getSubjectStatsForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjectStatsForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllSubjectStatsForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllFeesKeywords = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllFeesKeywords/' + collegeId
        }).then(function(success) {
            factory.feesKeywords = success.data.Data[0];
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.calculateAverageWithWeightage = function(avg_of_tests, avg_of_exam, avg_of_quiz) {
        var average;
        if (avg_of_exam == 0) { // if there are no final exams
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // both quiz and test exist
                average = (avg_of_tests * 0.9) + (avg_of_quiz * 0.1);
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = avg_of_quiz; // 100% of quiz
                } else {
                    average = avg_of_tests; // 100% of tests
                }
            }
        } else {
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // if there are tests and quizzes and exam
                average = (((avg_of_tests * 0.4) + (avg_of_exam * 0.6)) * 0.9) + (avg_of_quiz * 0.1); // 90%(40% of tests + 60% of exam) + 10%(quiz)
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = (avg_of_quiz * 0.1) + (avg_of_exam * 0.9); // 10% of quiz + 90% of final exam
                } else {
                    average = (avg_of_tests * 0.4) + (avg_of_exam * 0.6); // 40% of tests + 60% of final exam
                }
            }
        }
        return average;
    };

    return factory;
});