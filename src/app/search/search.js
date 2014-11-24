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

.controller('SearchCtrl', function SearchController(Search) {

  var self = this;
  self.results = {};

  //***** Just for testing - REMOVE later **////
  Search.set_terms("transportation");

  Search.full_text()
    .success(function(data, status){
      self.results = data.hits.hits;
    })
    .error(function(err, status){
    });

})
;
