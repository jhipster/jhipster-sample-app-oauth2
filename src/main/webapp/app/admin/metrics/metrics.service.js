(function() {
    'use strict';

    angular
        .module('sampleOAuth2App')
        .factory('JhiMetricsService', JhiMetricsService);

    JhiMetricsService.$inject = ['$rootScope', '$http'];

    function JhiMetricsService ($rootScope, $http) {
        var service = {
            getMetrics: getMetrics,
            threadDump: threadDump
        };

        return service;

        function getMetrics () {
            return $http.get('metrics/metrics').then(function (response) {
                return response.data;
            });
        }

        function threadDump () {
            return $http.get('dump').then(function (response) {
                return response.data;
            });
        }
    }
})();
