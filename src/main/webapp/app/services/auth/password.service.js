(function() {
    'use strict';

    angular
        .module('jhipsterOauth2SampleApplicationApp')
        .factory('Password', Password);

    Password.$inject = ['$resource'];

    function Password($resource) {
        var service = $resource('api/account/change-password', {}, {});

        return service;
    }
})();
