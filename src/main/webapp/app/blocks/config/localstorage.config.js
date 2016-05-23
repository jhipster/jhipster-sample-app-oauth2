(function() {
    'use strict';

    angular
        .module('jhipsterOauth2SampleApplicationApp')
        .config(localStorageConfig);

    localStorageConfig.$inject = ['$localStorageProvider'];

    function localStorageConfig($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('jhi-');
    }
})();
