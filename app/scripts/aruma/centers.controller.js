(function () {
    'use strict';

    angular.module('app.centers')
        .controller('centers-list', ['$scope', '$window', '$state', 'Center', centersList])
        .controller('centers-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'logger', 'api_host', 'Center', centersEdit])
        .controller('members-list', ['$scope', '$state', 'Center', 'User', membersList])
        .controller('activities-list', ['$scope', '$state', 'Center', 'Activity', activitiesList])
        .controller('center-view', ['$scope', '$window', 'Center', '$location', '$state', '$stateParams', function($scope, $window, Center, $location, $state, $stateParams) {
            $scope.center = {};

            $scope.show_activities = false;
            $scope.show_organization = true;

            Center.get({
                id: $stateParams.centerId
            }, function(data) {
                $scope.center = data;
                $scope.activities = $scope.center.activities;
                $scope.organizations = $scope.center.organizations;
            });

            $scope.showActivities = function() {
                $scope.show_activities = true;
                $scope.show_organization = false;
            };

            $scope.showMedias = function() {
                $scope.show_activities = false;
                $scope.show_organization = false;
            };

            $scope.showOrganizations = function() {
                $scope.show_activities = false;
                $scope.show_organization = true;
            };

            $scope.edit = function(id) {
                $state.go('center-edit', {
                    centerId: id
                }); 
            };


}])
.controller('center-activities', ['$scope', '$state', function($scope, $state) {

    $scope.activities_dates = [];

    $scope.viewActivity = function(id) {
        console.log('view '+id);
        $state.go('activity-view', {
            activityId: id
        }); 
    };

    $scope.addActivity = function() {
        console.log('Add Activity: '+$scope.center.id);
        $state.go('activity-new', {
            type: 'center',
            id: $scope.center.id
        });
    };

    $scope.process_dates = function() {
        $scope.activities_dates = _.groupBy($scope.activities, function(item) {
            return moment(item.event_date).startOf('day');
        });
        console.dir($scope.activities_dates);
    };

    $scope.process_dates();

    console.log('activities');
}])
.controller('center-organizations', ['$scope', '$state', '$http', 'logger', 'api_host', 'Organization', function($scope, $state, $http, logger, api_host, Organization) {

    $scope.viewOrganizaion = function(id) {
        console.log('view '+id);
        $state.go('organization-view', {
            organizationId: id
        }); 
    };

    $scope.adding_organization = false;
    $scope.organizations_to_add = [];
    $scope.addOrganization = function() {
        $scope.adding_organization = true;
        Organization.query(function(data) {
            $scope.organizations_to_add = _.filter(data, function(item) {
                var result = _.find($scope.center.organizations, function(existing_item) {
                    return item.id == !existing_item.id;
                });
                console.log('result: '+result);
                return result ? false : true;
            });
            console.dir($scope.organizations_to_add);
        });
    };

    $scope.addToCenter = function(organization) {
        $http.post(api_host+'/api/center/'+$scope.center.id+'/organization/'+organization.id, {

        }).success(function(data) {
            $scope.organizations = data;
            logger.logSuccess("Se agregó emprendimiento al centro"); 
        });

    };

    $scope.removeOrganization = function(organization) {
        $http.post(api_host+'/api/center/'+$scope.center.id+'/remove/organization/'+organization.id, {

        }).success(function(data) {
            $scope.organizations = data;
            logger.logSuccess("Se quito emprendimiento del centro"); 
        });

    };


}]);
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

    function centersEdit($scope, $stateParams, $state, $location, $timeout, logger, api_host, Center) {
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
            if($scope.center.id) {
                $state.go('center-view', {
                    centerId: $scope.center.id
                }); 
            } else {
                $location.url('/aruma/centers/list');
            }
        };

        $scope.submitForm = function() {

            if($scope.center.id) {
                $scope.center.$update(function() {
                    logger.logSuccess("El centro fue actualizado con éxito!"); 
                    $state.go('center-view', {
                        centerId: $scope.center.id
                    }); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            } else {
                $scope.center.$save(function() {
                    logger.logSuccess("El centro fue creado con éxito!"); 
                    $state.go('center-view', {
                        centerId: $scope.center.id
                    }); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            }

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

        $scope.remove = function() {
            if($scope.center.id) {
                $scope.center.$remove(function() {
                    logger.logSuccess("El centro fue eliminado!"); 
                    $state.go('home'); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            }
        };


    }

    function membersList($scope, $state, Center, User) {

    }
    
    function activitiesList($scope, $state, Center, Activity) {

    }

})(); 




