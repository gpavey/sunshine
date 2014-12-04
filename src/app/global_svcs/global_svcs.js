angular.module( 'sunshine.global_svcs', [])

// Department Related API Calls
.service('DepartmentList', function($http, $rootScope, $log) {
  this.get_adopted = function() {
    var apiUrl = $rootScope.API_URL;
    return $http
      .get(apiUrl + '/department')
      .then(function(res) {
        return res.data;
      });
  };

  this.get_draft = function() {
    var apiUrl = $rootScope.API_URL;
    return $http
      .get(apiUrl + '/draft/department')
      .then(function(res) {
        return res.data;
      });
  };
})

//Search Related API Calls
.service('Search', function($http, $rootScope, $log) {

  var apiUrl = $rootScope.API_URL;

  search_terms = {};

  this.set_terms = function(terms){
    var json = {};
    json.terms = terms;
    search_terms = json;
  };

  this.get_terms = function(){
    return search_terms;
  };

  this.get_result_count = function(){
    return result_count;
  };

  this.full_text = function() {
    var url = apiUrl + '/search';

    return $http.put(url, search_terms)
      .success(function(res) {
        return res.data;
      })
      .error(function(data) {
        $log.log(data);
      });
  };
})

//Schedule Related API Calls
.service('Schedule', function($http, $rootScope, $log) {

  var apiUrl = $rootScope.API_URL;

  this.get_draft = function() {
    return $http
      .get(apiUrl + '/draft/schedule/' + $rootScope.selected_draft_dept)
      .then(function(res) {
        return res.data;
      });
  };

  this.get_adopted = function() {
    return $http
      .get(apiUrl + '/schedule/' + $rootScope.selected_adopted_dept)
      .then(function(res) {
        return res.data;
      });
  };

  this.saveDraftRecord = function(record) {
    var url = apiUrl + '/draft/record/';
    console.log(url);

    return $http.put(url, record)
      .success(function(data) {
        $log.log(data);
        // this.post.push(data);
      })
      .error(function(data) {
        $log.log(data);
      });
  };

  this.publish = function(schedule) {
    var url = apiUrl + '/publish/';

    return $http.post(url + schedule)
      .success(function(data) {})
      .error(function(data) {
        $log.log({
          "fail": "sad face"
        });
        $log.log(data);
      });
  };
})

;
