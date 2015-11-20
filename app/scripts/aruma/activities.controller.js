(function () {
    'use strict';

    angular.module('app.activities')
        .controller('activity-list', ['$scope', '$window', '$state', 'Activity', activitiesList])
        .controller('activity-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'logger', 'api_host', 'Activity', activitiesEdit])
        .controller('activity-view', ['$scope', '$window', 'Activity', '$location', '$state', '$stateParams', activitiesView]);

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
                types: ['geocode'],
                componentRestrictions: {country: 'ar'}
            };
            var searchBox = new google.maps.places.Autocomplete(input, options);

            searchBox.addListener('place_changed', function() {
                var place = searchBox.getPlace();
                $scope.activity.location = place;
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





