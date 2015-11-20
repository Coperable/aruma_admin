(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', AppCtrl]) // overall control
        .config(['$mdThemingProvider', mdConfig])
    
    function AppCtrl($scope, $rootScope, $state, $document) {

        var date = new Date();
        var year = date.getFullYear();

        $scope.main = {
            brand: 'Aruma Lab',
            name: 'Lisa',
            year: year
        };

        $scope.pageTransitionOpts = [
            {
                name: 'Desde arriba',
                "class": 'animate-fade-up'
            }, {
                name: 'Aumentar',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Desde la derecha',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Girar',
                "class": 'animate-flip-y'
            }
        ];

        $scope.admin = {
            layout: 'wide',                                 // 'boxed', 'wide'
            menu: 'vertical',                               // 'horizontal', 'vertical', 'collapsed'
            fixedHeader: true,                              // true, false
            fixedSidebar: true,                             // true, false
            pageTransition: $scope.pageTransitionOpts[0],   // unlimited
            skin: '22'                                      // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };

        $scope.color = {
            primary:    '#59BC6C',
            success:    '#4CAF50',
            info:       '#00BCD4',
            infoAlt:    '#673AB7',
            warning:    '#FFC107',
            danger:     '#F44336',
            gray:       '#DCDCDC'
        };

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });

    }

    function mdConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo', {
                'default': '500'
            })
            .accentPalette('cyan', {
                'default': '500'
            })
            .warnPalette('red', {
                'default': '500'
            })
            .backgroundPalette('grey');
    }

})(); 
