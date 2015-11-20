(function () {
    'use strict';

    angular.module('app.page')
        .controller('authCtrl', ['$scope', '$window', '$location', authCtrl]);

    function authCtrl($scope, $window, $location) {
            $scope.login = function() {
                $location.url('/')
            }

            $scope.signup = function() {
                $location.url('/')
            }

            $scope.reset =  function() {
                $location.url('/')
            }

            $scope.unlock =  function() {
                $location.url('/')
            }   
    }

})(); 



