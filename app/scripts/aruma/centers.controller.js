(function () {
    'use strict';

    angular.module('app.centers')
        .controller('centers-list', ['$scope', '$window', '$state', 'Center', centersList])
        .controller('centers-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'api_host', 'Center', centersEdit])
        .controller('centers-view', ['$scope', '$window', 'Center', '$location', '$state', '$stateParams', centersView])
        .controller('members-list', ['$scope', '$state', 'Center', 'User', membersList])
        .controller('activities-list', ['$scope', '$state', 'Center', 'Activity', activitiesList]);

    function centersList($scope, $window, $state, Center) {
        $scope.centers = [];

        Center.query(function(data) {
            $scope.centers = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('center-view', {
                centerId: id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('center-edit', {
                centerId: id
            }); 
        };



    }

    function centersEdit($scope, $stateParams, $state, $location, $timeout, api_host, Center) {
        $scope.center = {};

        if($stateParams.centerId) {
            Center.get({
                id: $stateParams.centerId
            }, function(data) {
                $scope.center = data;
                $scope.setup_component();
            });

        } else {
            $scope.center = new Center({
            });
            $timeout(function() {
                $scope.setup_component();
            }, 1000);
        }


        $scope.canSubmit = function() {
            return $scope.center_form.$valid;
        };

        $scope.revert = function() {
            $scope.center = new Center({});
        };

        $scope.submitForm = function() {
            $scope.center.$save(function() {
                console.log('guardado');
                $location.url('/aruma/centers/list');
            }).catch(function(response) {
                console.log('error: '+response);
            });
        };

        if($stateParams.centerId) {
            Center.get({
                id: $stateParams.centerId
            }, function(data) {
                $scope.center= data;
            });
        }

        $scope.setup_component = function () {
            var input = document.getElementById('center-location'),
            options = {
                types: ['geocode'],
                componentRestrictions: {country: 'ar'}
            };
            var searchBox = new google.maps.places.Autocomplete(input, options);

            searchBox.addListener('place_changed', function() {
                var place = searchBox.getPlace();
                $scope.center.location = place;
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
            $scope.center.main_picture = response.data.filename;
        };

        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }

    function centersView($scope, $window, Center, $location, $state, $stateParams) {
        $scope.center = {};
        $scope.organizations = [];
        $scope.activities = [];

        console.log('Center view id: '+$stateParams.centerId);
        Center.get({
            id: $stateParams.centerId
        }, function(data) {
            $scope.center = data;
            $scope.organizations = $scope.center.organizations;
            $scope.activities = $scope.center.activities;
        });

        $scope.createActivity = function() {
            console.log('create activity');
            $state.go('activity-new', {
                centerId: $scope.center.id
            }); 
        };


        $scope.createOrganization = function() {
            console.log('create organization');
            $state.go('organization-new', {
                centerId: $scope.center.id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('center-edit', {
                centerId: id
            }); 
        };

    }

    function membersList($scope, $state, Center, User) {

    }
    
    function activitiesList($scope, $state, Center, Activity) {

    }

})(); 




