(function () {
    'use strict';

angular.module('app.services', [])
.factory('logger',[function() {

    var logIt;

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-bottom-right",
        "timeOut": "3000"
    };

    logIt = function(message, type) {
        return toastr[type](message);
    };

    return {
        log: function(message) {
            logIt(message, 'info');
        },
        logWarning: function(message) {
            logIt(message, 'warning');
        },
        logSuccess: function(message) {
            logIt(message, 'success');
        },
        logError: function(message) {
            logIt(message, 'error');
        }
    };

}])
.factory('Organization',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/organizations/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Center',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/centers/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('User',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/users/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Role',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/roles/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Account', ['$http', '$rootScope', '$auth', '$location', 'api_host', function($http, $rootScope, $auth, $location, api_host) {
    return {
        profile: false,
        profile_id: false,
        fetching: false,
        roles: [],
        centers: [],
        organizations: [],
    
        getProfile: function(callback) {
            var self = this;
            if(!$auth.isAuthenticated()) {
                if(callback) {
                    self.listen(callback);
                }
                return;
            }
            if(self.profile) {
                if(callback) {
                    callback(self.profile);
                } else {
                    return this.profile;
                }
            }
            if(!self.fetching) {
                self.fetching = true;
                return $http.get(api_host+'/api/me').success(function(data){
                    self.fetching = false;
                    if(data.user == null) {
                        $auth.logout();
                        self.profile = false;
                        self.profile_id = false;
                        $rootScope.account = false;
                        self.broadcast();
                        $location.url('/');
                     } else {
                        self.profile = data.user; 
                        self.profile_id = self.profile.id;
                        $rootScope.account = self.profile;
                        self.centers = self.profile.centers;
                        self.organizations = self.profile.organizations;
                        self.roles = self.profile.roles;
                        self.broadcast();
                    }
                    if(callback) {
                        callback(self.profile);
                    }

                }).catch(function(response) {
                    $auth.logout();
                    self.profile = false;
                    self.profile_id = false;
                    self.broadcast();
                });
            } else {
                self.listen(callback);
            }
            return false;
        },

        hasRole: function(role_name) {
            var result = _.find(this.roles, function(role) {
                return role.name == role_name;
            });
            return result ? true : false;
        },

        logout: function() {
            console.log('logout');
            if(!$auth.isAuthenticated()) {
                return;
            }
            console.log('account logout');
            this.profile = false;
            this.profile_id = false;
            $rootScope.account = false;
            this.broadcast();
            $auth.logout();
        },
        getStatus: function() {
            return $http.get(api_host+'/api/me/status');
        },
        updateProfile: function(profileData) {
            return $http.put(api_host+'/api/me', profileData);
        },
        broadcast: function() {
            $rootScope.$broadcast("account", this.profile);
        },
        listen: function(callback) {

            console.log('Account: set list for callback');
            $rootScope.$on("account", function(event, newValue, oldValue) {
                if(newValue) {
                    console.log('Account: listening calling callback');
                    callback(newValue);
                }
            });
        }
    };
}])
.factory('Page',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/pages/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Activity',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/activities/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.factory('Product',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/products/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])

.factory('User',['$resource', 'api_host', function($resource, api_host){
    return $resource(api_host+'/api/users/:id', { id:'@id' }, {
        update: {
            method: 'PUT'
        }
    });
}])
.filter('moment', function() {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
});

})(); 
