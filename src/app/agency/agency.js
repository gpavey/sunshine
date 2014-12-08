angular.module( 'sunshine.agency', ['ui.router'])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'agency', {
    url: '/agency:schedule_id',
    views: {
      "main": {
        controller: 'AgencyCtrl',
        templateUrl: 'agency/agency.tpl.html'
      }
    },
    data:{ pageTitle: 'Schedule', authorizedRoles: ['anonymous'] }
  });
})
.controller( 'AgencyCtrl', function AgencyController(Schedule, $http, $q, $log, $stateParams ) {
  var self = this;
  var schedule_id = $stateParams.schedule_id;
  self.adopted = {};
  self.records = {};

  Schedule.get_adopted(schedule_id)
  .then(function (data){
    self.adopted = data[0].adopted;
    self.records = self.adopted.record;
  });

})
;
