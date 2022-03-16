angular.module('app').factory('StudentsFactory', function($q, $http, LoginFactory) {
    var factory = {
        branchNameForReceipt: null,
        selectedStudent: null,
        selectedValues: {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        }
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllFeesCollected = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllFeesCollectedNew/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDevelopmentFeesCollected = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getDevelopmentFeesCollected/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentById = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getById/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentForApplicationVerification = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentForApplicationVerification/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getInstallMetrics = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getInstallMetrics/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.sendInstallReminder = function(notInstalled) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/sendInstallReminder',
            data: notInstalled,
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

    factory.getAllByCourseBranchSem = function(collegeId, courseId, branchId, semesterId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByCourseBranchSem/' + collegeId + '/' + courseId + '/' + branchId + '/' + semesterId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllGenders = function() {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/gender'
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentAttendance = function(studentId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/attendance/getAllByStudent/' + studentId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.editAttendance = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/editAttendanceForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            factory.isAuthenticated = false;
            d.reject(error);
        });
        return d.promise;
    };

    factory.admitStudent = function(newAdmission) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/student',
            data: newAdmission,
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

    factory.getDeactivatedStudents = function(collegeId, courseId, branchId, semesterId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getDeactivatedStudents/' + collegeId + '/' + courseId + '/' + branchId + '/' + semesterId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.approve = function(student) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/approve',
            data: student,
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

    factory.reject = function(student) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/reject',
            data: student,
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

    factory.updateStudent = function(newStudent) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student',
            data: newStudent,
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

    factory.resetPassword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/resetPassword',
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

    factory.getEnquiryDetails = function(enquiryId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/enquiry/getById/' + enquiryId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.promoteStudents = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/promoteStudents',
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

    factory.addPayment = function(payment) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addPayment',
            data: payment,
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

    factory.deletePayment = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deletePayment',
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

    factory.getDocumentsForCollege = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getDocumentsForCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getDocumentsForStudent = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getDocumentsForStudent/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllReceiptsForStudent = function(studentId, academicYear) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllReceiptsForStudent/' + studentId + '/' + academicYear
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addDocumentForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addDocumentToStudent',
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

    factory.deleteStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/student',
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

    factory.getAllPreviousMarks = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllPreviousMarksForStudent/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.addPreviousMarks = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addPreviousMarksToStudent',
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

    return factory;
});