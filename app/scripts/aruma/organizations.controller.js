(function () {
'use strict';

angular.module('app.organizations')
.controller('organization-edit', ['$scope', '$window', '$location', '$state', '$stateParams', '$timeout', 'api_host', 'logger', 'Organization', function($scope, $window, $location, $state, $stateParams, $timeout, api_host, logger, Organization) {

    $scope.organization = {};

    if($stateParams.organizationId) {
        Organization.get({
            id: $stateParams.organizationId
        }, function(data) {
            $scope.organization = data;
            $scope.setup_component();
        });

    } else {
        $scope.organization = new Organization({
            what_for_title: 'Para qué?',
            how_title: 'Cómo?',
            why_title: 'Para qué?'
        });
        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }

    $scope.refresh = function() {
        Organization.get({
            id: $stateParams.organizationId
        }, function(data) {
            $scope.organization = data;
            $scope.setup_component();
        });
    };



    $scope.canSubmit = function() {
        return $scope.organization_form.$valid;
    };

    $scope.revert = function() {
        $scope.organization = new Organization({});
    };

    $scope.submitForm = function() {
        if($scope.organization.id) {
            $scope.organization.$update(function() {
                logger.logSuccess("El emprendimiento fue actualizado con éxito!"); 
                $state.go('organization-view', {
                    organizationId: $scope.organization.id
                }); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        } else {
            $scope.organization.$save(function() {
                logger.logSuccess("El emprendimiento fue creado con éxito!"); 
                $state.go('organization-view', {
                    organizationId: $scope.organization.id
                }); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }


    };
    $scope.setup_component = function () {

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
        $scope.organization.main_picture = response.data.filename;
        $scope.organization.media_id = response.data.media_id;
    };



}])
.controller('organizations-list', ['$scope', '$http', '$state', 'api_host', 'Organization', function($scope, $http, $state, api_host, Organization) {
   
    Organization.query(function(data) {
        $scope.organizations = data;
    });

    $scope.view = function(id) {
        console.log('view '+id);
        $state.go('organization-view', {
            organizationId: id
        }); 
    };

    $scope.edit = function(id) {
        $state.go('organization-edit', {
            organizationId: id
        }); 
    };



}])
.controller('organization-view', ['$scope', '$window', 'Organization', '$location', '$state', '$stateParams', function($scope, $window, Organization, $location, $state, $stateParams) {
    $scope.organization = {};

    $scope.show_activities = false;
    $scope.show_products = true;
    $scope.show_medias = false;
    $scope.show_geopoints = false;

    Organization.get({
        id: $stateParams.organizationId
    }, function(data) {
        $scope.organization = data;
        $scope.activities = $scope.organization.activities;
        $scope.products = $scope.organization.products;
        $scope.medias = $scope.organization.medias;
        $scope.geopoints = $scope.organization.geopoints;
    });

    $scope.showActivities = function() {
        $scope.show_activities = true;
        $scope.show_products = false;
        $scope.show_medias = false;
        $scope.show_geopoints = false;
    };

    $scope.showMedias = function() {
        $scope.show_activities = false;
        $scope.show_products = false;
        $scope.show_medias = true;
        $scope.show_geopoints = false;
    };

    $scope.showProducts = function() {
        console.log('click in products');
        $scope.show_activities = false;
        $scope.show_products = true;
        $scope.show_medias = false;
        $scope.show_geopoints = false;
    };

    $scope.showGeoPoints = function() {
        console.log('click in products');
        $scope.show_activities = false;
        $scope.show_products = false;
        $scope.show_medias = false;
        $scope.show_geopoints = true;
    };

 
    $scope.edit = function(id) {
        $state.go('organization-edit', {
            organizationId: id
        }); 
    };



}])
.controller('organization-activities', ['$scope', '$state', function($scope, $state) {

    $scope.activities_dates = [];

    $scope.viewActivity = function(id) {
        console.log('view '+id);
        $state.go('activity-view', {
            activityId: id
        }); 
    };

    $scope.addActivity = function() {
        console.log('Add Activity: '+$scope.organization.id);
        $state.go('activity-new', {
            type: 'organization',
            id: $scope.organization.id
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
.controller('organization-geopoints', ['$scope', '$state', '$http', 'logger', 'GeoPoint', 'api_host', function($scope, $state, $http, logger, GeoPoint, api_host) {
    $scope.adding_geo = false;
    $scope.geoPoint = new GeoPoint();

    $scope.deleteGeoPoint = function() {
        $scope.geoPoint.$remove(function() {
            logger.logSuccess("El punto de venta fue removido"); 
            $scope.fetchGeopoints();
            $scope.adding_geo = false;
        }).catch(function(response) {
            logger.logError(response.message); 
        });
    };

    $scope.cancelGeoPoint = function() {
        $scope.geoPoint = new GeoPoint();
        $scope.adding_geo = false;
    };

    $scope.submitGeoPoint = function() {
        $scope.adding_geo = false;

        $scope.geoPoint.organization_id = $scope.organization.id;

        if($scope.geoPoint.id) {
            $scope.geoPoint.$update(function() {
                logger.logSuccess("El punto de venta fue actualizado con éxito!"); 
                $scope.fetchGeopoints();
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        } else {
            $scope.geoPoint.$save(function() {
                logger.logSuccess("El punto de venta fue creado con éxito!"); 
                $scope.fetchGeopoints();
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }
    };

    $scope.fetchGeopoints = function() {
        $http.get(api_host+'/api/organization/'+$scope.organization.id+'/geopoints') 
        .success(function(data) {
            $scope.geopoints = data;
        });
    };

    $scope.editGeoPoint = function(geo) {
        $scope.adding_geo = true;
        $scope.geoPoint = new GeoPoint(geo);
        console.dir($scope.geoPoint);
        $scope.setup_component();
    };

    $scope.addGeoPoint = function() {
        $scope.adding_geo = true;
        $scope.geoPoint = new GeoPoint({});
        $scope.setup_component();
    };

    $scope.setup_component = function () {
        var input = document.getElementById('geopoint-location'),
        options = {
            types: ['address'],
            componentRestrictions: {country: 'ar'}
        };
        var searchBox = new google.maps.places.Autocomplete(input, options);

        searchBox.addListener('place_changed', function() {
            var place = searchBox.getPlace();
            $scope.geoPoint.location = _.extend(place, {
                coordinates: place.geometry.location.toJSON()
            });
        });
    };

}])
.controller('organization-products', ['$scope', '$http', '$state', 'api_host', 'Organization', function($scope, $http, $state, api_host, Organization) {

    $scope.products_result = [];

    $scope.addProduct = function() {
        $state.go('product-new', {
            organizationId: $scope.organization.id
        });
    };

    $scope.viewProduct = function(id) {
        console.log('view '+id);
        $state.go('product-view', {
            productId: id
        }); 
    };

    $scope.editProduct = function(product) {
        $state.go('product-edit', {
            productId: product.id
        }); 
    };



}])
.controller('organization-medias', ['$scope', '$http', '$state', 'api_host', 'logger', 'Organization', function($scope, $http, $state, api_host, logger, Organization) {
    
    $scope.media = {};
    $scope.adding_media = false;
    $scope.upload_url = api_host+'/api/media/organization/'+$scope.organization.id+'/upload';
    $scope.uploading = false;

    $scope.addMedia = function() {
        $scope.adding_media = true;
    };

    $scope.selectAsMainPicture = function(media) {
        $http.post(api_host+'/api/organization/'+$scope.organization.id+'/mainPicture/'+media.id, {

        }).success(function(data) {
            $scope.organization.main_picture = data.name;
            logger.logSuccess("Se estableció imagen como principal"); 
        });
    };

    $scope.cancelUpload = function() {
        $scope.media = {};
        $scope.adding_media = false;
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
        $scope.fetchMedias();
    };

    $scope.fetchMedias = function() {
        $http.get(api_host+'/api/organization/'+$scope.organization.id+'/medias') 
        .success(function(data) {
            $scope.medias = data;
        });

    };


}]);


})(); 




