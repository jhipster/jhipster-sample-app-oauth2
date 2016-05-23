(function() {
    'use strict';

    angular
        .module('jhipsterOauth2SampleApplicationApp')
        .factory('Account', Account);

    Account.$inject = ['$resource'];

    function Account ($resource) {
        var service = $resource('api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });

        return service;
    }
})();
