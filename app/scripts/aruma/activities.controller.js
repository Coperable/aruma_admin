(function () {
    'use strict';

    angular.module('app.activities')
        .controller('activity-list', ['$scope', '$window', '$state', 'Activity', activitiesList])
        .controller('activity-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'logger', 'api_host', 'Activity', activitiesEdit])
        .controller('activity-view', ['$scope', '$window', 'Activity', '$location', '$state', '$stateParams', activitiesView])
.controller('activity-medias', ['$scope', '$http', '$state', 'api_host', 'logger', 'Organization', function($scope, $http, $state, api_host, logger, Organization) {
    
    $scope.media = {};
    $scope.adding_media = false;
    $scope.getUploadUrl = function() {
        return api_host+'/api/media/activity/'+$scope.activity.id+'/upload';
    };
    $scope.uploading = false;

    $scope.addMedia = function() {
        $scope.adding_media = true;
    };

    $scope.selectAsMainPicture = function(media) {
        $http.post(api_host+'/api/activity/'+$scope.activity.id+'/mainPicture/'+media.id, {

        }).success(function(data) {
            $scope.activity.main_picture = data.name;
            logger.logSuccess("Se estableció imagen como principal"); 
        });
    };

    $scope.removePicture = function(media) {
        $http.post(api_host+'/api/activity/'+$scope.activity.id+'/remove/'+media.id, {
        }).success(function(data) {
            logger.logSuccess("Se eliminó imagen"); 
            $scope.fetchMedias();
        });
    };


    $scope.cancelUpload = function() {
        $scope.media = {};
        $scope.adding_media = false;
        $scope.media = {};
    };

    $scope.onUpload = function(response) {
        $scope.uploading = true;
    };

    $scope.onError = function(response) {
        logger.logError('Surgió un error al subir imagen.'); 
        $scope.uploading = false;
    };

    $scope.onComplete = function(response) {
        logger.logSuccess("Se agregó imagen con éxito!"); 
        $scope.uploading = false;
        $scope.adding_media = false;
        $scope.media = {};
        $scope.fetchMedias();
    };

    $scope.fetchMedias = function() {
        $http.get(api_host+'/api/activity/'+$scope.activity.id+'/medias') 
        .success(function(data) {
            $scope.activity.medias = data;
        });

    };


}]);

    function activitiesList($scope, $window, $state, Activity) {
        $scope.activities = [];

        Activity.query(function(data) {
            $scope.activities = data;
        });

        $scope.view = function(id) {
            $state.go('activity-view', {
                activityId: id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('activity-edit', {
                activityId: id
            }); 
        };

    }

    function activitiesEdit($scope, $stateParams, $state, $location, $timeout, logger, api_host, Activity) {
        $scope.activity = {};

        if($stateParams.activityId) {
            Activity.get({
                id: $stateParams.activityId
            }, function(data) {
                $scope.activity = data;
                $scope.setup_component();
            });

        } else {
            var is_center = $stateParams.type === 'center' ? '1' : '0';
            $scope.activity = new Activity({
                center_activity: is_center,
                center_id: is_center == 1 ? $stateParams.id : null,
                organization_id: is_center == 0 ? $stateParams.id : null
            });

            $timeout(function() {
                $scope.setup_component();
            }, 1000);
        }


        $scope.canSubmit = function() {
            return $scope.activity_form.$valid;
        };

        $scope.revert = function() {
            $scope.activity = new Activity({});
        };

        $scope.submitForm = function() {
            if($scope.activity.id) {
                $scope.activity.$update(function() {
                    logger.logSuccess("La actividad fue actualizada"); 
                    $state.go('activity-view', {
                        activityId: $scope.activity.id
                    });
                }).catch(function(response) {
                    console.log('error: '+response);
                });

            } else {
                $scope.activity.$save(function() {
                    logger.logSuccess("La actividad fue creada"); 
                    $state.go('activity-view', {
                        activityId: $scope.activity.id
                    });
                }).catch(function(response) {
                    console.log('error: '+response);
                });
            }
        };

        $scope.setup_component = function () {
            var input = document.getElementById('activity-location'),
            options = {
                types: ['address'],
                componentRestrictions: {country: 'ar'}
            };
            var searchBox = new google.maps.places.Autocomplete(input, options);

            searchBox.addListener('place_changed', function() {
                var place = searchBox.getPlace();
                console.dir(place.geometry.location.toJSON());
                $scope.activity.location = _.extend(place, {
                    coordinates: place.geometry.location.toJSON()
                });
            });

            jQuery('#activity_event_date').bootstrapMaterialDatePicker({  
                format : 'DD MM YYYY HH:mm',  
                minDate : new Date(), 
                currentDate: $scope.activity.event_date,
                lang: 'es'  
            }).on('change', function(e, date) { 
                console.log('cambio fecha');
                $scope.activity.event_date = date; 
            }); 



        };

        $scope.upload_url = api_host+"/api/media/upload";
        $scope.uploading = false;

        $scope.onUpload = function(response) {
            $scope.uploading = true;
        };

        $scope.onError = function(response) {
            $scope.uploading = false;
            console.log('error');
        };

        $scope.onComplete = function(response) {
            $scope.uploading = false;
            $scope.activity.main_picture = response.data.filename;
            $scope.activity.media_id = response.data.media_id;
        };

        $scope.remove = function() {
            if($scope.activity.id) {
                $scope.activity.$remove(function() {
                    logger.logSuccess("La actividad fue eliminada!"); 
                    $state.go('home'); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            }
        };


    }

    function activitiesView($scope, $window, Activity, $location, $state, $stateParams) {
        $scope.activity = {};

        Activity.get({
            id: $stateParams.activityId
        }, function(data) {
            $scope.activity = data;
        });

        $scope.edit = function(id) {
            $state.go('activity-edit', {
                activityId: id
            }); 
        };

    }


})(); 





