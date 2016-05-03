var touch={};

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }
  //判断平台
  function checkStation(){
    nfj_isTouch = ('ontouchstart' in window),
    // Event sniffing
    nfj_START_EVENT = nfj_isTouch ? 'touchstart' : 'mousedown',
    nfj_MOVE_EVENT = nfj_isTouch ? 'touchmove' : 'mousemove',
    nfj_END_EVENT = nfj_isTouch ? 'touchend' : 'mouseup';
  }
$(document).ready(function(){
    checkStation();
    $(document.body).bind(nfj_START_EVENT, function(e){
      if(nfj_isTouch)
        touch.target = parentIfText(e.touches[0].target);
      else
        touch.target = parentIfText(e.toElement);
      touch.el = $(touch.target)
      touch.according=false;
      touch.swipe=false;
      if(nfj_isTouch){
        touch.x1 = e.touches[0].pageX;
        touch.y1 = e.touches[0].pageY;
      }
      else{
        touch.x1 = e.x;
        touch.y1 = e.y;
      }
    }).bind(nfj_MOVE_EVENT, function(e){
      if(true===touch.swipe) {
        return;
      }
      touch.swipe=true;
      if(nfj_isTouch){
        touch.x2 = e.touches[0].pageX;
        touch.y2 = e.touches[0].pageY;
      }
      else{
        touch.x2 = e.x;
        touch.y2 = e.y;
      }

      touch.deltaX = touch.x2 - touch.x1,
      touch.deltaY = touch.y2 - touch.y1;

      function swipeDirection(x1, x2, y1, y2){
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
      }
      var _sSwipeDirection = 'swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
      if(touch.el)
        touch.el.trigger(_sSwipeDirection);
  }).bind(nfj_END_EVENT, function(e){
    if(!touch.swipe){
      $(touch.target).trigger('tap')
      $(touch.target).trigger('click')
    }
  touch = {};
}).bind('touchcancel', function(){ touch={} });
});
['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })