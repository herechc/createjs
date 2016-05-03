requestAnimationFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) { return setTimeout(callback, 1); };
})();
var Common = {
    isEmptyObject: function (o) {
        for (var property in o) {
            return false;
        }
        return true;
    },
    setTimeout: function (callback, time) {
        var endTime = +new Date() + time,
            ctrl = {};
        ctrl._clear = false;
        ctrl.clear = function () {
            ctrl._clear = true;
        }
        ctrl.run = function () {
            if (ctrl._clear) { return; }
            if (+new Date() >= endTime) {
                callback();
            } else {
                requestAnimationFrame(ctrl.run);
            }
        };
        ctrl.run();
        return ctrl;
    },
    setInterval: function (callback, time, count) {
        var ctrl = {};
        ctrl.count = 0;
        ctrl._clear = false;
        ctrl._childCtrl = {};
        if (arguments.length < 3) {
            ctrl.isOver = function () {
                return ctrl._clear;
            }
        } else {
            ctrl.isOver = function () {
                return (ctrl._clear || ctrl.count >= count) ? true : false;
            }
        }
        ctrl.clear = function () {
            ctrl._childCtrl.clear();
            ctrl._clear = true;
        }
        ctrl.run = function () {
            ctrl._childCtrl = Common.setTimeout(function () {
                if (ctrl.isOver()) { return; }
                ctrl.count++;
                callback(ctrl);
                ctrl.run();
            }, 1000);
        };
        ctrl.run();
        return ctrl;
    },
    shuffleArr: function (array) {
        var m = array.length,
            t, i;
        // 如果还剩有元素…
        while (m) {
            // 随机选取一个元素…
            i = Math.floor(Math.random() * m--);
            // 与当前元素进行交换
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
}

var Cyclist = {
    createNew: function () {
        var ctrl = {}, _para = {};
        _para.count = 0;
        _para.criIdx = 0;
        _para.baseIdx = 0;
        ctrl.arr = [];
        //初始化函数
        ctrl.init = function (para) {
            _para.count = para.count;
            for (var i = 0; i < _para.count; i++) {
                ctrl.arr.push(i);
            }
            return ctrl;
        }
        //返回前进count次后的数组列表
        ctrl.next = function (count) {
            if (!arguments.length) {
                count = 1;
            }
            for (var i = 0; i < count; i++) {
                ctrl.move(1);
            }
            return ctrl.arr;
        }
        //返回后退count次后的数组列表
        ctrl.prev = function (count) {
            if (!arguments.length) {
                count = 1;
            }
            for (var i = 0; i < count; i++) {
                ctrl.move(-1);
            }
            return ctrl.arr;
        }
        //返回前进\后退1步后的数组列表（基方法）
        ctrl.move = function (dir) {
            switch (dir) {
                case -1:
                    _para.criIdx = 0;
                    _para.baseIdx = _para.count - 1;
                    break;
                case 1:
                    _para.criIdx = _para.count - 1;
                    _para.baseIdx = 0;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < _para.count; i++) {
                if (ctrl.arr[i] == _para.criIdx) {
                    ctrl.arr[i] = _para.baseIdx;
                } else {
                    ctrl.arr[i] += dir;
                }
            }
            return ctrl.arr;
        }
        return ctrl;
    }
}

var Point = {
    createNew: function () {
        var ctrl = {}
        ctrl.x = 0;
        ctrl.y = 0;
        return ctrl;
    }
}
var my = {}
my.obj = {}
my.data = {}
my.obj.dj = null;
my.obj.paint = null;
my.data.fraction = 1;
my.fun = {}
my.init = function () {
    $('body').bind('touchmove', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
   
    //游戏
    my.obj.dj = donkeyJump.createNew().init({
        width: g_w,
        height: g_h,
        canvasId: "gameCanvas",
       
    });
   
    //添加重力感应事件
    my.data._gamma = 0;
    window.addEventListener("deviceorientation", function (e) {
        my.data._gamma = Math.floor(e.gamma);
        if (my.data._gamma < -10) {
            my.obj.dj.getpara().obj.player.dir = -4;
            my.obj.dj.getpara().obj.player.direction(1);
            my.obj.dj.getpara().obj.player.anim("run");
        } else if (my.data._gamma > 10) {
            my.obj.dj.getpara().obj.player.dir = 4;
            my.obj.dj.getpara().obj.player.direction(2);
            my.obj.dj.getpara().obj.player.anim("run");
        } else {
            my.obj.dj.getpara().obj.player.dir = 0;
            my.obj.dj.getpara().obj.player.direction(0);
            my.obj.dj.getpara().obj.player.anim("stand");
        }
    }, false);

    

}