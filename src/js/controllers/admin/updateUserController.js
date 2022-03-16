angular.module('app')
    .controller('UpdateUserController', function($scope, LoginFactory, UsersFactory, toastr, DashboardFactory) {
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.selectedUser = angular.copy(UsersFactory.selectedUser);
        UsersFactory.selectedUser = null;
        $scope.newUser = null;
        $scope.roles = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.UserEducationTemplate = {
            University: "",
            Degree: "",
            YearOfPassing: "",
            UserId: $scope.selectedUser.Id
        };
        $scope.UserExperienceTemplate = {
            CollegeName: "",
            Designation: "",
            FromDate: null,
            ToDate: null,
            UserId: $scope.selectedUser.Id
        };
        $scope.selected = {
            Course: null,
            Branch: null,
            Semester: null,
            Class: null,
            Subject: null
        };
        $scope.specialSelected = {
            Course: null,
            Branch: null,
            Semester: null,
            SpecialClass: null,
            SpecialSubject: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.subjects = [];

        $scope.specialCourses = [];
        $scope.specialBranches = [];
        $scope.specialSemesters = [];
        $scope.specialClasses = [];
        $scope.specialSubjects = [];

        $scope.getAllRoles = function() {
            UsersFactory.getAllRoles()
                .then(function(success) {
                    $scope.roles = success.data.Data;
                    if (LoginFactory.loggedInUser.Role != 'SUPERADMIN') {
                        for (var i = 0; i < $scope.roles.length; i++) {
                            if ($scope.roles[i].RoleCode == 'UPLOADER') {
                                $scope.roles.splice(i, 1);
                            }
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getUserById = function(userId) {
            UsersFactory.getUserById(userId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('Could not get user details. Please try later!');
                    } else {
                        $scope.newUser = success.data.Data;
                        $scope.newUser.PhoneNumber = parseInt($scope.newUser.PhoneNumber);
                        $scope.newUser.DateOfBirth = new Date($scope.newUser.DateOfBirth);
                    }
                }, function(error) {
                    toastr.error(error);
                })
        };

        $scope.getAllCourses = function() {
            $scope.courses = [];
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];

            $scope.specialCourses = [];
            $scope.specialBranches = [];
            $scope.specialSemesters = [];
            $scope.specialClasses = [];
            $scope.specialSubjects = [];

            $scope.selected.Course = null;
            $scope.selected.Branch = null;
            $scope.selected.Semester = null;
            $scope.selected.Class = null;
            $scope.selected.Subject = null;

            $scope.specialSelected.Course = null;
            $scope.specialSelected.Branch = null;
            $scope.specialSelected.Semester = null;
            $scope.specialSelected.SpecialClass = null;
            $scope.specialSelected.SpecialSubject = null;

            DashboardFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.courses = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.specialCourses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.courseSelected = function(course, flag) {
            if (flag) {
                $scope.branches = [];
                $scope.semesters = [];
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Branch = null;
                $scope.selected.Semester = null;
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
            } else {
                $scope.specialBranches = [];
                $scope.specialSemesters = [];
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.Branch = null;
                $scope.specialSelected.Semester = null;
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
            }

            DashboardFactory.getAllBranches(course.Id, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.branches = success.data.Data;
                        } else {
                            $scope.specialBranches = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.branchSelected = function(branch, flag) {
            var cid;
            if (flag) {
                $scope.semesters = [];
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Semester = null;
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
                cid = $scope.selected.Course.Id;
            } else {
                $scope.specialSemesters = [];
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.Semester = null;
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
                cid = $scope.specialSelected.Course.Id;
            }
            DashboardFactory.getAllSemesters(branch.Id, LoginFactory.loggedInUser.CollegeId, cid, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        if (flag) {
                            $scope.semesters = success.data.Data;
                        } else {
                            $scope.specialSemesters = success.data.Data;
                        }
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.semesterSelected = function(semester, flag) {
            var cid, bid;
            if (flag) {
                $scope.classes = [];
                $scope.subjects = [];
                $scope.selected.Class = null;
                $scope.selected.Subject = null;
                bid = $scope.selected.Branch.Id;
                cid = $scope.selected.Course.Id;
                DashboardFactory.getAllClasses(bid, semester.Id, LoginFactory.loggedInUser.CollegeId, cid, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                    .then(function(success) {
                        $scope.classes = [];
                        if (success.data.Code != "S001") {
                            toastr.info('There are no classes in this semester');
                        } else {
                            if (flag) {
                                $scope.classes = success.data.Data;
                            } else {
                                $scope.specialClasses = success.data.Data;
                            }
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                $scope.specialClasses = [];
                $scope.specialSubjects = [];
                $scope.specialSelected.SpecialClass = null;
                $scope.specialSelected.SpecialSubject = null;
                bid = $scope.specialSelected.Branch.Id;
                cid = $scope.specialSelected.Course.Id;
            }
            if (flag) {
                DashboardFactory.getAllNonElectiveSubjects(cid, bid, semester.Id)
                    .then(function(success) {
                        $scope.subjects = [];
                        if (success.data.Code != "S001") {
                            toastr.info('There are no subjects in this selection');
                        } else {
                            $scope.subjects = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            } else {
                DashboardFactory.getAllSpecialSubjects(LoginFactory.loggedInUser.CollegeId, cid, $scope.specialSelected.Semester.Id)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.info('There are no special subjects in this selection');
                        } else {
                            $scope.specialSubjects = success.data.Data;
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.getAllSpecialClasses = function(specialSubject) {
            DashboardFactory.getAllSpecialClasses(specialSubject.Id, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no special subjects in this selection');
                    } else {
                        $scope.specialClasses = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.updateUser = function() {
            if ($scope.newUser.Name == "" || $scope.newUser.Role == null || $scope.newUser.PhoneNumber == "") {
                toastr.warning('Please all the required fields')
            } else {
                $scope.newUser.Username = $scope.newUser.Name;
                // $scope.newUser.Password = $scope.newUser.PhoneNumber;
                UsersFactory.updateUser($scope.newUser)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error(success.data.Message);
                        } else {
                            toastr.success('User updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        //educational background
        $scope.addEducation = function() {
            if ($scope.UserEducationTemplate.University == "") {
                toastr.warning('Please enter University Name');
            } else if ($scope.UserEducationTemplate.Degree == "") {
                toastr.warning('Please enter the Degree');
            } else if ($scope.UserEducationTemplate.YearOfPassing == "" || $scope.UserEducationTemplate.YearOfPassing == undefined) {
                toastr.warning('Please enter Year of Passing');
            } else {
                UsersFactory.addEducation($scope.UserEducationTemplate)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not add educational details. Please try later!');
                        } else {
                            toastr.success('User education details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                            $scope.UserEducationTemplate.University = "";
                            $scope.UserEducationTemplate.Degree = "";
                            $scope.UserEducationTemplate.YearOfPassing = "";
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.deleteEducation = function(index) {
            var r = confirm("Are you sure you want to remove this educational detail from user profile?");
            if (r == true) {
                UsersFactory.removeEducation($scope.newUser.UserEducation[index])
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete educational detail. Please try later!');
                        } else {
                            toastr.success('User education details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        //experience backgorund
        $scope.addExperience = function() {
            if ($scope.UserExperienceTemplate.CollegeName == "") {
                toastr.warning('College Name is a required field');
            } else if ($scope.UserExperienceTemplate.Designation == "") {
                toastr.warning('Designation is a required field');
            } else {
                UsersFactory.addExperience($scope.UserExperienceTemplate)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not add experience details. Please try later!');
                        } else {
                            toastr.success('User experience details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                            $scope.UserExperienceTemplate.CollegeName = "";
                            $scope.UserExperienceTemplate.Designation = "";
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.deleteExperience = function(index) {
            var r = confirm("Are you sure you want to remove this experience detail from user profile?");
            if (r == true) {
                UsersFactory.removeExperience($scope.newUser.UserExperience[index])
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not delete experience detail. Please try later!');
                        } else {
                            toastr.success('User experience details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        //add subjects
        $scope.addSubjects = function() {
            if ($scope.selected.Course == null ||
                $scope.selected.Branch == null ||
                $scope.selected.Semester == null ||
                $scope.selected.Class == null) {
                toastr.warning('Please enter all the fields');
            } else {
                for (var i = 0; i < $scope.subjects.length; i++) {
                    if ($scope.subjects[i].isSelected) {
                        $scope.selected.Subject = $scope.subjects[i];
                        $scope.selected.Subject.CourseId = $scope.selected.Course.Id;
                        $scope.selected.Subject.BranchId = $scope.selected.Branch.Id;
                        $scope.selected.Subject.SemesterId = $scope.selected.Semester.Id;
                        $scope.selected.Subject.ClassId = $scope.selected.Class.Id;
                        $scope.selected.Subject.BranchName = $scope.selected.Branch.Name;
                        $scope.selected.Subject.SemesterName = $scope.selected.Semester.SemesterNumber;
                        $scope.selected.Subject.ClassName = $scope.selected.Class.Name;
                        if (isSubjectAlreadyAssigned($scope.selected.Subject)) {
                            toastr.warning('Subjects already assigned cannot be re-assigned!');
                            return;
                        } else {
                            $scope.newUser.Subjects.push($scope.selected.Subject);
                        }
                    }
                }
                if ($scope.newUser.Subjects.length == 0) {
                    toastr.warning('Please select atleast 1 subject');
                } else {
                    var obj = {
                        UserId: $scope.selectedUser.Id,
                        Subjects: $scope.newUser.Subjects
                    }
                    UsersFactory.addSubjects(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.error('Could not assign subjects. Please try later!');
                            } else {
                                toastr.success('Subjects updated successfully');
                                $scope.getUserById($scope.selectedUser.Id);
                                $scope.selected.Class = null;
                                $scope.selected.Subject = null;
                                for (var i = 0; i < $scope.subjects.length; i++) {
                                    $scope.subjects[i].isSelected = false;
                                }
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                }
            }
        };

        $scope.deleteSubject = function(index) {
            var r = confirm("Are you sure you want to remove this subject from user profile?");
            if (r == true) {
                UsersFactory.removeSubject($scope.newUser.Subjects[index])
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not remove subject from user profile. Please try later!');
                        } else {
                            toastr.success('Subject details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        //add special subjects
        $scope.addSpecialSubject = function() {
            if ($scope.specialSelected.Course == null ||
                $scope.specialSelected.Semester == null ||
                $scope.specialSelected.SpecialSubject == null ||
                $scope.specialSelected.SpecialClass == null) {
                toastr.warning('Please enter all the fields');
            } else {
                $scope.specialSelected.SpecialSubject = $scope.specialSelected.SpecialSubject;
                $scope.specialSelected.SpecialSubject.CourseId = $scope.specialSelected.Course.Id;
                $scope.specialSelected.SpecialSubject.SemesterId = $scope.specialSelected.Semester.Id;
                $scope.specialSelected.SpecialSubject.SemesterName = $scope.specialSelected.Semester.SemesterNumber;
                $scope.specialSelected.SpecialSubject.ClassName = $scope.specialSelected.SpecialClass.Name;
                $scope.specialSelected.SpecialSubject.SpecialClassId = $scope.specialSelected.SpecialClass.Id;
                $scope.newUser.SpecialSubjects.push($scope.specialSelected.SpecialSubject);

                if ($scope.newUser.SpecialSubjects.length == 0) {
                    toastr.warning('Please select atleast 1 special subject');
                } else {
                    var obj = {
                        UserId: $scope.selectedUser.Id,
                        SpecialSubjects: $scope.newUser.SpecialSubjects
                    };
                    UsersFactory.addSpecialSubjects(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.error('Could not assign special subjects. Please try later!');
                            } else {
                                toastr.success('Special Subjects updated successfully');
                                $scope.getUserById($scope.selectedUser.Id);
                                $scope.specialSelected.SpecialClass = null;
                                $scope.specialSelected.SpecialSubject = null;
                                for (var i = 0; i < $scope.specialSubjects.length; i++) {
                                    $scope.specialSubjects[i].isSelected = false;
                                }
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                }
            }
        };

        $scope.deleteSpecialSubject = function(index) {
            var r = confirm("Are you sure you want to remove this special subject from user profile?");
            if (r == true) {
                var obj = {
                    UserId: $scope.selectedUser.Id,
                    SpecialSubjectId: $scope.newUser.SpecialSubjects[index].Id,
                    SpecialClassId: $scope.newUser.SpecialSubjects[index].SpecialClassId
                };
                UsersFactory.removeSpecialSubject(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not remove subject from user profile. Please try later!');
                        } else {
                            toastr.success('Subject details updated successfully');
                            $scope.getUserById($scope.selectedUser.Id);
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        function isSubjectAlreadyAssigned(subject) {
            var found = false;
            for (var i = 0; i < $scope.newUser.Subjects.length; i++) {
                if ($scope.newUser.Subjects[i].Id == subject.Id && $scope.newUser.Subjects[i].ClassName == subject.ClassName) {
                    found = true;
                    break;
                }
            }
            return found;
        }

        $scope.getAllRoles();
        $scope.getUserById($scope.selectedUser.Id);
        $scope.getAllCourses();
    });