(function () {
    'use strict';

    angular
        .module('jhipsterOauth2SampleApplicationApp')
        .factory('Register', Register);

    Register.$inject = ['$resource'];

    function Register ($resource) {
        return $resource('api/register', {}, {});
    }
})();
