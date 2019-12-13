$(function(){

    $('.game_start').on('click',function(){
        $(this).closest('.start').stop().hide();
        mySnakeFn();
    })

    $('.game_over').on('click',function(){
        $('.start').stop().show();
        $(this).closest('.over').stop().hide();
        $('input[name=your_name]').val('');
    })

    $('.clear_data').on('click',function(){
        $('.ranking_list').empty();
    })

})

function mySnakeFn(){

    //全局变量对相
    var myVar = {
            // салам
            del_x:-15,
            del_y:0,
            //初始长度
            myscore:0,
            //移动速度
            speed:180,
            //计时器
            itimes:null
        }


    // 初始位置

    ;(function(){
        var arr_snake = [['300px','390px'],['300px','405px'],['300px','420px']];
        $('.snake_wrap').empty();
        $('.snake_wrap').append('<li></li><li></li><li></li>')
        $('.snake_wrap li').each(function(value){
            $(this).css({'top':arr_snake[value][0],'left':arr_snake[value][1]})
        })
    })(jQuery);

    //键盘控制--上下左右暂停
    ;(function(){

        //暂停判定
        var stop = true;

        $(document).keydown(function(event) {
            switch(event.keyCode){
                //空格 暂停
                case 32:stop ? clearInterval(myVar.itimes) : run();
                        stop = !stop;
                        break;
                //左
                case 37:directionKey(-15,0,true);
                        break;
                //上
                case 38:directionKey(0,-15,false);
                        break;
                //右
                case 39:directionKey(15,0,true);
                        break;
                //下
                case 40:directionKey(0,15,false);
                        break;
            }
        });
    })(jQuery);

    //方向判断
    function directionKey(y1,y2,bour){
        if(!myVar.del_x == bour){
            myVar.del_x = y1;
            myVar.del_y = y2;
        }
    }

    function run(){
        //计时器，每speed时刷新一次
        myVar.itimes = setInterval(function(){
            //获取当前食物位置
            var food_top = $('.food').position().top;
            var food_left = $('.food').position().left;
            //设置新增蛇头坐标
            var header_top = $('.snake_wrap li').eq(0).position().top + myVar.del_y;
            var header_left = $('.snake_wrap li').eq(0).position().left + myVar.del_x;
            //当前蛇头颜色重置
            $('.snake_wrap li').eq(0).css({'background': '#FFC400'});
            //新增蛇头，并赋予样式
            $('.snake_wrap').prepend('<li></li>');
            $('.snake_wrap li').eq(0).css({'left':header_left + 'px','top':header_top + 'px','background':'#fff'})
            //移除最后一节蛇尾
            $('.snake_wrap li:last').remove();

            //判断蛇是否吃到食物
            if((header_left == (food_left - 1)) && (header_top == (food_top - 1))){
                var last_top = $('.snake_wrap li:last').position().top;
                var last_left = $('.snake_wrap li:last').position().left;
                $('.snake_wrap').append('<li></li>');
                $('.snake_wrap li:last').eq(0).css({'left':last_left + 'px','top':last_top + 'px'})

                //刷新食物
                foodRandom();

                //蛇身长度
                myVar.myscore++;
                scoreFn(myVar.myscore);

                //每加长5，速度提升10
                if(!(myVar.myscore%5) && myVar.speed > 10){
                    clearInterval(myVar.itimes);
                    myVar.speed -= 10;
                    run();
                }
            }

            //边界判断
            borderDetection(header_top,header_left);
            //自撞判断
            selfDetection(header_top,header_left);
        },myVar.speed)
    }
    run();

    //分数
    function scoreFn(x){
        $('.score').html(x)
    }

    //食物
    function foodRandom(){
        var t = 40;
        var x = 54;
        var y = 0;
        var repeat = false;
        var top = parseInt(Math.random() * (t - y) + y);
        var left = parseInt(Math.random() * (x - y) + y);

        //判断食物与蛇身坐标是否重合
        $('.snake_wrap li').each(function() {
             if($(this).position().left == left && $(this).position().top == top){
                foodRandom();
            }else{
                repeat = true;
            }
        });

        //如果食物没在蛇身上，定位食物
        if(repeat){
            $('.food').css({'top':top*15 + 1 + 'px','left':left*15 + 1 + 'px'});
        }
    }
    foodRandom();

    // 边界判定
    function borderDetection(HT,HL){
        if(HT<0 || HT > 585 || HL < 0 || HL >795){
            clearInterval(myVar.itimes);
            gameOver();
            rankingList()
        }
    }

    //自撞判定
    function selfDetection(HT,HL){
        //从第二节开始，坐标是否与蛇头重合
        $('.snake_wrap li:gt(0)').each(function(index, val) {
            var this_top = $(this).position().top;
            var this_left = $(this).position().left;
             if( HL == this_left && HT == this_top ){
                clearInterval(myVar.itimes);
                gameOver();
                rankingList()
             }
        })
    }

    //游戏结束
    function gameOver(){
        $('.over').show();
    }

    //获取用户昵称
    function yourName(){
        if($.trim($('input[name=your_name]').val()) != ''){
            return $('input[name=your_name]').val();
        }else{
            return 'жылан щщс';
        }
    }

    //排行榜
    function rankingList(){
        //рекорды
        var new_ranking = '<li><span class="NO">'+ (1 +parseInt($('.ranking_list li').length)) +'</span><span class="name">' +yourName()+ '</span><span class="score_list">' +myVar.myscore+ '</span></li>';
        //
        var ranking_list = $('.ranking_list');

        //如果排行榜中有记录就进行排序，如果为空就直接添加
        if(ranking_list.has('li').length>0){
            //记录长度
            var li_len = $('.ranking_list li').length
            //冒泡排序，把新的记录排列到对应的位置上
            for(var i = 0; i < li_len; i++){

                if(parseInt($('.ranking_list li').eq(i).children('span.score_list').html()) < parseInt(myVar.myscore)){
                    $(new_ranking).insertBefore($('.ranking_list li').eq(i)).hide().slideDown();
                    break;
                }else if(i == li_len - 1){
                    $(new_ranking).appendTo(ranking_list).hide().slideDown();
                }
            }
        }else{
            $(new_ranking).appendTo(ranking_list).hide().slideDown();
        }



        //重新添加排号序列
        $.each($('.ranking_list li'),function(index,value){
            $(this).children('.NO').html($(this).index() +1)
        })
    }

}