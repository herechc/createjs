/*
 * 驴子跳游戏控制类
 */
var donkeyJump = {
    createNew: function () {
        var ctrl = {}, _para = {};
        /* 数据储存器 */
        _para.data = {}
        _para.data.s_width = null;
        _para.data.s_height = null;
        _para.data.gameInfo = []//游戏信息(存有各层云的类型)[{type,x}]
        _para.data.gameInfoIdx = 0;
        _para.data.gameover = false;
//test
_para.data.testF = new createjs.Text("30秒", "bold 12px Arial", "#fff");
_para.data.testF.y=200
        /* 对象储存器 */
        _para.obj = {}
        _para.obj.cyclist = null;//循环统计器
        _para.obj.stage = null;//舞台
        _para.obj.player = null;//玩家
        _para.obj.bgs = null;//背景
        _para.obj.clouds = [];//云
        _para.obj.fraction = null;//分数
        _para.obj.timer = null;//计时器
        _para.obj.container = null;//容器

        /* 事件 */
        _para.event = {}
        _para.event.deal = null;
        /*
         * 初始化
         * canvasId:画布id
         */
        ctrl.init = function (para) {
            /* 储存器设置 */
            _para.data.s_width = para.width;
            _para.data.s_height = para.height;
            ctrl.createGameInfo();
            //创建舞台
            _para.obj.stage = new createjs.Stage("gameCanvas");
            _para.obj.stageFraction = new createjs.Stage("gameCanvasFraction");
            //创建背景
            _para.obj.bgs = Background.createNew().init({
                width: g_w,
                height: g_h
            });
            //创建分数对象(resize data)
            _para.obj.fraction = Fraction.createNew().init({
                fraction: 1,
                x: _para.obj.stage.canvas.width - 112,
                y: 18
            });
            //创建计时器(resize data)
            _para.obj.timer = Timer.createNew().init({
                x: 15,
                y: 20,
                onEnd: function () {
                    ctrl.deal(function () {
                        console.log("time over")
                    });
                }
            });
            //创建容器(resize data)
            _para.obj.container = new createjs.Container();
            _para.obj.container.x = 0;
            _para.obj.container.y = _para.obj.stage.canvas.height;
            //创建云对象
            for (var i = 0; i < 30; i++) {
                _para.obj.clouds.push([]);
                for (var j = 0; j < 2; j++) {
                    _para.obj.clouds[i].push(Cloud.createNew().init({
                        type: _para.data.gameInfo[i][j].type,
                        x: _para.data.gameInfo[i][j].x,
                        y: -125 * i - 15
                    }));
                }
            }
            //重置数据指针
            _para.data.gameInfoIdx = _para.obj.clouds.length;
            //创建循环统计器
            _para.obj.cyclist = Cyclist.createNew().init({
                count: _para.obj.clouds.length
            });
            //创建角色
            _para.obj.player = Player.createNew().init({
                width: g_w,
                height: g_h,
                imgUrl: "images/player.png"
            });
            // console.log(_para.obj.player)
            _para.obj.player.this.x = _para.obj.clouds[0][0].this.x + _para.obj.clouds[0][0].width / 2;
            _para.obj.player.this.y = _para.obj.clouds[0][0].this.y - _para.obj.player.this.spriteSheet._frameHeight / 2;
            /* 布景 */
            for (var i = 0; i < _para.obj.clouds.length; i++) {
                for (var j = 0; j < _para.obj.clouds[i].length; j++) {
                    _para.obj.container.addChild(_para.obj.clouds[i][j].this);
                }
            }
            _para.obj.container.addChild(_para.obj.player.this);
            _para.obj.stage.addChild(_para.obj.bgs.getthis());
            _para.obj.stage.addChild(_para.obj.container);
            _para.obj.stageFraction.addChild(_para.obj.fraction.getThis());
            _para.obj.stageFraction.addChild(_para.obj.timer.getThis());
            /* 事件 */
            _para.event.deal = para.deal;
            /* createJs配置 */
            createjs.Ticker.setFPS(60);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", ctrl.tick);
            return ctrl;
        }
        /* tick */
        ctrl.tick = function () {
            // console.log("tick")
             _para.data.testF.text=createjs.Ticker.getMeasuredFPS()
            if (_para.data.gameover) {
                _para.obj.stage.update();
                _para.obj.stageFraction.update();
                return;
            }
            //左右移动
            if (!((_para.obj.player.this.x - _para.obj.player.width / 2 <= 0 && _para.obj.player.dir < 0) || (_para.obj.player.this.x >= 320 - _para.obj.player.width / 2 && _para.obj.player.dir > 0))) {
                _para.obj.player.this.x += _para.obj.player.dir;
            }
            //假如下坠则判断是否碰撞
            if (_para.obj.player.state() == 3) {
                var _tick_break = false;
                for (var i = 0; i < _para.obj.clouds.length; i++) {
                    for (var j = 0; j < 2; j++) {
                        //检测到碰撞
                        if (_para.obj.clouds[i][j].compareByPoint(_para.obj.player.this.x, _para.obj.player.this.y + 32)) {
                            //重设位置到所碰云上
                            _para.obj.player.stand();
                            //设置分数
                            ctrl._getFraction = _para.obj.player.this.y;
                            _para.obj.fraction.fraction(ctrl.getFraction());
                           
                            if (ctrl.getFraction() >= 999) {
                                ctrl.deal(function () {
                                    console.log("fraction>999");
                                });
                            }
                            //跳跃处理
                            var _dVFloor = Math.floor((Math.abs(_para.obj.player.this.y) - (Math.abs(_para.obj.container.y) - g_h)) / 125);
                            var _jumpLen = 300;
                            var _time = 400 * _dVFloor;
                             console.log(_dVFloor);
                            // console.log((Math.abs(_para.obj.player.this.y) - (Math.abs(_para.obj.container.y) - g_h)));
                            // console.log(Math.abs(_para.obj.container.y));
                            // console.log(Math.abs(_para.obj.player.this.y))
                            if (_para.obj.clouds[i][j].type == 1) {
                                //碰到死亡障碍
                                ctrl.deal(function () {
                                    console.log(_para.obj.player.state());
                                    console.log(_para);
                                    console.log("touch deal cloud");
                                });
                            } else if (_para.obj.clouds[i][j].type == 3) {
                                _dVFloor = 8;
                                _jumpLen = _dVFloor * 125 + 50;
                                _time = _jumpLen * 2.5;
                            }
                            if (_dVFloor >= 1) {
                                ctrl.upscene(_dVFloor, _time);
                            }
                            //跳
                            _para.obj.player.jump(_jumpLen, function () {
                                ctrl.deal(function () {
                                    console.log("fall to hige")
                                })
                            });
                            _tick_break = true;
                            break;
                        }
                    }
                    if (_tick_break) { break; }
                }
            }
            _para.obj.stage.update();
            _para.obj.stageFraction.update();
        }
        /* 生成游戏云数据 */
        ctrl.createGameInfo = function () {
            var _ranIdx = 0;
            _para.data.gameInfo = [];
            for (var i = 0; i < 999; i++) {
                _para.data.gameInfo.push([]);
                for (var j = 0; j < 2; j++) {
                    _para.data.gameInfo[i].push({
                        type: null,
                        x: null
                    });
                }
                _ranIdx = Math.floor(Math.random() * 2);
                _para.data.gameInfo[i][_ranIdx].type = 0;
                _para.data.gameInfo[i][_ranIdx].x = _ranIdx * 160 + Math.floor(Math.random() * (160 - 56));
                if (i < 400) {
                    _para.data.gameInfo[i][1 - _ranIdx].type = 0;
                    _para.data.gameInfo[i][1 - _ranIdx].x = (1 - _ranIdx) * 160 + Math.floor(Math.random() * (160 - 56));
                } else if (i < 499) {
                    _para.data.gameInfo[i][1 - _ranIdx].type = 1;
                    _para.data.gameInfo[i][1 - _ranIdx].x = (1 - _ranIdx) * 160 + Math.floor(Math.random() * (160 - 56));
                } else if (i < 749) {
                    _para.data.gameInfo[i][1 - _ranIdx].type = 3;
                    _para.data.gameInfo[i][1 - _ranIdx].x = (1 - _ranIdx) * 160 + Math.floor(Math.random() * (160 - 56));
                } else if (i < 949) {
                    _para.data.gameInfo[i][1 - _ranIdx].type = 4;
                    _para.data.gameInfo[i][1 - _ranIdx].x = (1 - _ranIdx) * 160;
                } else if (i < 999) {
                    _para.data.gameInfo[i][1 - _ranIdx].type = 5;
                    _para.data.gameInfo[i][1 - _ranIdx].x = (1 - _ranIdx) * 160 + Math.floor(Math.random() * (160 - 118));
                }
            }
            Common.shuffleArr(_para.data.gameInfo);
            _para.data.gameInfo[0][0].type = 0;
            _para.data.gameInfo[0][1].type = 0;
        }
        /* 计算分数 */
        ctrl._getFraction = 0;
        ctrl.getFraction = function () {
            return Math.floor(Math.abs(ctrl._getFraction / 125) + 1);
        }
        /* 移动镜头 */
        ctrl.upscene = function (count, speed) {
            _para.obj.bgs.move(20 * count, speed);
            createjs.Tween.get(_para.obj.container).to({ y: _para.obj.container.y + 125 * count }, speed, createjs.Ease.sineOut).call(function () {
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j <2; j++) {
                        _para.obj.clouds[_para.obj.cyclist.arr[i]][j].resize({
                            type: _para.data.gameInfo[_para.data.gameInfoIdx][j].type,
                            x: _para.data.gameInfo[_para.data.gameInfoIdx][j].x,
                            y: -125 * _para.data.gameInfoIdx - 15
                        });
                    }
                    //递增指针
                    _para.data.gameInfoIdx++;
                }
                _para.obj.cyclist.next(count);
            });
        }
        /* 游戏开始 */
        ctrl.start = function () {
            createjs.Ticker.paused = false;
            _para.data.gameover = false;
            g_strength -= g_strength <= 0 ? 0 : 1;
            _para.obj.timer.start();
            _para.obj.player.jump();
        }
        /* 死亡 */
        ctrl.deal = function (callback) {
            //游戏结束
            createjs.Ticker.paused = true;
            _para.data.gameover = true;
            _para.obj.timer.stop();
            //执行用户代码
            if (callback) {
                callback();
            }
            //事件
            if (_para.event.deal) {
                _para.event.deal();
            }
        }
        /* 销毁 */
        ctrl.display = function () {
            _para.obj.player.stand();
            createjs.Tween.removeTweens(my.obj.dj.getpara().obj.container);
            _para.obj.timer.stop();
            //重置数据
            _para.data.gameover = true;
            _para.data.gameInfoIdx = _para.obj.clouds.length;
            //复位云&队列
            for (var i = 0; i < _para.obj.clouds.length; i++) {
                for (var j = 0; j < 2; j++) {
                    _para.obj.clouds[i][j].resize({
                        type: _para.data.gameInfo[i][j].type,
                        x: _para.data.gameInfo[i][j].x,
                        y: -125 * i - 15
                    });
                }
                _para.obj.cyclist.arr[i] = i;
            }
            //复位角色&父对象
            _para.obj.player.this.x = _para.obj.clouds[0][0].this.x + _para.obj.clouds[0][0].width / 2;
            _para.obj.player.this.y = _para.obj.clouds[0][0].this.y - _para.obj.player.this.spriteSheet._frameHeight / 2;
            _para.obj.container.y = _para.obj.stage.canvas.height;
        }
        /* 返回储存器（测试用） */
        ctrl.getpara = function () {
            return _para;
        }
        return ctrl;
    }
}