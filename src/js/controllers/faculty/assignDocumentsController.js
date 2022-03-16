angular.module('app')
    .controller('AssignDocumentsController', function($scope, toastr, CourseOutcomeFactory, SelectClassFactory, AssignDocumentsFactory, LoginFactory, $uibModal) {

        $scope.chapters = [];
        $scope.topicPresentationURLs = [];
        $scope.selected = {
            chapter: null
        };
        $scope.subTopicNames = null;

        $scope.getAllChapters = function() {
            CourseOutcomeFactory.getAllChaptersForSubject(SelectClassFactory.selected.subject.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error('There are no chapters available!');
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.getAllTopicsWithPPTForChapter = function(chapter) {
            $scope.topicPresentationURLs = [];
            AssignDocumentsFactory.getAllTopicsWithPPTForChapter(chapter.Id, LoginFactory.loggedInUser.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.info('There are no topics for this chapter');
                    } else {
                        $scope.topicPresentationURLs = success.data.Data;
                        var topicIds = $scope.topicPresentationURLs.map(x => x.Id);
                        $scope.subTopics = [];
                        var obj = {
                            TopicIds: topicIds,
                            UserId: LoginFactory.loggedInUser.Id,
                            FilterUserVideos: false
                        };
                        AssignDocumentsFactory.getAllSubTopics(obj)
                            .then(function(success) {
                                if (success.data.Code != "S001") {
                                    toastr.error(success.data.Message);
                                } else {
                                    $scope.subTopics = success.data.Data;
                                    for (var i = 0; i < $scope.topicPresentationURLs.length; i++) {
                                        $scope.topicPresentationURLs[i].SubTopics = [];
                                        for (var j = 0; j < $scope.subTopics.length; j++) {
                                            if ($scope.topicPresentationURLs[i].Id == $scope.subTopics[j].TopicId) {
                                                $scope.topicPresentationURLs[i].SubTopics.push($scope.subTopics[j]);
                                            }
                                        }
                                    }
                                }
                            }, function(error) {
                                toastr.error(error);
                            })
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.addVideo = function(topic) {
            var obj = {
                type: 'video',
                topic: topic
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/templates/AddSubTopics.html',
                controller: 'AddSubTopicsController',
                resolve: {
                    obj: function() {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getAllTopicsWithPPTForChapter($scope.selected.chapter);
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.addPresentation = function(topic) {
            var obj = {
                type: 'presentation',
                topic: topic
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/templates/AddSubTopics.html',
                controller: 'AddSubTopicsController',
                resolve: {
                    obj: function() {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function(response) {
                $scope.getAllTopicsWithPPTForChapter($scope.selected.chapter);
            }, function() {
                console.log('Cancelled');
            });
        };

        $scope.deleteSubTopic = function(subTopic) {
            AssignDocumentsFactory.deleteSubTopic(subTopic)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        toastr.error(success.data.Message);
                    } else {
                        toastr.success('Video deleted successfully');
                        $scope.getAllTopicsWithPPTForChapter($scope.selected.chapter);
                    }
                }, function(error) {
                    toastr.error(error);
                });
        };

        $scope.open = function(url) {
            window.open(url);
        };

        $scope.getAllChapters();
    })
    .controller('AddSubTopicsController', function($scope, $uibModalInstance, LoginFactory, AssignDocumentsFactory, toastr, obj, SelectClassFactory) {

        $scope.type = obj.type;

        $scope.newSubTopic = {
            Id: null,
            Names: [],
            TopicId: obj.topic.Id,
            VideoURL: null,
            UserId: LoginFactory.loggedInUser.Id
        };

        $scope.newPPT = {
            mediaURL: obj.topic.MediaURL
        };

        $scope.video = {
            subTopicNames: ""
        };

        $scope.ok = function() {
            if (obj.type == 'video') {
                if ($scope.video.subTopicNames.length == 0 || $scope.newSubTopic.VideoURL.length == 0) {
                    toastr.warning('Enter Name and URL');
                } else {
                    $scope.newSubTopic.Names = $scope.video.subTopicNames.split("|");
                    $scope.newSubTopic.VideoURL = $scope.newSubTopic.VideoURL.replace("watch?v=", "embed/");
                    $scope.newSubTopic.VideoURL += "?rel=0&amp;showinfo=0";
                    AssignDocumentsFactory.addSubTopics($scope.newSubTopic)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                toastr.error(success.data.Message);
                            } else {
                                toastr.success('Sub-Topics created successfully');
                                $uibModalInstance.close();
                            }
                        }, function(error) {
                            toastr.error(error);
                        });
                }
            } else {
                var ppt = {
                    TopicId: obj.topic.Id,
                    UserId: LoginFactory.loggedInUser.Id,
                    SubjectId: SelectClassFactory.selected.subject.Id,
                    MediaURL: $scope.newPPT.mediaURL
                };
                AssignDocumentsFactory.assignPPT(ppt)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            toastr.error('Could not assign document. Please try later!');
                        } else {
                            toastr.success('Document updated successfully');
                            $uibModalInstance.close();
                        }
                    }, function(error) {
                        toastr.error(error);
                    });
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });