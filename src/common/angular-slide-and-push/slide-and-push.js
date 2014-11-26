angular.module('cc.slide.menu', [])
.service('ccOptions', function() {

    //Default values
    this.width = '320px';
    this.height = '150px';
    this.current_size = '';
    this.placement = 'left';
    this.push = true;

})
.directive('ccMenu', ['ccOptions', function (ccOptions) {
  return {
    restrict: 'A',
    scope: {
      ccWidth: '@',
      ccHeight:'@',
      ccPlacement: '@',
      ccPush: '@'
      },
      link: function (scope, elem, attrs) {
        if (typeof scope.ccWidth !== 'undefined') ccOptions.width = scope.ccWidth;
        if (typeof scope.ccPlacement !== 'undefined') ccOptions.placement = scope.ccPlacement.toLowerCase();
        if (typeof scope.ccPush !== 'undefined') ccOptions.push = scope.ccPush;
        if (ccOptions.push =='false'){ccOptions.push = false;}else{ccOptions.push = true;}
        if (typeof scope.ccHeight !== 'undefined') ccOptions.height = scope.ccHeight;

        placement = ccOptions.placement;
        width = ccOptions.width;
        height = ccOptions.height;
        push = ccOptions.push

        body = angular.element(document.querySelector('body'));
        body.addClass('cc-menu-push');
        elem.addClass('cc-menu');


        if(placement == 'left'){

          elem.addClass('cc-menu-vertical');
          elem.css('left', "-" + width);
          elem.css('width', width);
          ccOptions.current_size = width;
        }

        if(placement == 'right'){
          elem.addClass('cc-menu-vertical');
          elem.css('right', "-" + width);
          elem.css('width', width);
          ccOptions.current_size = width;
        }

        if(placement == 'top'){
          elem.addClass('cc-menu-horizontal');
          elem.css('top', "-" + height);
          elem.css('height', height);
          ccOptions.current_size = height;
        }

        if (placement == 'bottom'){
          elem.addClass('cc-menu-horizontal');
          elem.css('bottom', "-" + height);
          elem.css('height', height);
          ccOptions.current_size = height;
        }
       }

    }
  }])
  .directive('ccButton', ['ccOptions', function (ccOptions) {
    return {
      restrict : 'A',
      scope: true,
      link: function(scope, elem, attr){
        elem.bind('click', function(){
          menu = angular.element(document.querySelector('.cc-menu'));
          body = angular.element(document.querySelector('body'));
          pos = 0;

          pos = parseInt(menu.css(ccOptions.placement));
          current_size = parseInt(ccOptions.current_size);
          pos = (pos + current_size) * -1;
          pos += "px";
          menu.css(ccOptions.placement, pos);


          if(ccOptions.push){
            if(placement == 'left' || placement == 'right'){
              if(parseInt(menu.css(placement)) < 0){
                body.css('left', '0px');
              }else{
                if(placement == 'left'){
                  body.css('left', ccOptions.current_size);
                }

                if(placement == 'right'){
                  body.css('left', (parseInt(ccOptions.current_size) * -1) + "px");
                }
              }
            }
          }


        })
      }
    };
  }])
;
