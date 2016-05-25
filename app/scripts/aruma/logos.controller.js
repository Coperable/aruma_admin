(function () {
'use strict';

angular.module('app.logos')
.controller('logos-medias', ['$scope', '$http', '$state', 'api_host', 'logger', function($scope, $http, $state, api_host, logger) {
    
        console.log('le');
    $scope.media = {};
    $scope.adding_media = false;
    $scope.upload_url = api_host+'/api/media/logo/upload';
    $scope.uploading = false;

    $scope.addMedia = function() {
        $scope.adding_media = true;
    };

    $scope.removePicture = function(media) {
        $http.post(api_host+'/api/media/logo/'+media.id+'/remove', {
        }).success(function(data) {
            logger.logSuccess("Se eliminó logo"); 
            $scope.fetchMedias();
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
        logger.logSuccess("Se agregó logo con éxito!"); 
        $scope.uploading = false;
        $scope.adding_media = false;
        $scope.fetchMedias();
    };

    $scope.fetchMedias = function() {
        $http.get(api_host+'/api/media/logo') 
        .success(function(data) {
            $scope.medias = data;
        });

    };

    $scope.fetchMedias();

}]);


})(); 





