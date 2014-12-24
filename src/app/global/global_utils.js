angular.module( 'sunshine.global_utils', [])

.factory('HttpInterceptor', function ($q, $window) {

  return function (promise) {
    var search_button = angular.element(document.querySelector('.fa-spinner'));
    return promise.then(function (response) {

      search_button.removeClass('fa-spinner');
      search_button.removeClass('fa-spin');
      search_button.addClass('fa-search');
      return response;
    }, function (response) {

      search_button.removeClass('fa-spinner');
      search_button.removeClass('fa-spin');
      search_button.addClass('fa-search');
      return $q.reject(response);
    });
  };
})
;
