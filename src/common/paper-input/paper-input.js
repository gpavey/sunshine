angular.module( 'paper.input', [])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('paperInput',
    "<div ng-form=\"inputForm\"><div class=\"group paper-input\"><input type=\"{{ type }}\" ng-model=\"modelRef\" name=\"modelName\" ng-required=\"isRequired\"><span class=\"highlight\"></span><span class=\"bar\"></span><label class=\"{{ icon }}\"> {{ label }}</label></div></div>"
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
        link: function (scope, elem, attrs){

          scope.isRequired = angular.isDefined(attrs.required);
          scope.isDatepicker = angular.isDefined(attrs.date);
          scope.state = {
            opened : false
          };

          elem.bind('blur', function () {
            console.log("blur");
            elem.css("border","10px solid");
            scope.$apply();
          });
        }
  }
}])

//Didn't add paper-checkbox or paper-date
;
