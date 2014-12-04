angular.module('cc.slide.menu', [])
.factory('ccButtonSvc', ['ccMenuSvc', function(ccMenuSvc){

  var show_hide =
  function(){
    var placement = ccMenuSvc.getPlacement();
    var menu = angular.element(document.querySelector('.cc-menu'));
    var content = angular.element(document.querySelector('.cc-content'));
    var current_size = ccMenuSvc.getCurrentSize();

    if(menu.hasClass('cc-menu-close')){ //open menu and push content
      menu.removeClass('cc-menu-close');
      menu.addClass('cc-menu-open');
      switch (placement) {
        case "left":
          content.css('margin-left', current_size + "px")
          console.log('left');
          break;
        // case "right":
        //   content.css('margin-right', current_size + "px")
        //   console.log('right');
        //   break;
        // case "top":
        //   content.css('margin-top', current_size + "px")
        //   break;
        // case "bottom":
        //   content.css('margin-bottom', current_size + "px")
        //   break;
        }
    }else{ //close menu and push content
      menu.removeClass('cc-menu-open');
      menu.addClass('cc-menu-close');

      content.css('margin', '0px');

    }
  }

  return{
    toggle: function(){
        var menu = angular.element(document.querySelector('.cc-menu'));

        if(menu.hasClass('cc-menu-close')){
          menu.removeClass('cc-menu-close');
          menu.addClass('cc-menu-open');
        }else{
          menu.removeClass('cc-menu-open');
          menu.addClass('cc-menu-close');
        }
    },
    containerClose: function(e, win_width, win_height){
      var placement = ccMenuSvc.getPlacement();
      var current_size = ccMenuSvc.getCurrentSize();
      var is_menu_click = true;
      var is_menu_button = e.target.attributes.getNamedItem('cc-button');

      // exit if the click event if from the menu button
      if(is_menu_button != null) return ;

      //is this click event from the menu?
      if(e.x >= current_size){
        is_menu_click = false;
      }

      // if(e.y > current_size && placement == 'top'){
      //   is_menu_click = false;
      // }
      //
      // if(e.x < (win_width - current_size) && placement == 'right'){
      //   is_menu_click = false;
      // }
      //
      // if(e.y  < (win_height - current_size) && placement == 'bottom'){
      //   is_menu_click = false;
      // }

      // show or hide menu and push content if click is not from menu
      if(!is_menu_click){
        show_hide();
      }
    }
  }
}])
.factory('ccMenuSvc', function(){
  // ---------------- DEFAULTS --------------//
  var width = '320px';
  var height = '150px';
  var placement = 'left';
  var start_open = false;
  var current_size = '';

  return {
    getWidth: function(){return width;},
    setWidth: function(val){
                    if(typeof val !== 'undefined') {
                      width = val;
                      current_size = parseInt(width);
                    }
                },
    getHeight: function(){return height;},
    setHeight: function(val){
                    if(typeof val !== 'undefined'){
                      height = val;
                      current_size = parseInt(height);
                    }
                },
    getPlacement: function(){return placement;},
    setPlacement: function(val){if(typeof val !== 'undefined') placement = val.toLowerCase()},
    getStartOpen: function(){return start_open;},
    setStartOpen: function(val){if(val == 'true'){start_open = true}else{start_open = false}},
    getCurrentSize: function(){return current_size;}
  }
})
.directive('ccContent', ['ccMenuSvc', function (ccMenuSvc) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope, elem, attrs) {
      elem.addClass('cc-content');
      elem.css('width', 'calc(100% - ' + ccMenuSvc.getWidth() + ')');
    }
  }
}])
.directive('ccMenu', ['ccMenuSvc', 'ccButtonSvc', function (ccMenuSvc, ccButtonSvc) {
  return {
    restrict: 'E',
    scope: {
      ccWidth: '@',
      ccHeight:'@',
      ccPlacement: '@',
      ccStartOpen: '@'
      },
      link: function (scope, elem, attrs) {

        ccMenuSvc.setWidth(scope.ccWidth);
        ccMenuSvc.setHeight(scope.ccHeight);
        ccMenuSvc.setPlacement(scope.ccPlacement);
        ccMenuSvc.setStartOpen(scope.ccStartOpen);

        // menu starting position [open || close]
        if(ccMenuSvc.getStartOpen()){
          elem.addClass('cc-menu cc-menu-open');
        }else{
          elem.addClass('cc-menu cc-menu-close');
        }

        //menu placement
        switch ( ccMenuSvc.getPlacement()) {
          case "left":
            elem.addClass('cc-menu-vertical cc-menu-left');
            elem.css('width', ccMenuSvc.getWidth());
            break;
          // case "right":
          //   elem.addClass('cc-menu-vertical cc-menu-right');
          //   x = angular.element(document.querySelectorAll('.cc_menu-right'));
          //   elem.css('width', ccMenuSvc.getWidth());
          //   break;
          // case "top":
          //   elem.addClass('cc-menu-horizontal cc-menu-top');
          //   elem.css('width', ccMenuSvc.getWidth());
          //   break;
          // case "bottom":
          //   elem.addClass('cc-menu-horizontal cc-menu-bottom');
          //   elem.css('width', ccMenuSvc.getWidth());
          //   break;
        }
       }
     }
  }])
  .directive('ccButton', ['ccButtonSvc', 'ccMenuSvc', '$window', function (ccButtonSvc, ccMenuSvc, $window) {
    return {
      restrict : 'AE',
      scope: true,
      link: function(scope, elem, attr){

        elem.bind('click', ccButtonSvc.toggle);
        elem.addClass('cc-button');

        //add click event to close the menu when area outside menu is clicked
        body = angular.element(document.querySelectorAll('body'));
        var win_width = $window.innerWidth;
        var win_height = $window.innerHeight;
      //  body.bind('click', function(e){ccButtonSvc.containerClose(e, win_width, win_height)});
      }
    };
  }])
;
