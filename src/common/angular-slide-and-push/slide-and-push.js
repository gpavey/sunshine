angular.module('cc.slide.menu', [])
.factory('ccButtonSvc', ['ccMenuSvc', function(ccMenuSvc){
  return{
    toggle: function(){
        var pos = 0
        var placement = ccMenuSvc.getPlacement();
        var current_size = ccMenuSvc.getCurrentSize();
        var menu = angular.element(document.querySelector('.cc-menu'));
        var body = angular.element(document.querySelector('body'));
        var location = parseInt(menu.css(placement));
        var orientation = placement == 'left' || placement == 'right' ? 'vertical' : 'horizontal';

        //toggle visibility of the menu
        pos = parseInt(menu.css(ccMenuSvc.getPlacement()));
        pos = (pos + ccMenuSvc.getCurrentSize()) * -1;
        pos += "px";
        menu.css(ccMenuSvc.getPlacement(), pos);

        //toggle html body push
        if(ccMenuSvc.getPush()){
          //vertical menu off screen
          if(location >= 0 && orientation == 'vertical'){
            body.css('left', '0px');
          }

          //vertical menu on screen
          if(location < 0 && orientation == 'vertical'){
            if(placement == 'left'){
              body.css('left', current_size + "px");
            }

            if(placement == 'right'){
              body.css('left', (current_size * -1) + "px");
            }
          }

          //horizontal menu off screen
          if(location >= 0 && orientation == 'horizontal'){
            body.css('top', '0px');
          }

          //horizontal menu on screen
          if(location < 0 && orientation =='horizontal'){
            if(placement == 'top'){
              body.css('top', current_size + "px");
            }

            if(placement == 'bottom'){
              body.css('top', (current_size * -1) + "px");
            }
          }
        }
    },
    bodyClose: function(e, win_width, win_height){
      var current_size = ccMenuSvc.getCurrentSize();
      var placement = ccMenuSvc.getPlacement();
      var menu = angular.element(document.querySelector('.cc-menu'));
      var body = angular.element(document.querySelector('body'));
      var is_menu_button = e.target.attributes.getNamedItem('cc-button');;

      if(is_menu_button != null) return ;

      if(e.x > current_size && placement == 'left'){

        menu.css('left', "-" + current_size + "px");
        body.css('left', '0px');
      }

      if(e.y > current_size && placement == 'top'){

        menu.css('top', "-" + current_size + "px");
        body.css('top', '0px');
      }

      if(e.x < (win_width - current_size) && placement == 'right'){

        menu.css('right', "-" + current_size + "px");
        body.css('left', '0px');
      }
      if(e.y  < (win_height - current_size) && placement == 'bottom'){

        menu.css('bottom', "-" + current_size + "px");
        body.css('top', '0px');
      }
    }
  }
}])
.factory('ccMenuSvc', function(){
  var width = '320px';
  var height = '150px';
  var placement = 'left';
  var push = true;
  var current_size = 320;
  var current_px = '320px';
  var start_open = false;

  return {
    getWidth: function(){return width;},
    setWidth: function(val){
                    if(typeof val !== 'undefined') {
                      width = val;
                      current_px = width;
                      current_size = parseInt(width);
                    }
                },
    getHeight: function(){return height;},
    setHeight: function(val){
                    if(typeof val !== 'undefined'){
                      height = val;
                      current_px = height;
                      current_size = parseInt(height);
                    }
                },
    getPlacement: function(){return placement;},
    setPlacement: function(val){if(typeof val !== 'undefined') placement = val.toLowerCase()},
    getPush: function(){return push;},
    setPush: function(val){if(val == 'false'){push = false}else{val = true}},
    getStartOpen: function(){return start_open;},
    setStartOpen: function(val){if(val == 'true'){start_open = true}else{start_open = false}},
    getCurrentSize: function(){return current_size;},
    initStyling: function(elem){
          elem.addClass('cc-menu');
          elem.css(placement, "-" + current_px);

          if(placement == 'right' || placement == 'left'){
            elem.addClass('cc-menu-vertical');
            elem.css('width', current_px);
          }

          if(placement == 'bottom' || placement == 'top'){
            elem.addClass('cc-menu-horizontal');
            elem.css('height', current_px);
          }
        }
  }
})
.directive('ccMenu', ['ccMenuSvc', 'ccButtonSvc', function (ccMenuSvc, ccButtonSvc) {
  return {
    restrict: 'A',
    scope: {
      ccWidth: '@',
      ccHeight:'@',
      ccPlacement: '@',
      ccPush: '@',
      ccStartOpen: '@'
      },
      link: function (scope, elem, attrs) {

        ccMenuSvc.setWidth(scope.ccWidth);
        ccMenuSvc.setHeight(scope.ccHeight);
        ccMenuSvc.setPlacement(scope.ccPlacement);
        ccMenuSvc.setPush(scope.ccPush);
        ccMenuSvc.setStartOpen(scope.ccStartOpen);

        body = angular.element(document.querySelector('body'));
        body.addClass('cc-menu-push');

        ccMenuSvc.initStyling(elem);

        if(ccMenuSvc.getStartOpen() == true){
          ccButtonSvc.toggle();
        }
       }

    }
  }])
  .directive('ccButton', ['ccButtonSvc', '$window', function (ccButtonSvc, $window) {
    return {
      restrict : 'A',
      scope: true,
      link: function(scope, elem, attr){

        elem.bind('click', ccButtonSvc.toggle);

        var body = angular.element(document.querySelector('body'));
        var win_width = $window.innerWidth;
        var win_height = $window.innerHeight;

        body.bind('click', function(e){ccButtonSvc.bodyClose(e, win_width, win_height)});
      }
    };
  }])
;
