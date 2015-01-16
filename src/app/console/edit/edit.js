angular.module( 'sunshine.edit', [
    'ui.router',
    'ui.bootstrap'
  ])

  .config(function config( $stateProvider ) {

    $stateProvider.state( 'console.edit', {
      url: '/edit',
      views: {
        "console": {
          templateUrl: 'console/edit/edit.tpl.html'
        }
      },
      data:{ pageTitle: 'Administration - Edit', authorizedRoles: ['admin', 'editor', 'anonymous'] }
    });
  })

   .controller( 'EditCtrl', function ScheduleCtrl( $rootScope, $scope, Schedule, $http, $interval, $q, $log ) {

    $scope.selected = undefined;

    $scope.gridOptions = {
      enableCellEditOnFocus: true,
      enableSorting: true,
      enableFiltering: true,
      autoCompleteVar: 'auto_complete_val',
      columnDefs : [
        {
          name:'Category',
          field:'category',
          width:'200',
          editableCellTemplate: 'ui-grid-enhancements/cellEditorAutoComplete'
        },
        {
          name:'Title',
          field:'title',
          width:'300'
        },
        {
          name:'Link',
          field:'link',
          width:'200'
        },
        {
          name:'Division',
          field:'division',
          width:'200'
        },
        {
          name:'Business Unit',
          field:'business_unit',
          width:'200'
        },
        {
          name:'Retention',
          displayName: 'Retention',
          field:'retention',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          width:'200',
          editDropdownValueLabel: 'value',
          editDropdownOptionsArray: [
            { id: '1 - Permanent', value: '1 - Permanent' },
            { id: '2 - Current', value: '2 - Current' },
            { id: '3 - Storage' , value: '3 - Storage' },
            { id: '1 - Permanent, 2 - Current', value: '1 - Permanent, 2 - Current' },
            { id: '1 - Permanent, 3 - Storage', value: '1 - Permanent, 3 - Storage' },
            { id: '2 - Current, 3 - Storage', value: '2 - Current, 3 - Storage' },
            { id: '1 - Permanent, 2 - Current, 3 - Storage' , value: '1 - Permanent, 2 - Current, 3 - Storage' },
            { id: '4 - No Retention', value: '4 - No Retention' }
          ]
        },
        {
          name:'On Site',
          field:'on_site',
          width:'100'
        },
        {
          name:'Off Site',
          field:'off_site',
          width:'100'
        },
        {
          name:'Total',
          field:'total',
          width:'100'
        },
        {
          name:'Remarks',
          field:'remarks',
          width:'200'
        }
      ]
    };

    $scope.saveRow = function( rowEntity ) {
      // create a fake promise - normally you'd use the promise returned by $http or $resource
      var promise = $q.defer();
      $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

      // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
      $interval( function() {
        if (rowEntity.gender === 'male' ){
          promise.reject();
        } else {
          promise.resolve();
        }
      }, 500, 1);

      Schedule.save_draft_record(rowEntity)
        .then(function (data){
        });
    };

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $rootScope.$watch('selected_draft_dept', function(newVal, oldVal) {
      Schedule.get_draft()
        .then(function (data){
          $scope.draft_records = data.draft.record;
          //$scope.gridOptions.data =  data.draft.record;
          $scope.draft_dept = data;
          $scope.gridOptions.columnDefs[0].editDropdownOptionsArray = data.record;
          $scope.gridOptions.columnDefs[0].editDropdownValueLabel = 'category';
          $scope.gridOptions.columnDefs[0].editDropdownIdLabel = 'category';

        });
    });

    $rootScope.$watch('selected_adopted_dept', function(newVal, oldVal) {
      // Schedule.get_adopted()
      //   .then(function (data){
      //     $scope.gridOptions.data =  data.record;
      //     $scope.draft_schedule = data;
      //   });
    });

    // set selected department when the page first loads
    if ( typeof $rootScope.selected_draft_dept === 'undefined'){
      //$rootScope.selected_draft_dept = "548c8ed3fe0bdfcb496d4bf9"; //MUNI
      $rootScope.selected_draft_dept = "548c8ed3fe0bdfcb496d4bfe"; //Public Health
      $rootScope.selected_draft_dept = "548c8ed4fe0bdfcb496d4c08"; //Sherrif
    }

    if ( typeof $rootScope.selected_adopted_dept === 'undefined'){
      $rootScope.selected_adopted_dept = "5452b9e058779c197dfd05caz";
    }

    $scope.publish = function(){
      console.log("1st publish call");
      Schedule.publish($rootScope.selected_draft_dept);
    };
});
