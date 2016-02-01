(function () {
    'use strict';

    angular.module('app.products')
        .controller('product-list', ['$scope', '$window', '$state', 'Product', productsList])
        .controller('product-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'logger', 'api_host', 'Product', productsEdit])
        .controller('product-view', ['$scope', '$window', 'Product', '$location', '$state', '$stateParams', productsView]);

    function productsList($scope, $window, $state, Product) {
        $scope.products = [];

        Product.query(function(data) {
            $scope.products = data;
        });

        $scope.view = function(id) {
            $state.go('product-view', {
                productId: id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('product-edit', {
                productId: id
            }); 
        };

    }

    function productsEdit($scope, $stateParams, $state, $location, $timeout, logger, api_host, Product) {
        $scope.product = {};

        if($stateParams.productId) {
            Product.get({
                id: $stateParams.productId
            }, function(data) {
                $scope.product = data;
                $scope.setup_component();
            });

        } else {
            $scope.product = new Product({
                organization_id: $stateParams.organizationId
            });

            $timeout(function() {
                $scope.setup_component();
            }, 1000);
        }


        $scope.canSubmit = function() {
            return $scope.product_form.$valid;
        };

        $scope.revert = function() {
            $scope.product = new Product({});
        };

        $scope.submitForm = function() {
            if($scope.product.id) {
                $scope.product.$update(function() {
                    logger.logSuccess("El producto fue actualizado"); 
                    $state.go('organization-view', {
                        organizationId: $scope.product.organization_id
                    });
                }).catch(function(response) {
                    console.log('error: '+response);
                });

            } else {
                $scope.product.$save(function() {
                    logger.logSuccess("El producto fue creado"); 
                    $state.go('organization-view', {
                        organizationId: $scope.product.organization_id
                    });
                }).catch(function(response) {
                    console.log('error: '+response);
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
            $scope.product.main_picture = response.data.filename;
        };

        $scope.remove = function() {
            if($scope.product.id) {
                $scope.product.$remove(function() {
                    logger.logSuccess("El producto fue eliminado!"); 
                    $state.go('home'); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            }
        };


    }

    function productsView($scope, $window, Product, $location, $state, $stateParams) {
        $scope.product = {};

        Product.get({
            id: $stateParams.productId
        }, function(data) {
            $scope.product = data;
        });

        $scope.edit = function(id) {
            $state.go('product-edit', {
                productId: id
            }); 
        };

    }


})(); 
