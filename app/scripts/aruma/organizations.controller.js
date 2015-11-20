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
        });
        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }

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

    Organization.get({
        id: $stateParams.organizationId
    }, function(data) {
        $scope.organization = data;
        $scope.activities = $scope.organization.activities;
        $scope.products = $scope.organization.products;
    });

    $scope.showActivities = function() {
        $scope.show_activities = true;
        $scope.show_products = false;
    };

    $scope.showProducts = function() {
        console.log('click in products');
        $scope.show_activities = false;
        $scope.show_products = true;
    };

    $scope.showCups = function() {
        console.log('click in cups');
        $scope.show_activities = false;
        $scope.show_products = false;
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

}])



})(); 




