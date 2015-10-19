'use strict';

angular.module('sampleOAuth2App')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


