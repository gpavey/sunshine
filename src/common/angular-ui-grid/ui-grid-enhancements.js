/****************************
This module is an enhacement to 
ui grid. It creates a cell template
that is an input with typeahead
(aka autocomplete)
**********************************/


(function () {
  'use strict';
  angular.module('ui.grid.enhancements', []);
})();
  
angular.module('ui.grid.enhancements').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ui-grid-enhancements/cellEditorAutoComplete',
      "<div><form name=\"inputForm\"><input type=\"{{inputType}}\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" typeahead=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray| filter:$viewValue | unique:'category' | limitTo:8\"></form></div>"
  );

}]);
