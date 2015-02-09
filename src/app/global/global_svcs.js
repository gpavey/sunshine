angular.module( 'sunshine.global_svcs', [])


/*================================

      [ Department Object ]

==================================*/

.service('Department', function($http, $rootScope) {

  /*****************************************
  METHOD: get_adopted

  returns the adopted information about a
  department or agency
  ******************************************/
  this.get_adopted = function() {
    var apiUrl = $rootScope.API_URL;
    return $http
      .get(apiUrl + '/department')
      .then(function(res) {
        return res.data;
      });
  };

  /*****************************************
  METHOD: get_draft

  returns the draft information about a
  department or agency
  ******************************************/
  this.get_draft = function() {
    var apiUrl = $rootScope.API_URL;
    return $http
      .get(apiUrl + '/draft/department')
      .then(function(res) {
        return res.data;
      });
  };
})


/*================================

        [ Search Object ]

==================================*/
.service('Search', function($http, $rootScope) {

  var apiUrl = $rootScope.API_URL;
  search_terms = {};
  search_filters = {};


  /*****************************************
    METHOD: suggest_string

    Iterates over the suggestions
    returned by Elasticsearch
    and combines them into one string
  ******************************************/
  this.suggest_string = function(suggestObj){
      var general = suggestObj.general;
      var arr_len = general.length;
      var suggest = '';
      var count = 0;

      for(var i = 0; i < arr_len ; i++){
        if(general[i].options.length > 0){
          count++;
          suggest += general[i].options[0].text + ' ';
        }else{
          suggest += general[i].text + ' ';
        }
      }

      if(count > 0){
        return suggest;
      }else{
          return null;
      }
  };

  /*****************************************
  METHOD: set_filters

  accepts arrays from the search results page
  and converts them into the right format to
  send to Elasticsearch.
  ******************************************/
  this.set_filters = function(field, arrToAdd ){

    delete search_filters[field];

    if(arrToAdd.length > 0) {
      search_filters[field] = arrToAdd;
    }
    return search_filters;
  };

  /*****************************************
  METHOD: clear_fitlers
  ******************************************/
  this.clear_filters = function(){
    search_filters = {};
  };

  /*****************************************
  METHOD: get_fitlers
  ******************************************/
  this.get_filters = function(){
    return search_filters;
  };

  /*****************************************
  METHOD: set_terms

  takes the terms typed into the search
  textbox and converts them into JSON
  so it can be passed to Elasticsearch
  ******************************************/
  this.set_terms = function(terms){
    var json = {};
    json.terms = terms;
    search_terms = json;
  };

  /*****************************************
  METHOD: get_terms
  ******************************************/
  this.get_terms = function(){
    return search_terms;
  };

  /*****************************************
  METHOD: full_text

  This is the method that makes the HTTP
  call to the elasticsearch API. It does
  the full text search of the index
  ******************************************/
  this.full_text = function() {
    var url = apiUrl + '/search';

    var req_data = {};
    req_data.criteria = search_terms;

    req_data.filters = search_filters;

    return $http.put(url, req_data)
      .success(function(res) {
        return res.data;
      })
      .error(function(data) {
        $log.log(data);
      });
  };
})


/*================================

      [ Schedule Object ]

==================================*/

.service('Schedule', function($http, $rootScope) {

  var apiUrl = $rootScope.API_URL;

  /*****************************************
  METHOD: get_draft

  This method returns all the DRAFT data
  for a particular schedule; both the information
  about each records, and the information about the
  department.
  ******************************************/

  this.get_draft = function(dept_id) {
    //Department id used to be in $rootScope. Moved it to parameter
    return $http
      .get(apiUrl + '/draft/schedule/' + dept_id)
      .then(function(res) {
        return res.data;
      });
  };

  /*****************************************
  METHOD: get_adopted

  This method returns all the ADOPTED (aka published)
  data for a particular schedule; both the information
  about each records, and the information about the
  department.
  ******************************************/
  this.get_adopted = function(schedule_id) {

    return $http
      //.get(apiUrl + '/schedule/' + $rootScope.selected_adopted_dept)
      .get(apiUrl + '/schedule/' + schedule_id)
      .then(function(res) {
        return res.data;
      });
  };

  /*****************************************
  METHOD: save_draft_record

  Saves one record in a schedule. It is
  saved as a draft.
  ******************************************/
  this.save_draft_record = function(record) {
    var url = apiUrl + '/draft/record/';

    return $http.put(url, record)
      .success(function(data) {
        $log.log(data);
        // this.post.push(data);
      })
      .error(function(data) {
        $log.log(data);
      });
  };

  /*****************************************
  METHOD: publish

  Publishes and entire schedule such that it
  is available to the public. This affects all
  the records in a schedule as well as the
  department information
  ******************************************/
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

/*================================

      [ List of Valid Retention Categories ]

==================================*/
.value("RetentionCategories", 
    ["1 - Permanent", 
    "2 - Current", 
    "3 - Storage",
    "1 - Permanent, 2 - Current", 
    "1 - Permanent, 3 - Storage",
    "2 - Current, 3 - Storage",
    "1 - Permanent, 2 - Current, 3 - Storage",
    "4 - No Retention Required"
  ])
;
