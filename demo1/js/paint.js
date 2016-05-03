/**
 * paint.js
 * @authors huangguanhua_gz (kiros1986@qq.com.com)
 * @date    2014-07-15 15:57:12
 * 涂抹效果
 */


(function () {
    // Browser capabilities
    var sUserAgent = navigator.userAgent.toLowerCase(),
    isAndroid = sUserAgent.match(/android/i),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    // Events
    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';
    // alert(isAndroid )
    // Constructor
    Paint = function (options) {
        var that = this;


        // Default options
        that.options = {
            width: null,
            height: null,
            canvasId: null,
            bgImg: null,
            pointImg: null,//笔头图片
            clearPercent: 0.5,
            lineWidth: 30,//画笔宽度
            scale: 2,//默认情况canvas用单倍 
            // Events
            onClear: null,
            onTouchEnd: null,
            onTouchStart: null,
            onTouchMove: null,

        };

        // User defined options
        for (i in options) that.options[i] = options[i];

        that.canvasWidth = $(that.canvas).width()
        that.canvas = document.querySelector('#' + that.options.canvasId);
        that.canvas.width = that.options.width;
        that.canvas.height = that.options.height;
        that.canvas.left = that.canvas.offsetLeft;
        that.warp=document.querySelector('.w_prize');
        that.canvas.top = that.canvas.offsetTop;
        that.cxt = that.canvas.getContext('2d');
        that.img = new Image();
        that.img.src = that.options.bgImg;
        that.img.onload = function () {
            that.options.scale = that.img.width / $(that.canvas).width()
            that.cxt.drawImage(that.img, 0, 0, that.img.width, that.img.height, 0, 0, that.canvas.width, that.img.height * (that.canvas.width / that.img.width));
        }
        //笔头
        if (that.options.pointImg) {
            that.pointImg = new Image();
            that.pointImg.src = that.options.pointImg;
        } else {
            that.cxt.lineWidth = that.options.lineWidth;
            that.cxt.shadowBlur = 5;
            that.cxt.shadowColor = "black";
            that.cxt.lineCap = "round";
            that.cxt.lineJoin = "round";
        }

        that.isend = false;
        that.moveTimes = 0;
        that._bind(START_EV);
        that._bind(MOVE_EV);
        that._bind(END_EV);

    }
    // Prototype
    Paint.prototype = {
        handleEvent: function (e) {
            var that = this;
            switch (e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case WHEEL_EV: that._wheel(e); break;
                case 'mouseout': that._mouseout(e); break;
                case 'webkitTransitionEnd': that._transitionEnd(e); break;
            }
        },
        _bind: function (type, el, bubble) {
            (el || this.canvas).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.canvas).removeEventListener(type, this, !!bubble);
        },
        _start: function (e) {
            var that = this
            that.cxt.globalCompositeOperation = "destination-out";
            var point = hasTouch ? e.touches[0] : e,
            x = point.pageX,
            y = point.pageY;
            if (that.options.pointImg) {
                that.cxt.drawImage(that.pointImg, (x - that.pointImg.width / 2), (y - that.pointImg.height / 2));
            } else {
                that.cxt.beginPath()
                that.cxt.moveTo(x, y)
            }

        },
        _move: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var that = this;
            if (that.isend) return
            that.moveTimes++;
            var point = hasTouch ? e.touches[0] : e,
            x = point.pageX- that.canvas.offsetLeft- that.warp.offsetLeft,//!

            
            y = point.pageY - that.canvas.offsetTop- that.warp.offsetTop;//!

          //  console.log(x +" "+y);
            if (that.options.pointImg) {
                that.cxt.drawImage(that.pointImg, (x - that.pointImg.width / 2), (y - that.pointImg.height / 2));
            } else {

                that.cxt.lineTo(x, y)
                that.cxt.stroke();
            }

            if (that.moveTimes % 20 == 0 && !isAndroid) {
                that._ifclean();
            };
            if (that.options.onTouchMove) that.options.onTouchMove.call(that, e);
        },

        _end: function (e) {
            var that = this;
            that.cxt.closePath();
            that._ifclean();
            if (that.isend) {
                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            }

        },
        //判断是否干净
        _ifclean: function () {
            var that = this;
            var imagedata = that.cxt.getImageData(0, 0, that.canvas.width, that.canvas.height);
            var length = imagedata.data.length;
            colornum = 0;
            for (var i = 3; i < length; i += (4)) {
                if (imagedata.data[i] == 0) colornum++;
            };

            if (colornum / Math.floor(length / (4)) > that.options.clearPercent) {
                that.isend = true;
                if (that.options.onClear) that.options.onClear.call(that);
                return true;
            } else {
                return false;
            }
        }
    }

    window.Paint = Paint;
})()