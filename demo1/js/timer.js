/*
 * 驴子跳>分数
 */
var Timer = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.countTime = 60;
        _para.data.nowTime = 0;
        _para.data.numCount = 2;
        /* 对象储存器 */
        _para.obj = {}
        _para.obj.group = new createjs.Container();
        _para.obj.bg = new createjs.Bitmap("images/timer.png");//背景
        _para.obj.time = new createjs.Text("30秒", "bold 12px Arial", "#000");//时间信息
        _para.obj.bar = new createjs.Shape();//进度条
        _para.obj.timer = null;//定时器
        _para.obj.img = new Image();

        /* 事件储存器 */
        _para.event = {}
        _para.event.onEnd = null;
        _para.event._onEnd = null;
        /* 函数储存器 */
        _para.fun = {}
        //初始化
        ctrl.init = function (para) {
            _para.data.nowTime = _para.data.countTime;
            _para.obj.img.onload = function () {
                ctrl.setBar();
            }
            _para.obj.img.src = "images/bar.png";
            //参数
            _para.obj.group.x = para.x;
            _para.obj.group.y = para.y;
            //事件
            _para.event._onEnd = para.onEnd == null ? function () { } : para.onEnd;
            _para.event.onEnd = function () {
                _para.event._onEnd();
            }
            //设置&加入画布
            _para.obj.time.x = 175 - _para.obj.time.getMeasuredWidth() - 19;
            _para.obj.time.y = 8;
            _para.obj.bar.x = 46;
            _para.obj.bar.y = 22;
            ctrl.time(_para.data.nowTime);
            _para.obj.group.addChild(_para.obj.bg);
            _para.obj.group.addChild(_para.obj.time);
            _para.obj.group.addChild(_para.obj.bar);
            return ctrl;
        }
        //设置时间
        _para.data._temp_strTime = "";
        ctrl.time = function (num) {
            if (num != null) {
                _para.data.nowTime = num;
                _para.data._temp_strTime = "";
                for (var i = 0; i < _para.data.numCount - _para.data.nowTime.toString().length; i++) {
                    _para.data._temp_strTime += "0";
                }
                _para.obj.time.text = _para.data._temp_strTime + num + "秒";
                ctrl.setBar();
            }
            return _para.data.nowTime;
        }
        //设置进度条
        ctrl.setBar = function () {
            if (!_para.obj.img.complete) { return; }
            _para.obj.bar.graphics.clear();
            _para.obj.bar.graphics.beginBitmapFill(_para.obj.img, "no-repeat").drawRect(0, 0, _para.data.nowTime / _para.data.countTime * 109, 12).closePath();
        }
        //开始倒数
        ctrl.start = function () {
            if (_para.obj.timer != null) {
                _para.obj.timer.clear();
            }
            _para.data.nowTime = _para.data.countTime;
            //执行定时器
            _para.obj.timer = Common.setInterval(function (c) {
                _para.data.nowTime--;
                if (_para.data.nowTime >= 0) {
                    ctrl.time(_para.data.nowTime);
                    //触发事件
                    if (_para.data.nowTime == 0) {
                        //触发事件
                        _para.event.onEnd();
                    }
                }
            }, 1, _para.data.countTime);
            return ctrl;
        }
        ctrl.stop = function () {
            console.log(_para.obj.timer)
            if (_para.obj.timer != null) {
                _para.obj.timer.clear();
                _para.event._onEnd = function () { }
            }
            return ctrl;
        }
        //获取group
        ctrl.getThis = function () {
            return _para.obj.group;
        }
        //获取储存器(测试用)
        ctrl.getpara = function () {
            return _para;
        }
        return ctrl;
    }
}