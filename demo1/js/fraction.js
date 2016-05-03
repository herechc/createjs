/*
 * 驴子跳>分数
 */
var Fraction = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.fraction = 0;
        _para.data.numCount = 3;
        /* 对象储存器 */ 
        _para.obj = {}
        _para.obj.group = new createjs.Container();
        _para.obj.bg = new createjs.Bitmap("images/result.png");//背景
        _para.obj.tag1 = new createjs.Text("得分", "bold 12px Arial", "#000");//提示信息
        _para.obj.tag2 = new createjs.Text("层", "bold 12px Arial", "#000");//提示信息
        _para.obj.fraction = new createjs.Text("000", "bold 17px Arial", "#ffbc3d");//分数

        /* 函数储存器 */
        _para.fun = {}
        /* 静态变量 */
        //上次分数(只读)
        ctrl.lastFraction = 0;
        //初始化
        ctrl.init = function (para) {
            _para.data.fraction = para.fraction;
            _para.obj.group.x = para.x;
            _para.obj.group.y = para.y;
            ctrl.fraction(_para.data.fraction);
            _para.obj.group.addChild(_para.obj.bg);
            _para.obj.group.addChild(_para.obj.tag1);
            _para.obj.group.addChild(_para.obj.tag2);
            _para.obj.group.addChild(_para.obj.fraction);
            return ctrl;
        }
        //设置分数
        _para.data._temp_strFraction = "";
        ctrl.fraction = function (num) {
            if (num != null) {
                _para.data.lastFraction = _para.data.fraction;
                _para.data.fraction = num;
                _para.data._temp_strFraction = "";
                for (var i = 0; i < _para.data.numCount - _para.data.fraction.toString().length; i++) {
                    _para.data._temp_strFraction += "0";
                }
                _para.obj.fraction.text = _para.data._temp_strFraction + num;
                ctrl.sort();
            }
            return _para.data.fraction;
        }
        //设置位置
        ctrl.sort = function () {
            _para.obj.tag1.y = _para.obj.tag2.y = (_para.obj.bg.image.height - _para.obj.tag1.getMeasuredHeight()) / 2;
            _para.obj.fraction.y = (_para.obj.bg.image.height - _para.obj.fraction.getMeasuredHeight()) / 2;
            _para.obj.tag1.x = (_para.obj.bg.image.width - _para.obj.tag1.getMeasuredWidth() - _para.obj.tag2.getMeasuredWidth() - _para.obj.fraction.getMeasuredWidth() - 3) / 2;
            _para.obj.fraction.x = _para.obj.tag1.x + _para.obj.tag1.getMeasuredWidth() + 3;
            _para.obj.tag2.x = _para.obj.fraction.x + _para.obj.fraction.getMeasuredWidth() + 3;
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