/*
    * 驴子跳>背景
*/
var Background = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.width = 0;
        _para.data.height = 0;
        _para.data.canmove = false;
        /* 对象储存器 */
        _para.obj = {}
        _para.obj.bg = null;
        _para.obj.img = null;
        /* 函数储存器 */
        _para.fun = {}
        //初始化
        ctrl.init = function (para) {
            _para.data.width = para.width;
            _para.data.height = para.height;
            _para.obj.bg = new createjs.Shape();
            _para.obj.bg.x = 0;
            _para.obj.bg.y = -1 * _para.data.height;
            _para.obj.img = new Image();
            _para.obj.img.onload = function () {
                _para.obj.bg.graphics.beginBitmapFill(_para.obj.img, "repeat-y").drawRect(0, 0, _para.data.width, _para.data.height * 2).closePath();
                _para.data.canmove = true;
            }
            _para.obj.img.src = "images/bg.png?v=1002";
            return ctrl;
        }
        //模拟退后
        ctrl.move = function (len,time) {
            if (!_para.data.canmove) { return; }
            if (_para.obj.bg.y >= 0) {
                _para.obj.bg.y = -_para.obj.img.height;
            }
            createjs.Tween.get(_para.obj.bg).to({ y: _para.obj.bg.y + len }, time, createjs.Ease.sineOut);
        }
        //获取bitmap
        ctrl.getthis = function () {
            return _para.obj.bg;
        }
        //获取储存器(测试用)
        ctrl.getpara = function () {
            return _para;
        }
        return ctrl;
    }
}