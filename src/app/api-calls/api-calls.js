angular.module( 'sunshine.api-calls', [
        'ui.router',
        'ui.bootstrap'
    ])

    .config(function config( $stateProvider ) {

//        $stateProvider.state( 'console.edit', {
//            url: '/edit',
//            views: {
//                "console": {
//                    //controller: 'EditCtrl',
//                    templateUrl: 'console/edit/edit.tpl.html'
//                }
//            },
//            data:{ pageTitle: 'Administration', authorizedRoles: ['admin', 'editor', 'anonymous'] }
//        });
    })

    .controller( 'ApiCallsCtrl', function ApiCallsCtrl( $scope ) {
        // This is simple a demo for UI Bootstrap.

    })

    .service('DepartmentList', function($http, $rootScope, $log){
      this.get_adopted = function(){
        var apiUrl = $rootScope.API_URL;
        return $http
          .get(apiUrl + '/department')
          .then(function (res) {
              return res.data;
          });
      };

      this.get_draft = function(){
        var apiUrl = $rootScope.API_URL;
        return $http
          .get(apiUrl + '/draft/department')
          .then(function (res) {
            return res.data;
          });
      };
    })

    .service('Search', function($http, $rootScope, $log){
      this.full_text = function(terms){
        var url = apiUrl + '/search/';
        return $http.put(url , terms)
          .success(function(data){
            $log.log(data);
           // this.post.push(data);
          })
          .error(function(data){
            $log.log(data);
          });
      };
    })

    .service('Schedule', function($http, $rootScope, $log){

      var apiUrl = $rootScope.API_URL;

      this.get_draft = function(){
        return $http
        .get(apiUrl + '/draft/schedule/' + $rootScope.selected_draft_dept)
        .then(function (res) {
            return res.data;
        });
      };

      this.get_adopted = function(){
        return $http
          .get(apiUrl + '/schedule/' + $rootScope.selected_adopted_dept)
          .then(function (res) {
            return res.data;
          });
      };

      this.saveDraftRecord = function(record){
        var url = apiUrl + '/draft/record/';
        return $http.put(url , record)
          .success(function(data){
            $log.log(data);
           // this.post.push(data);
          })
          .error(function(data){
            $log.log(data);
          });
      };

      this.publish = function(schedule){
        var url = apiUrl + '/publish/';
        $log.log("second publish call" + url + schedule);
        return $http.post(url + schedule)
          .success(function(data){
            $log.log({"sucess":"happy days"});
            $log.log(data);
           // this.post.push(data);
          })
          .error(function(data){
            $log.log({"fail":"sad face"});
            $log.log(data);
          });
      };
    });
