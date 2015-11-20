(function () {
'use strict';

angular.module('app.account')
.controller('loginController', ['$scope', '$window', '$auth', '$http', '$state', 'api_host', 'logger', 'Account', function($scope, $window, $auth, $http, $state, api_host, logger, Account) {

    $scope.normal_action = true;
    $scope.reset_action = false;

    $scope.user = {};

    $scope.doLogin = function()  {
        console.dir($scope.user);
        $auth.login({ email: $scope.user.email, password: $scope.user.password })
        .then(function(response) {
            Account.getProfile(function(profile) {
                $scope.account = profile;
                $state.go('dashboard');
                logger.log("Estás adentro!"); 
            });
        })
        .catch(function(response) {
            logger.logError("Usuario o clave inválidos"); 
            console.dir(response);
        });
    };

    $scope.doResetPassword = function()  {
        console.log('do reset password');
        console.log($scope.email_reset);
        $http.post(api_host+'/password/email', {email: $scope.user.email_reset})
        .success(function(response) {
            logger.log("Se envió mail con nueva contraseña!"); 
            $scope.normal_action = true;
            $scope.reset_action = false;
        })
        .error(function(response) {
            logger.logError("Hubo un inconveniente"); 
        });

    };

    $scope.doReset = function() {
        $scope.normal_action = false;
        $scope.reset_action = true;
    };

    $scope.doNormal = function() {
        $scope.normal_action = true;
        $scope.reset_action = false;
    };



}])
.controller('sidebar-controller', ['$scope', '$auth', '$state', 'logger', 'Account', function($scope, $auth, $state, logger, Account) {

    $scope.centers = [];
    $scope.organizations = [];
    $scope.roles = [];

    console.log('sidebar-controller');
    Account.getProfile(function(profile) {
        $scope.account = Account.profile;
        $scope.profile = profile;
        $scope.organizations = profile.organizations;
        $scope.centers = profile.centers;
        $scope.roles = profile.roles;
    });

    $scope.viewCenter = function(id) {
        $state.go('center-view', {
            centerId: id
        }); 
    };

    $scope.viewOrganization = function(id) {
        $state.go('organization-view', {
            organizationId: id
        }); 
    };

    $scope.hasRole = function(role_name) {
        return Account.hasRole(role_name);
    };

}])
.controller('session-bar-controller', ['$scope', '$location', 'Account', sessionBarController]);

function sessionBarController($scope, $location, Account) {

    $scope.profile = {};

    Account.getProfile(function(profile) {
        $scope.profile = profile;
    });

    $scope.logout = function() {
        $scope.profile = {};
        Account.logout();
        $location.path('/login');
    };


}


})(); 





