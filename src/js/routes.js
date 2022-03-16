angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

        $urlRouterProvider.otherwise('/login');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: true
        });

        $breadcrumbProvider.setOptions({
            prefixStateName: 'app.main',
            includeAbstract: true,
            template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
        });

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'views/common/layouts/full.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Flags',
                            files: ['node_modules/flag-icon-css/css/flag-icon.min.css']
                        }, {
                            serie: true,
                            name: 'Font Awesome',
                            files: ['node_modules/font-awesome/css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
                        }]);
                    }]
                }
            })
            .state('app.main', {
                url: '/dashboard',
                templateUrl: 'views/main.html',
                ncyBreadcrumb: {
                    label: 'Dashboard',
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['js/controllers/main.js']
                        });
                    }]
                }
            })
            .state('app.users', {
                url: '/users',
                templateUrl: 'views/admin/users.html',
                controller: 'UsersController',
                ncyBreadcrumb: {
                    label: 'Users',
                }
            })
            .state('app.onlineClass', {
                url: '/onlineClass',
                templateUrl: 'views/admin/onlineClass.html',
                controller: 'OnlineClassController',
                ncyBreadcrumb: {
                    label: 'OnlineClass',
                }
            })
            .state('app.addUser', {
                url: '/addUser',
                templateUrl: 'views/admin/addUser.html',
                controller: 'AddUserController',
                ncyBreadcrumb: {
                    label: 'Add User',
                }
            })
            .state('app.updateUser', {
                url: '/updateUser',
                templateUrl: 'views/admin/updateUser.html',
                controller: 'UpdateUserController',
                ncyBreadcrumb: {
                    label: 'Update User',
                }
            })
            .state('app.timeTable', {
                url: '/createTimetable',
                templateUrl: 'views/admin/createTimetable.html',
                controller: 'CreateTimetableController',
                ncyBreadcrumb: {
                    label: 'Time Table',
                }
            })
            .state('app.students', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Students',
                }
            })
            .state('app.students.viewStudents', {
                url: '/viewStudents',
                templateUrl: 'views/admin/students.html',
                controller: 'StudentsController',
                ncyBreadcrumb: {
                    label: 'View Students',
                }
            })
            .state('app.students.addStudent', {
                url: '/addStudent/:flag', //flag is 1 for add, 2 for edit, 3 for converting enquiry to admission
                templateUrl: 'views/admin/addStudent.html',
                controller: 'AddStudentController',
                ncyBreadcrumb: {
                    label: 'Add Student',
                }
            })
            .state('app.students.feesCollection', {
                url: '/feesCollection',
                templateUrl: 'views/admin/feesCollection.html',
                controller: 'FeesCollectionController',
                ncyBreadcrumb: {
                    label: 'Fees Collection',
                }
            })
            .state('app.students.updateFees', {
                url: '/updateFees',
                templateUrl: 'views/admin/updateFees.html',
                controller: 'UpdateFeesController',
                ncyBreadcrumb: {
                    label: 'Update Fees',
                }
            })
            .state('app.students.trackPayment', {
                url: '/trackPayment',
                templateUrl: 'views/admin/trackPayment.html',
                controller: 'TrackPaymentController',
                ncyBreadcrumb: {
                    label: 'Track Payment',
                }
            })
            .state('app.students.activateStudents', {
                url: '/activateStudents',
                templateUrl: 'views/admin/activateStudents.html',
                controller: 'ActivateStudentsController',
                ncyBreadcrumb: {
                    label: 'Activate Students',
                }
            })
            .state('app.students.studentDashboard', {
                url: '/studentDashboard',
                templateUrl: 'views/admin/studentDashboard.html',
                controller: 'StudentDashboardController',
                ncyBreadcrumb: {
                    label: 'Student Dashboard',
                }
            })
            .state('app.students.enquiry', {
                url: '/enquiry',
                templateUrl: 'views/admin/enquiry.html',
                controller: 'EnquiryController',
                ncyBreadcrumb: {
                    label: 'Enquiry',
                }
            })
            .state('app.students.addEnquiry', {
                url: '/addEnquiry/:isEdit',
                templateUrl: 'views/admin/addEnquiry.html',
                controller: 'AddEnquiryController',
                ncyBreadcrumb: {
                    label: 'Add Enquiry',
                }
            })
            .state('app.students.assignStudentsToElectives', {
                url: '/assignStudentsToElectives',
                templateUrl: 'views/admin/assignStudentsToElectives.html',
                controller: 'AssignStudentsToElectivesController',
                ncyBreadcrumb: {
                    label: 'Manage Electives',
                }
            })
            .state('app.students.assignStudentsToSections', {
                url: '/assignStudentsToSections',
                templateUrl: 'views/admin/assignStudentsToSections.html',
                controller: 'AssignStudentsToSectionsController',
                ncyBreadcrumb: {
                    label: 'Manage Sections',
                }
            })
            .state('app.students.verifyApplication', {
                url: '/verifyApplication/:StudentId',
                templateUrl: 'views/admin/verifyApplication.html',
                controller: 'VerifyApplicationController',
                ncyBreadcrumb: {
                    label: 'Verify Application',
                }
            })
            .state('app.assignment', {
                url: '/assignment',
                templateUrl: 'views/admin/assignments.html',
                controller: 'AssignmentsController',
                ncyBreadcrumb: {
                    label: 'Shared with Class',
                }
            })
            .state('app.events', {
                url: '/events',
                templateUrl: 'views/admin/events.html',
                controller: 'EventsController',
                ncyBreadcrumb: {
                    label: 'Events',
                }
            })
            .state('app.addEvent', {
                url: '/addEvent',
                templateUrl: 'views/admin/addEvent.html',
                controller: 'AddEventController',
                ncyBreadcrumb: {
                    label: 'Add News or Events',
                }
            })
            .state('app.calendar', {
                url: '/calendar',
                templateUrl: 'views/admin/calendar.html',
                controller: 'CalendarController',
                ncyBreadcrumb: {
                    label: 'Calendar',
                }
            })
            .state('app.notifications', {
                url: '/notifications',
                templateUrl: 'views/admin/notifications.html',
                controller: 'NotificationsController',
                ncyBreadcrumb: {
                    label: 'Notifications',
                }
            })
            .state('app.expense', {
                url: '/expense',
                templateUrl: 'views/admin/expense.html',
                controller: 'ExpenseController',
                ncyBreadcrumb: {
                    label: 'Expense',
                }
            })
            .state('app.busRoute', {
                url: '/busRoute',
                templateUrl: 'views/admin/busRoute.html',
                controller: 'BusRouteController',
                ncyBreadcrumb: {
                    label: 'Routes',
                }
            })
            .state('app.createBusRoute', {
                url: '/createBusRoute',
                templateUrl: 'views/admin/createBusRoute.html',
                controller: 'CreateBusRouteController',
                ncyBreadcrumb: {
                    label: 'Create Bus Route',
                }
            })
            .state('app.tests', {
                url: '/tests',
                templateUrl: 'views/faculty/tests.html',
                controller: 'TestsController',
                ncyBreadcrumb: {
                    label: 'Assessments',
                }
            })
            .state('app.addAssignment', {
                url: '/addAssignment',
                templateUrl: 'views/faculty/addAssignment.html',
                controller: 'AddAssignmentController',
                ncyBreadcrumb: {
                    label: 'Add Assignment',
                }
            })
            .state('app.addTest', {
                url: '/addTest',
                templateUrl: 'views/faculty/addTest.html',
                controller: 'AddTestController',
                ncyBreadcrumb: {
                    label: 'Create Assessment',
                }
            })
            .state('app.questionPaper', {
                url: '/questionPaper',
                templateUrl: 'views/faculty/questionPaper.html',
                controller: 'QuestionPaperController',
                ncyBreadcrumb: {
                    label: 'Question Paper',
                }
            })
            .state('app.attendance', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Attendance',
                }
            })
            .state('app.attendance.takeAttendance', {
                url: '/takeAttendance',
                templateUrl: 'views/faculty/takeAttendance.html',
                controller: 'TakeAttendanceController',
                ncyBreadcrumb: {
                    label: 'Take Attendance',
                }
            })
            .state('app.attendance.viewAttendance', {
                url: '/viewAttendance',
                templateUrl: 'views/admin/viewAttendance.html',
                controller: 'ViewAttendanceController',
                ncyBreadcrumb: {
                    label: 'View Attendance',
                }
            })
            .state('app.attendance.consolidatedAttendance', {
                url: '/consolidatedAttendance',
                templateUrl: 'views/admin/consolidatedAttendance.html',
                controller: 'ConsolidatedAttendanceController',
                ncyBreadcrumb: {
                    label: 'Consolidate Attendance',
                }
            })
            .state('app.attendance.manageAttendance', {
                url: '/manageAttendance',
                templateUrl: 'views/admin/manageAttendance.html',
                controller: 'ManageAttendanceController',
                ncyBreadcrumb: {
                    label: 'Manage Attendance',
                }
            })
            .state('app.nba', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'NBA',
                }
            })
            .state('app.nba.programOutcome', {
                url: '/programOutcome',
                templateUrl: 'views/admin/programOutcome.html',
                controller: 'ProgramOutcomeController',
                ncyBreadcrumb: {
                    label: 'Program Outcome',
                }
            })
            .state('app.nba.courseOutcome', {
                url: '/courseOutcome',
                templateUrl: 'views/faculty/courseOutcome.html',
                controller: 'CourseOutcomeController',
                ncyBreadcrumb: {
                    label: 'Course Outcome',
                }
            })
            .state('app.nba.coAttainment', {
                url: '/coAttainment',
                templateUrl: 'views/faculty/coAttainment.html',
                controller: 'COAttainmentController',
                ncyBreadcrumb: {
                    label: 'Course Outcome Attainment',
                }
            })
            .state('app.nba.setWeightage', {
                url: '/setWeightage',
                templateUrl: 'views/admin/setWeightage.html',
                controller: 'SetWeightageController',
                ncyBreadcrumb: {
                    label: 'Set Weightage',
                }
            })
            .state('app.learningOutcome', {
                url: '/learningOutcome',
                templateUrl: 'views/faculty/learningOutcome.html',
                controller: 'LearningOutcomeController',
                ncyBreadcrumb: {
                    label: 'Set Weightage',
                }
            })
            .state('app.nba.poAttainment', {
                url: '/poAttainment',
                templateUrl: 'views/common/poAttainment.html',
                controller: 'POAttainmentController',
                ncyBreadcrumb: {
                    label: 'PO Attainment',
                }
            })
            .state('app.nba.criteria', {
                url: '/criteria',
                templateUrl: 'views/faculty/criteria.html',
                controller: 'CriteriaController',
                ncyBreadcrumb: {
                    label: 'IA Questions',
                }
            })
            .state('app.assignDocuments', {
                url: '/assignDocuments',
                templateUrl: 'views/faculty/assignDocuments.html',
                controller: 'AssignDocumentsController',
                ncyBreadcrumb: {
                    label: 'Assign Documents',
                }
            })
            .state('app.facultyPerformance', {
                url: '/facultyPerformance',
                templateUrl: 'views/admin/facultyPerformance.html',
                controller: 'FacultyPerformanceController',
                ncyBreadcrumb: {
                    label: 'Faculty Performance',
                }
            })
            .state('app.library', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Library',
                }
            })
            .state('app.library.returnBook', {
                url: '/returnBook',
                templateUrl: 'views/faculty/returnBook.html',
                controller: 'ReturnBookController',
                ncyBreadcrumb: {
                    label: 'Return Book',
                }
            })
            .state('app.library.bookList', {
                url: '/bookList',
                templateUrl: 'views/faculty/bookList.html',
                controller: 'BookListController',
                ncyBreadcrumb: {
                    label: 'Book List',
                }
            })
            .state('app.library.bookHistory', {
                url: '/bookHistory',
                templateUrl: 'views/faculty/bookHistory.html',
                controller: 'BookHistoryController',
                ncyBreadcrumb: {
                    label: 'Book History',
                }
            })
            .state('app.library.addBook', {
                url: '/addBook/:isEdit',
                templateUrl: 'views/faculty/addBook.html',
                controller: 'AddBookController',
                ncyBreadcrumb: {
                    label: 'Add Book',
                }
            })
            .state('app.reports', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Reports',
                }
            })
            .state('app.reports.evaluationRegister', {
                url: '/reports',
                templateUrl: 'views/admin/reports.html',
                controller: 'ReportsController',
                ncyBreadcrumb: {
                    label: 'Reports',
                }
            })
            .state('app.reports.finalReport', {
                url: '/finalReport',
                templateUrl: 'views/admin/finalReport.html',
                controller: 'FinalReportController',
                ncyBreadcrumb: {
                    label: 'Final Report',
                }
            })
            .state('app.changePassword', {
                url: '/changePassword',
                templateUrl: 'views/common/changePassword.html',
                controller: 'ChangePasswordController',
                ncyBreadcrumb: {
                    label: 'Change Password',
                }
            })
            .state('app.feesStructure', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Fees',
                }
            })
            .state('app.feesStructure.setFeesStructure', {
                url: '/setFeesStructure',
                templateUrl: 'views/admin/setFeesStructure.html',
                controller: 'SetFeesStructureController',
                ncyBreadcrumb: {
                    label: 'Regular Fees',
                }
            })
            .state('app.feesStructure.setTransportFees', {
                url: '/setTransportFees',
                templateUrl: 'views/admin/setTransportFees.html',
                controller: 'SetTransportFeesController',
                ncyBreadcrumb: {
                    label: 'Transport Fees',
                }
            })
            //login page
            .state('appSimple', {
                abstract: true,
                templateUrl: 'views/common/layouts/simple.html',
                resolve: {
                    loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['node_modules/font-awesome/css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
                        }]);
                    }],
                }
            })
            .state('appSimple.login', {
                url: '/login',
                templateUrl: 'views/common/login.html',
                controller: 'LoginController'
            })
            .state('appSimple.applicationForm', {
                url: '/applicationForm',
                templateUrl: 'views/common/applicationForm.html',
                controller: 'ApplicationFormController'
            })
            .state('appSimple.openEnquiry', {
                url: '/openEnquiry/:CollegeId/:CourseId/:BranchId/:CollegeName/:CourseName/:BranchName',
                templateUrl: 'views/common/openEnquiry.html',
                controller: 'OpenEnquiryController'
            });
    }]);