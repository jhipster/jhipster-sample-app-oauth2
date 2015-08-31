'use strict';

angular.module('sampleoauth2App')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
