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


  .controller('EditCtrl', function EditCtrl($rootScope, $interval, $http, Schedule, GlobalVariables, EditTableConfig, EditTableFunctions) {

    GlobalVariables.showFooter = true;
    var thisHandsontable;
    var edit_schedule;
    var self = this;

    edit_schedule = document.getElementById('edit-schedule');

    $rootScope.$watch('selected_draft_dept', function(newVal, oldVal) {

      if(typeof thisHandsontable == 'undefined'){

        // Basic Handsontable configuration
        EditTableConfig.afterChange = EditTableFunctions.autoSave;
        EditTableConfig.beforeRemoveRow = EditTableFunctions.beforeRemoveRow;
        EditTableConfig.columns[1].source = EditTableFunctions.divisionAutoComplete;
        EditTableConfig.columns[2].source = EditTableFunctions.categoryAutoComplete;
        thisHandsontable = new Handsontable(edit_schedule, EditTableConfig);
      }


      Schedule.get_draft(newVal)
        .then(function (data){

             edit_schedule.style.visibility = 'hidden';
             var l = EditTableFunctions.getFittedColumnWidths.call(thisHandsontable, data.draft.record);
             var settings = thisHandsontable.getSettings();
             settings.manualColumnResize = [1, l.division, l.category, l.title, l.link, l.retention, l.on_site, l.off_site, l.total, l.remarks ];
             EditTableFunctions.setDraftDept(data._id);

             thisHandsontable.loadData(data.draft.record);
             thisHandsontable.updateSettings(settings);
             edit_schedule.style.visibility = 'visible';
             self.draft_dept = data;
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
      //$rootScope.selected_draft_dept = "548c8ed3fe0bdfcb496d4bfe"; //Public Health
      $rootScope.selected_draft_dept = "548c8ed4fe0bdfcb496d4c08"; //Sherrif
    }

    if ( typeof $rootScope.selected_adopted_dept === 'undefined'){
      $rootScope.selected_adopted_dept = "5452b9e058779c197dfd05caz";
    }

    self.publish = function(){
      Schedule.publish($rootScope.selected_draft_dept);
    };
})
 .factory('EditTableFunctions',["Schedule", function(Schedule){
   var draft_dept;

   return {

     getFittedColumnWidths : function(){

       var recordArr = arguments[0];
       var sorter = function (property) {
           return function (a,b) {
             if(b[property] != null){bLength = b[property].length;}else{bLength = 0;}
             if(a[property] != null){aLength = a[property].length;}else{aLength = 0;}
             return bLength - aLength;
         };
       };

       cols = this.getSettings().columns;
       var l = {};
       var longest = {};
       var col;
       var val;
       for(var i = 1; i < cols.length; i++){

         longest = recordArr.sort(sorter(cols[i].data))[0];
         col = cols[i].data;

         if(longest[col] == null){
           val = 100;
         }else{
           val = longest[col].visualLength() + 20;
         }

         if (val > 800) {val = 800;}
         l[col] = val;
       }

       return l;
     },

     setDraftDept: function(id){
       draft_dept = id;
     },


     //Autosave function
     autoSave : function(change,source){
       var self = this;

       if (source === 'loadData') {return;} //dont' save this change
       if (source === 'insertId') {return;} // stops an enless loop when the new record id is added after an insert

       var data = change[0];

       // transform sorted row to original row
       var rowNumber = this.sortIndex[data[0]] ? this.sortIndex[data[0]][0] : data[0];
       var row = this.getSourceDataAtRow(rowNumber);
       row.dept_id = draft_dept;

       Schedule.save_draft_record(row).then(function(res){
         self.setDataAtCell(rowNumber,0, res.data.record_id, "insertId");
       });
     },


     // Division Autocomplete Function
     divisionAutoComplete : function(query, process){
        var vals = this.instance.getDataAtCol(1);
        var uniqueVals = vals.unique().sort().nulless();
        process(uniqueVals);
     },


     // Division Autocomplete Function
     categoryAutoComplete : function(query, process){

       var vals = this.instance.getDataAtCol(2);
       var uniqueVals = vals.unique().sort().nulless();

       process(uniqueVals);
     },


     //remove one record from the database
     beforeRemoveRow : function(index, amount){
       var rowNumber = this.sortIndex[index] ? this.sortIndex[index][0] : index;
       var row = this.getSourceDataAtRow(rowNumber);
       row.dept_id = draft_dept;

       Schedule.delete_draft_record(row).
       success(function(res){

       })
       .error(function(err){
         console.log(err);
       });
     }


   };
 }])

.factory('EditTableConfig', function (RetentionCategories) {

    // basic config
    var config = {};
    config.colHeaders = true;
    config.autoColumnSize = false;
    config.manualColumnResize = true;
    config.currentRowClassName = "current-row";
    config.minSpareRows = 1;
    config.columnSorting = {column:1};
    config.fixedRowsTop = 0;
    config.autoWrapRow = true;
    config.contextMenu = ["row_above", "row_below", "remove_row"];
  //  config.colWidths = [1];
    config.colHeaders = ["_id","Division","Category", "Title", "Link", "Retention", "On-site", "Off-site", "Total", "Remarks"];

    //schema for empty row
    config.dataSchema={_id:null, division:null, category:null, title:null, link:null, retention:null, on_site:null, off_site:null, total:null, remarks:null};

    config.columns = [];
    //_id Column (hidden)
    config.columns.push({"data":"_id"});

    //Division Column
    var divisionConfig = {};
    divisionConfig.data = "division";
    divisionConfig.type = "autocomplete";
    divisionConfig.strict = false;
    config.columns.push(divisionConfig);


    //Category Column
    var categoryConfig = {};
    categoryConfig.data = "category";
    categoryConfig.type = "autocomplete";
    categoryConfig.strict = false;
    config.columns.push(categoryConfig);

    //Title Column
    config.columns.push({"data":"title"});

    //Link Column
    config.columns.push({"data":"link"});

    // Retention Column
    var retentionConfig = {};
    retentionConfig.data = "retention";
    retentionConfig.type = "autocomplete";
    retentionConfig.source = RetentionCategories;
    retentionConfig.strict = true;
    retentionConfig.allowInvalid = false;
    config.columns.push(retentionConfig);

    // On-site Column
    config.columns.push({"data":"on_site"});

    //Off-site Column
    config.columns.push({"data":"off_site"});

    //total Column
    config.columns.push({"data":"total"});

    //Remarks Column
    config.columns.push({"data":"remarks"});

    return config;
})
;
