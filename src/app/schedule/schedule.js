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

.controller('ScheduleCtrl', function ScheduleController( $scope, Schedule, GlobalVariables) {
    var self = this;
    GlobalVariables.showFooter = false;
    self.test = "cindy";
    Schedule.get_draft2('548c8ed3fe0bdfcb496d4bfe').then(function (data){
        self.draft =  data.draft;
    });
})

;
//548c8ed4fe0bdfcb496d4c08 sheriff
//548c8ed3fe0bdfcb496d4bfe DPH
//548c8ed3fe0bdfcb496d4bd9 Board f Sups
