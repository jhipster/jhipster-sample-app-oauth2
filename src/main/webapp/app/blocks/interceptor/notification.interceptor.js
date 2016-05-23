(function() {
    'use strict';

    angular
        .module('jhipsterOauth2SampleApplicationApp')
        .factory('notificationInterceptor', notificationInterceptor);

    notificationInterceptor.$inject = ['$q', 'AlertService'];

    function notificationInterceptor ($q, AlertService) {
        var service = {
            response: response
        };

        return service;

        function response (response) {
            var alertKey = response.headers('X-jhipsterOauth2SampleApplicationApp-alert');
            if (angular.isString(alertKey)) {
                AlertService.success(alertKey, { param : response.headers('X-jhipsterOauth2SampleApplicationApp-params')});
            }
            return response;
        }
    }
})();
