angular.module( 'sunshine.schedule', ['ui.router'])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'schedule', {
        url: '/schedule',
        ncyBreadcrumb: {
          label: 'Home'
        },
        views: {
            "main": {
                controller: 'ScheduleCtrl',
                templateUrl: 'schedule/schedule.tpl.html'
            }
        },
        data:{ pageTitle: 'Schedule', authorizedRoles: ['anonymous'] }
    });
})

.controller('ScheduleCtrl', function ScheduleController( $scope, Schedule) {
    var self = this;
    self.test = "cindy";
    Schedule.get_draft2('54ac67d4b69aac9a13f82b2e').then(function (data){
        self.draft =  data.draft;
    });
})
;