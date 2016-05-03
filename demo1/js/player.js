/*
    * 驴子跳>玩家类
*/
var Player = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.s_width = 0;
        _para.data.s_height = 0;
        _para.data.imgUrl = "";
        _para.data.direction = 0;//方向
        _para.data.state = 0;//状态
        _para.data.jumpLen = 300;//跳跃距离
        _para.data.speedJF = 2.5;//上下移动速度
        /* 对象储存器 */
        _para.obj = {}
        _para.obj.tween_player_j = new createjs.Tween();//tween跳动画实例
        _para.obj.tween_player_f = new createjs.Tween();//tween堕动画实例
        /* 函数储存器 */
        _para.fun = {}
        /* 静态变量 */
        ctrl.width = 0;
        ctrl.height = 0;
        /* 静态变量 */
        ctrl.this = null;
        ctrl.dir = 0;
        //初始化
        ctrl.init = function (para) {
            _para.data.s_width = para.width;
            _para.data.s_height = para.height;
            _para.data.imgUrl = para.imgUrl;
            ctrl.width = 64;
            ctrl.height = 64;
            ctrl.this = new createjs.Sprite(new createjs.SpriteSheet({
                images: [_para.data.imgUrl],
                frames: {
                    width: ctrl.width,
                    height: ctrl.height,
                    count: 2,
                    regX: ctrl.width / 2,
                    regY: ctrl.height / 2,
                    spacing: 0,
                    margin: 0
                },
                animations: {
                    stand: [0, 0, "stand"],
                    run: [1, 1, "run"]
                }
            }), "stand");
            _para.obj.tween_player_j._paused = true;
            _para.obj.tween_player_f._paused = true;
            return ctrl;
        }
        //获取/设置方向
        ctrl.direction = function (dir) {
            /*
             * 0:正面;1:左;2:右
             */
            switch (dir) {
                case 0:
                    ctrl.this.skewY = 0;//倾斜
                    break;
                case 1:
                    ctrl.this.skewY = 180;
                    break;
                case 2:
                    ctrl.this.skewY = 0;
                    break;
                default:

            }
            if (dir != undefined) {
                _para.data.direction = dir;
            }
            return _para.data.direction;
        }
        //获取/设置状态
        ctrl.state = function (state) {
            /*
             * 0:站;1:跑;2:跳;3:跌;4:飞
             */
            if (state != undefined) {
                return _para.data.state = state;
            }
            return _para.data.state;
        }
        //获取/设置精灵动画
        ctrl.anim = function (anim) {
            if (anim != null && anim != ctrl.this.currentAnimation) {//返回当前播放动画的名字。如run，stand
                ctrl.this.gotoAndPlay(anim);
            }
            return ctrl.this.currentAnimation;
        }
        //移动>站止
        ctrl.stand = function () {
            createjs.Tween.removeTweens(ctrl.this);
            ctrl.state(0);
            ctrl.direction(0);
            ctrl.anim("stand");
        }
        //移动>跳
        ctrl.jump = function (len, callback, time) {
            var _len = len == null ? _para.data.jumpLen : len;
            //清除相反方向动画
            _para.obj.tween_player_f.setPaused(true);
            ctrl.state(2);
            _para.obj.tween_player_j = createjs.Tween.get(ctrl.this).to({ y: ctrl.this.y - _len }, (time ? time : _len * _para.data.speedJF), createjs.Ease.sineOut).call(function () {
                _para.obj.tween_player_j.setPaused(true);
                ctrl.fall(Math.abs(ctrl.this.y) - ctrl.this.parent.y + _para.data.s_height, callback);
                // console.log(ctrl.this.y);
            });
        }
        //移动>跌
        ctrl.fall = function (len, callback) {
            //清除相反方向动画
            // console.log("fall")
            _para.obj.tween_player_j.setPaused(true);
            // console.log(_para.obj.tween_player_j)
            ctrl.state(3);// createjs.Ease.sineIn运动类效果，例如缓动。抛物线加速
            _para.obj.tween_player_f = createjs.Tween.get(ctrl.this).to({ y: ctrl.this.y + len }, len * _para.data.speedJF, createjs.Ease.sineIn).call(function () {//createjs.Ease.sineIn
                //继续下次跳跃
                _para.obj.tween_player_j.setPaused(true);
                _para.obj.tween_player_f.setPaused(true);
                if (callback) {
                    callback();
                }
                ctrl.anim("stand");
                ctrl.jump(_para.data.jumpLen);
            });
        }
        //移动>飞
        ctrl.fly = function () {
            if (ctrl.direction() == 4) { return; }
            createjs.Tween.removeTweens(ctrl.this);
            ctrl.direction(4);
            _para.fun.fly();
        }
        //获取储存器(测试用)
        ctrl.getpara = function () {
            return _para;
        }
        return ctrl;
    }
}