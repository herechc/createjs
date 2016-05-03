var _cloud_dangers = [false, false, false, false, false, false];//是否危险
var _cloud_imgUrls = ["images/cloud.png", "images/cloud2.png", "images/cloud3.png", "images/cloud4.png", "images/cloud5.png", "images/cloud6.png"];
var _cloud_sizes = [[56, 11], [56, 25], [56, 36], [56, 19], [118, 40], [118, 22]];//尺寸
var _cloud_usablesizes = [[56, 22], [56, 22], [56, 22], [56, 22], [118, 40], [118, 44]];//可用尺寸
var _cloud_regxys = [[0, 0], [0, 7], [0, 12], [0, 4], [0, 0], [0, 0]];//偏移值
var _cloud_cancompares = [true, true, true, true, true, false];//是否计算碰撞
var _cloud_canmoves = [false, false, false, false, true, false];//会否移动
//var _cloud_sizes = [[56, 11], [56, 25], [56, 36], [56, 19], [118, 22], [118, 22]];//尺寸
//var _cloud_usablesizes = [[56, 11], [56, 11], [56, 11], [56, 11], [118, 22], [118, 22]];//可用尺寸
//var _cloud_regxys = [[0, 0], [0, 14], [0, 25], [0, 8], [0, 0], [0, 0]];//偏移值
/*
    * 驴子跳>云朵类
*/
var Cloud = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.width = 0;
        _para.data.height = 0;

        /* 对象储存器 */
        _para.obj = {}
        _para.obj.regPoint = Point.createNew();
        // console.log(Point.createNew())
        _para.obj.tween_cloud = null;
        /* 函数储存器 */
        _para.fun = {}
        /* 属性 */
        ctrl.type = -1;//类型(只读)
        ctrl.width = 0;//宽度(只读)
        ctrl.height = 0;//同上
        ctrl.usableWidth = 0;//可用宽度(只读)
        ctrl.usableHeight = 0;//同上
        ctrl.regX = 0;//偏移值X(只读)
        ctrl.regY = 0;//同上
        ctrl.canmove = false;//是否移动(只读)
        ctrl.cancompare = true;//是否计算碰撞
        /* 静态变量 */
        ctrl.this = null;
        //初始化
        ctrl._init = function (para) {
            ctrl.type = para.type;
            ctrl.width = _cloud_sizes[ctrl.type][0];
            ctrl.height = _cloud_sizes[ctrl.type][1]
            ctrl.usableWidth = _cloud_usablesizes[ctrl.type][0];
            ctrl.usableHeight = _cloud_usablesizes[ctrl.type][1];
            ctrl.regX = _cloud_regxys[ctrl.type][0];
            ctrl.regY = _cloud_regxys[ctrl.type][1];
            ctrl.canmove = _cloud_canmoves[ctrl.type];
            ctrl.cancompare = _cloud_cancompares[ctrl.type];
            ctrl.regPoint(para.x, para.y);
            if (ctrl.canmove) {
                ctrl.move(ctrl.regPoint().x + 160 - ctrl.width);
            } else {
                if (_para.obj.tween_cloud != null) {
                    _para.obj.tween_cloud.setPaused(true);
                }
            }
        }
        ctrl.init = function (para) {
            ctrl.this = new createjs.Bitmap(_cloud_imgUrls[para.type]);
            ctrl._init(para);
            return ctrl;
        }
        //改变类型
        ctrl.resize = function (para) {
            ctrl.this.image.src = _cloud_imgUrls[para.type];
            ctrl._init(para);
            return ctrl;
        }
        //设置\返回偏移坐标
        ctrl.regPoint = function (x, y) {
            if (x != null) {
                _para.obj.regPoint.x = x;
                ctrl.this.x = _para.obj.regPoint.x;
            }
            if (y != null) {
                _para.obj.regPoint.y = y - ctrl.regY;
                ctrl.this.y = _para.obj.regPoint.y;
            }
            return _para.obj.regPoint;
        }
        //比较坐标是否处于偏移范围内
        ctrl.compareByPoint = function (x, y) {
            if (!ctrl.cancompare) { return false }
            if ((x + 15) >= ctrl.this.x &&
                (x - 15) <= ctrl.this.x + ctrl.usableWidth &&
                y >= ctrl.regPoint().y + ctrl.regY &&
                y <= ctrl.regPoint().y + ctrl.regY + ctrl.usableHeight) {
                return true;
            }
            return false;
        }
        //左右移动
        ctrl.move = function (px) {
            if (_para.obj.tween_cloud != null) {
                _para.obj.tween_cloud.setPaused(true);
            }
            _para.obj.tween_cloud = createjs.Tween.get(ctrl.this, { loop: true }).to({ x: px }, 1000).to({ x: ctrl.regPoint().x }, 1000);
            return ctrl;
        }
        //获取储存器(测试用) 
        ctrl.getpara = function () {
            return _para;
        }
        return ctrl;
    }
}