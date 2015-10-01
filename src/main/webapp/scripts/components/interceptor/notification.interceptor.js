 'use strict';

angular.module('sampleoauth2App')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-sampleoauth2App-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-sampleoauth2App-params')});
                }
                return response;
            }
        };
    });
