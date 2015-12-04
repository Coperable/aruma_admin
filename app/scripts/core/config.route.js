(function () {
    'use strict';


    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'api_host', function($stateProvider, $urlRouterProvider, $authProvider, api_host, $state) {
            var routes, setRoutes;

            routes = [
                'aruma/centers/list',
                'aruma/activities/list',
                'aruma/products/list',
                'aruma/pages/list',
                'aruma/organizations/list',
                'aruma/sliders/list',
                'aruma/users/list',
                'aruma/users/edit'
            ];

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'views/' + route + '.html',
                    resolve: {
                        loginRequired: loginRequired
                    }

                };
                $stateProvider.state(route, config);

                return $stateProvider;
            };

            routes.forEach(function(route) {
                return setRoutes(route);
            });


            $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/aruma/account/signin.html',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'views/dashboard.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('center-view', {
                url: '/center-view/:centerId',
                templateUrl: 'views/aruma/centers/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('user-view', {
                url: '/user-view/:userId',
                templateUrl: 'views/aruma/users/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('center-new', {
                url: '/center-new',
                templateUrl: 'views/aruma/centers/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('center-edit', {
                url: '/center-edit/:centerId',
                templateUrl: 'views/aruma/centers/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('page-new', {
                url: '/page-new',
                templateUrl: 'views/aruma/pages/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('page-edit', {
                url: '/page-edit/:pageId',
                templateUrl: 'views/aruma/pages/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })


            .state('product-new', {
                url: '/product-new/:organizationId',
                templateUrl: 'views/aruma/products/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('product-edit', {
                url: '/product-edit/:productId',
                templateUrl: 'views/aruma/products/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('product-view', {
                url: '/product-view/:productId',
                templateUrl: 'views/aruma/products/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })


            .state('activity-new', {
                url: '/activity-new/:type/:id',
                templateUrl: 'views/aruma/activities/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('activity-edit', {
                url: '/activity-edit/:activityId',
                templateUrl: 'views/aruma/activities/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('activity-view', {
                url: '/activity-view/:activityId',
                templateUrl: 'views/aruma/activities/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })



            .state('organization-new', {
                url: '/organization-new/:centerId',
                templateUrl: 'views/aruma/organizations/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('organization-edit', {
                url: '/organization-edit/:organizationId',
                templateUrl: 'views/aruma/organizations/edit.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('organization-view', {
                url: '/organization-view/:organizationId',
                templateUrl: 'views/aruma/organizations/view.html',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('signin', {
                url: '/signup',
                templateUrl: 'views/aruma/account/signup.html',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            });

            $urlRouterProvider
                //.when('/', '/dashboard')
                .otherwise('/login');

            function skipIfLoggedIn($q, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }

            function loginRequired($q, $location, $state, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.resolve();
                } else {
                    //$state.go('login');
                    $location.path('/login');
                }
                return deferred.promise;
            }

            //Satellizer
            $authProvider.baseUrl = api_host+'/';
            $authProvider.httpInterceptor = true;
            $authProvider.signupRedirect = null;

        

        }]
    );

})(); 
