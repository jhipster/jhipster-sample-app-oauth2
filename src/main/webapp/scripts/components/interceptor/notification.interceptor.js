 'use strict';

angular.module('sampleOAuth2App')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-sampleOAuth2App-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-sampleOAuth2App-params')});
                }
                return response;
            }
        };
    });
