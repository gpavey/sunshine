angular.module( 'sunshine.agency', ['ui.router'])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'agency', {
    url: '/agency',
    views: {
      "main": {
        controller: 'AgencyCtrl',
        templateUrl: 'agency/agency.tpl.html'
      }
    },
    data:{ pageTitle: 'Schedule', authorizedRoles: ['anonymous'] }
  });
})
.controller( 'AgencyCtrl', function AgencyController(Schedule, $http, $q, $log ) {
  var self = this;

  self.adopted = {};
  self.gridOptions = {};

  Schedule.get_adopted("5461126845d9cd910de77954")
  .then(function (data){
    self.adopted = data[0].adopted;
    self.gridOptions.data = data[0].adopted.record;
  });


  self.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    columnDefs : [
    {
      name:'Category',
      field:'category'
    },
    {
      name:'Title',
      field:'title'
    },
    {
      name:'Link',
      field:'link'
    },
    {
      name:'Division',
      field:'division'
    },
    {
      name:'Retention',
      field:'retention'
    },
    {
      name:'On Site',
      field:'on_site'
    },
    {
      name:'Off Site',
      field:'off_site'
    },
    {
      name:'Total',
      field:'total'
    },
    {
      name:'Remarks',
      field:'remarks'
    }
    ]
  };

})
;
