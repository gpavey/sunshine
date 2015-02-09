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

    $stateProvider.state( 'console.edit2', {
      url: '/edit2',
      views: {
        "console": {
          templateUrl: 'console/edit/edit2.tpl.html'
        }
      },
      data:{ pageTitle: 'Administration - Edit', authorizedRoles: ['admin', 'editor', 'anonymous'] }
    });

  })



  .directive("contenteditable", function() {
    return {
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };

        element.bind("blur keyup change", function() {
          scope.$apply(read);
        });
      }
    };
  })

   .controller('EditCtrl', function EditCtrl($rootScope, $interval, $http, Schedule, GlobalVariables, RetentionCategories ) {
    
      var self = this;
      self.retention_categories = RetentionCategories;
      GlobalVariables.showFooter = true;
      this.selected = undefined;
    
      self.saveRow = function( rowEntity ) {
      // create a fake promise - normally you'd use the promise returned by $http or $resource
      // var promise = $q.defer();
      // $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

      // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
      // $interval( function() {
      //   if (rowEntity.gender === 'male' ){
      //     promise.reject();
      //   } else {
      //     promise.resolve();
      //   }
      // }, 500, 1);

      // Schedule.save_draft_record(rowEntity)
      //   .then(function (data){
      //   });
    };

    $rootScope.$watch('selected_draft_dept', function(newVal, oldVal) {
      Schedule.get_draft(newVal)
        .then(function (data){
            self.draft_records = [];
            self.draft_dept = data;

            var records = data.draft.record;
            var len = records.length;
            var max_record_threshold = 100;

            //add all records to scope
            if(len<=max_record_threshold){
                self.draft_records = records;
            }

            //add the first clump of records to scope(max_record_threshold), then add in batches
            if(len > max_record_threshold){
              var batch_size = 40;

              //add the first batch of records to scope (up to max_record_threshold about)
              for(i=0; i<max_record_threshold; i++){
                self.draft_records.push(records[i]);
              }
              
              //add batches
              var overage = len - max_record_threshold;
              var intervals = Math.floor(overage/batch_size);
              var remainder = overage%batch_size;

              var lbound = max_record_threshold;
              var ubound = batch_size;
              
              if(remainder > 0){intervals++;}

              //pause for a millisecond between batches so that the DOM
              $interval( function() {
                if((len-lbound) < batch_size){
                  ubound = lbound + remainder;
                }else{
                  ubound = lbound+batch_size;
                }

                for (lbound=lbound; lbound<ubound; lbound++){
                  self.draft_records.push(records[lbound]);
                }
              }, 1, intervals);

            }    

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

    self.publish = function(){
      Schedule.publish($rootScope.selected_draft_dept);
    };
});
