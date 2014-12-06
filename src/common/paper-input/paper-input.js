angular.module( 'paper.input', [])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('paperInput',
    "<div ng-form=\"inputForm\"><div class=\"group paper-input\"><input type=\"{{ type }}\" ng-model=\"modelRef\" name=\"modelName\" ng-required=\"isRequired\"><span class=\"highlight\"></span><span class=\"bar\"></span><label class=\"{{ icon }}\"> {{ label }}</label></div><div>"
  );
}])

.directive('paperInput', ['$templateCache', function ($templateCache) {
  return {
        restrict: 'E',
        scope:   {
            label: '@',
            type: '@',
            modelRef: '=',
            icon : '@'
        },
        template: $templateCache.get('paperInput'),
        link: function(scope, elem, attrs){
          scope.isRequired = angular.isDefined(attrs.required);
          scope.isDatepicker = angular.isDefined(attrs.date);
          scope.state = {
            opened : false
          };

          if (scope.isDatepicker) {

            scope.openDatePicker = function($event) {
              // event.preventDefault(event);
              // event.stopPropagation();
              scope.state.opened = true;
            };

          }
        }
  }
}])


//Didn't add paper-checkbox or paper-date
;
