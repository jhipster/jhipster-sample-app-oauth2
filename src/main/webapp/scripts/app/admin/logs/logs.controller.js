'use strict';

angular.module('sampleoauth2App')
    .controller('LogsController', function ($scope, LogsService) {
        $scope.loggers = LogsService.findAll();

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        };
    });
