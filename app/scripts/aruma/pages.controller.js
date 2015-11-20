(function () {
    'use strict';

    angular.module('app.pages')
        .controller('pages-list', ['$scope', '$window', '$state', 'Page', pagesList])
        .controller('pages-edit', ['$scope', '$stateParams', '$state', '$location', '$timeout', 'logger', 'api_host', 'Page', pagesEdit]);

    function pagesList($scope, $window, $state, Page) {
        $scope.pages = [];

        Page.query(function(data) {
            $scope.pages = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('page-view', {
                pageId: id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('page-edit', {
                pageId: id
            }); 
        };



    }

    function pagesEdit($scope, $stateParams, $state, $location, $timeout, logger, api_host, Page) {
        $scope.page = {};

        if($stateParams.pageId) {
            Page.get({
                id: $stateParams.pageId
            }, function(data) {
                $scope.page = data;
                $scope.setup_component();
            });

        } else {
            $scope.page = new Page({
            });
            $timeout(function() {
                $scope.setup_component();
            }, 1000);
        }


        $scope.canSubmit = function() {
            return $scope.page_form.$valid;
        };

        $scope.revert = function() {
            $scope.page = new Page({});
        };

        $scope.submitForm = function() {
            if($scope.page.id) {
                $scope.page.$update(function() {
                    logger.logSuccess("La página fue actualizada con éxito!"); 
                    $location.url('/aruma/pages/list');
                }).catch(function(response) {
                    console.log('error: '+response);
                });
            } else {
                $scope.page.$save(function() {
                    logger.logSuccess("La página fue guardada"); 
                    $location.url('/aruma/pages/list');
                }).catch(function(response) {
                    console.log('error: '+response);
                });
            }
        };

        if($stateParams.pageId) {
            Page.get({
                id: $stateParams.pageId
            }, function(data) {
                $scope.page= data;
            });
        }

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
            $scope.page.main_picture = response.data.filename;
        };

        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }

    
})(); 





