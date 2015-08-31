'use strict';

angular.module('sampleoauth2App')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


