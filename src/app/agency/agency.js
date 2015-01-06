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

  $stateProvider.state( 'agency_list', {
    url: '/agency_list:schedule_id',
    views: {
      "main": {
        controller: 'AgencyCtrl',
        templateUrl: 'agency/agency_list.tpl.html'
      }
    },
    data:{ pageTitle: 'Schedule', authorizedRoles: ['anonymous'] }
  });
})
.controller( 'AgencyCtrl', function AgencyController(Schedule, $http, $q, $log, $stateParams) {
  var self = this;
  self.schedule_id = $stateParams.schedule_id;
  self.adopted = {};
  self.records = {};

  Schedule.get_adopted(self.schedule_id)
  .then(function (data){
    self.adopted = data[0].adopted;
    self.records = self.adopted.record;
  });

})
;
