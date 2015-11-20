(function () {
    'use strict';

    angular.module('app.users')
        .controller('users-list', ['$scope', '$window', '$state', 'User', usersList])
        .controller('users-edit', ['$scope', '$state', 'User', usersEdit])
        .controller('users-view', ['$scope', '$window', 'User', '$location', '$state', '$stateParams', '$http', 'logger', 'Role', 'Center', 'Organization', 'Account', 'api_host', usersView]);

    function usersList($scope, $window, $state, User) {
        $scope.users = [];

        User.query(function(data) {
            $scope.users = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('user-view', {
                userId: id
            }); 
        };



    }

    function usersEdit($scope, $state, User) {
        $scope.user = new User({});

        $scope.canSubmit = function() {
            return $scope.user_form.$valid;
        };

        $scope.revert = function() {
            $scope.user = new User({});
        };

        $scope.submitForm = function() {
            $scope.user.$save(function() {
                $state.go('user-view', {
                    userId: $scope.user.id
                }); 
            }).catch(function(response) {
                console.log('error: '+response);
            });
        };
    }

    function usersView($scope, $window, User, $location, $state, $stateParams, $http, logger, Role, Center, Organization, Account, api_host) {
        $scope.user = {};
        $scope.account = Account;
        $scope.competitions = [];
        $scope.roles = [];
        $scope.centers = [];
        $scope.organizations = [];
        $scope.isRoleCollapsed = true;
        $scope.isCenterCollapsed = true;

        $scope.canSubmit = function() {
            return $scope.user_form.$valid;
        };

        User.get({
            id: $stateParams.userId
        }, function(data) {
            $scope.user = data;
            $scope.fetchRoles();
            $scope.fetchCenters();
            $scope.fetchOrganizations();
        });


        $scope.fetchRoles = function() {
            Role.query(function(data) {
                $scope.roles = data;
                _.each($scope.user.roles, function(user_role) {
                    var role = _.find($scope.roles, function(item) {
                        return user_role.id == item.id;
                    });
                    role.assigned = true;
                });
            });
        };

        $scope.fetchCenters = function() {
            Center.query(function(data) {
                $scope.centers = data;
                _.each($scope.user.centers, function(user_center) {
                    var center = _.find($scope.centers, function(item) {
                        return user_center.id == item.id;
                    });
                    center.assigned = true;
                });
            });
        };

        $scope.fetchOrganizations = function() {
            Organization.query(function(data) {
                $scope.organizations = data;
                _.each($scope.user.organizations, function(user_organization) {
                    var organization = _.find($scope.organizations, function(item) {
                        return user_organization.id == item.id;
                    });
                    organization.assigned = true;
                });
            });
        };




        $scope.saveRoles = function() {
            var rolesToAssign = _.filter($scope.roles, function(rol) {
                return rol.assigned;
            }); 
            $http.post(api_host+'/api/users/assign/roles', {
                userId: $scope.user.id,
                roles: rolesToAssign
            }).success(function(data) {
                logger.logSuccess("Roles asignados"); 
            });

        };

        $scope.saveCenters = function() {
            var centersToAssign = _.filter($scope.centers, function(center) {
                return center.assigned;
            }); 
            $http.post(api_host+'/api/users/assign/centers', {
                userId: $scope.user.id,
                centers: centersToAssign 
            }).success(function(data) {
                logger.logSuccess("Centros asignados"); 
            });

        };

        $scope.saveOrganizations = function() {
            var organizationsToAssign = _.filter($scope.organizations, function(organization) {
                return organization.assigned;
            }); 
            $http.post(api_host+'/api/users/assign/organizations', {
                userId: $scope.user.id,
                organizations: organizationsToAssign 
            }).success(function(data) {
                logger.logSuccess("Organizaciones asignadas"); 
            });

        };

        $scope.revertRoles = function() {
            $scope.fetchRoles();
        };

        $scope.revertCenters = function() {
            $scope.fetchCenters();
        };

        $scope.revertOrganizations = function() {
            $scope.fetchOrganizations();
        };



    }


})(); 





