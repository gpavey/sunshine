angular.module( 'sunshine.search', ['ui.router'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */

.config(function config( $stateProvider ) {
    $stateProvider.state( 'search', {
        url: '/search',
        views: {
            "main": {
                controller: 'SearchCtrl',
                templateUrl: 'search/search.tpl.html'
            }
        },
        data:{ pageTitle: 'Search Results', authorizedRoles: ['anonymous'] }
    });
})

.controller('SearchCtrl', function ($scope, $state, Search) {

  var self = this;
  self.results = {};
  self.aggs = {};
  self.terms = Search.get_terms().terms;
  self.count = null;
  self.suggestion = '';

  self.dept_sel = [];
  self.division_sel = [];
  self.category_sel = [];
  self.retention_sel = [];

  Search.clear_filters();

  $scope.$watch(
    function(){
      return self.dept_sel.toString();
    },
    function(newVal, oldVal){
      Search.set_filters('department.og', self.dept_sel);

      Search.full_text()
      .success(function(data, status){
        if(typeof data.hits != 'undefined'){
          self.results = data.hits.hits;
          self.aggs = data.aggregations;
          self.suggestion = Search.suggest_string(data.suggest);
          self.count = data.hits.total;
        }
      })
      .error(function(err, status){
      });
    }
  );


  $scope.$watch(
    function(){
      return self.category_sel.toString();
    },
    function(newVal, oldVal){
      Search.set_filters('category.og', self.category_sel);

      Search.full_text()
      .success(function(data, status){

        if(typeof data.hits != 'undefined'){
          self.results = data.hits.hits;
          self.aggs = data.aggregations;
          self.suggest = Search.suggest_string(data.suggest);
          self.count = data.hits.total;
        }
      })
      .error(function(err, status){
      });
    }
  );

  // $scope.$watch(
  //   function(){
  //     return self.division_sel.toString();
  //   },
  //   function(newVal, oldVal){
  //     Search.set_filters('division.og', self.division_sel);
  //     console.log("division watch");
  //
  //     Search.full_text()
  //     .success(function(data, status){
  //       self.results = data.hits.hits;
  //       self.aggs = data.aggregations;
  //       self.count = data.hits.total;
  //     })
  //     .error(function(err, status){
  //     });
  //   }
  // );

  $scope.$watch(
    function(){
      return self.retention_sel.toString();
    },
    function(newVal, oldVal){
      Search.set_filters('retention.og', self.retention_sel);

      Search.full_text()
      .success(function(data, status){

        if(typeof data.hits != 'undefined'){
          self.results = data.hits.hits;
          self.aggs = data.aggregations;
          self.suggest = Search.suggest_string(data.suggest);
          self.count = data.hits.total;
        }
      })
      .error(function(err, status){
      });
    }
  );
  //-----------TESTING ONLY -------------//
  //Search.set_terms("clinic agenda");
  //-------------------------------------//

  // Search.full_text()
  // .success(function(data, status){
  //   self.results = data.hits.hits;
  //   self. aggs = data.aggregations;
  //   self.count = data.hits.total;
  // })
  // .error(function(err, status){
  // });

 this.submitMainSearch = function(){
  console.log("submitMainSearch");
  self.dept_sel = [];
  self.division_sel = [];
  self.category_sel = [];
  self.retention_sel = [];

   Search.set_terms (self.terms);
   Search.full_text()
   .success(function(data, status){
     self.results = data.hits.hits;
     self.aggs = data.aggregations;
     self.suggest = Search.suggest_string(data.suggest);
     self.count = data.hits.total;
   })
   .error(function(err, status){
   });

 };
})

;
