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

.controller('SearchFormCtrl', function SearchFormController( $scope, $state, Search ) {
  var self = this;

  this.submitSearch = function(){
    Search.set_terms (self.terms);
    $state.go('search');

  };
})
.controller('SearchCtrl', function SearchController($scope, $state, Search) {

  var self = this;
  self.results = {};
  self.aggs = {};
  self.terms = Search.get_terms().terms;
  self.count = null;

  Search.full_text()
  .success(function(data, status){
    self.results = data.hits.hits;
    self.aggs = data.aggregations;
  })
  .error(function(err, status){
  });

   $scope.submitMainSearch = function(){
     Search.set_terms (self.terms);
     Search.full_text()
     .success(function(data, status){
       self.results = data.hits.hits;
       self.aggs = data.aggregations;
       self.count = data.hits.total;
     })
     .error(function(err, status){
     });

   };
})
;
