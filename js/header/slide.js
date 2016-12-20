/**
 * Created by Lynn on 2016/12/20 0020.
 */
/**
 * Created by Lynn on 2016/10/12 0012.
 */
function Slide(opt){
    opt=opt||{};
    if(!opt.id)return;
    this.defaultOpt={
        url:'json/header/slide.txt',
        duration:1000,
        interval:2000
    };
    for(var attr in opt){
        this.defaultOpt[attr]=opt[attr];
    }
    this.$slide=$(this.defaultOpt.id);
    this.$slideMain=this.$slide.children('.slide_main');
    this.$slideUl=this.$slideMain.children('ul');
    this.$aImg=null;
    this.$indicator=this.$slide.children('.slide_indicator');
    this.$dot=null;
    this.$btnLeft=this.$slide.find('a.left');
    this.$btnRight=this.$slide.find('a.right');
    this.data=null;
    this.timer=null;
    this.n=0;
    this.init();
}
Slide.prototype={
    constructor:Slide,
    init: function () {
        var _this=this;
        this.getData();
        this.bind();
        this.lazyImg();
        clearInterval(this.timer);
        this.timer=setInterval(function () {
            _this.autoMove();
        },_this.defaultOpt.interval);
        this.overOut();
        this.handleChange();
        this.leftRight();
    },
    //获取数据
    getData: function () {
        var _this=this;
        $.ajax({
            url:_this.defaultOpt.url,
            type:'get',
            async:false,
            cache:false,
            dataType:'json',
            success: function (val) {
                _this.data=val;
            }
        });
        // console.log(this.data)
    },
    //绑定数据
    bind: function () {
        var _this=this;
        var strImg='',strDot='';
        $.each(this.data, function (index, item) {
            strImg+='<li><a href="###"><img src="" realImg="'+item['imgSrc']+'" alt=""/></a></li>';
            strDot+= index==0?'<i class="on"></i>':index==_this.data.length-1?'<i class="last"></i>':'<i></i>';
        });
        this.$slideUl.html(strImg);
        this.$aLi=this.$slideMain.find('li');
        this.$aImg=this.$slideMain.find('img');//绑定数据后就重新获取下img 让Banner的this.$aImg属性值正确
        this.$indicator.html(strDot);
        this.$dot=this.$indicator.children('i');
    },
    //图片延迟加载
    lazyImg: function () {
        var _this=this;
        //this.$aImg=this.$slideMain.find('json');//重新获取img---也可以绑定数据后就重新获取下
        $.each(this.$aImg, function (index, item) {
            //实现一：严谨的思想
            var tmpImg=new Image;
            tmpImg.src=$(item).attr('realImg');
            tmpImg.onload= function () {
                item.src=this.src;
                tmpImg=null;
            };
            //实现二：直接给图片的src赋值
            //item.src=$(item).attr('realImg');
        });
        //默认第一个显示
        this.$aLi.eq(0).css('zIndex',1).stop().fadeIn(_this.defaultOpt.duration);
        //fadeIn() -- display:none
    },
    //图片轮播
    autoMove: function () {
        var _this=this;
        if(this.n>=this.$aLi.length-1){
            this.n=-1;
        }
        this.n++;
        this.setSlide();
    },
    setSlide: function () {
        var _this=this;
        //实现一
        /*$.each(this.$aImg, function (index, item) {
         if(index==_this.n){//改变的是原全局n--现在是Banner的属性
         $(item).css('zIndex',1).siblings().css('zIndex',0);
         $(item).stop().fadeIn(_this.defaultOpt.duration, function () {
         $(this).siblings().stop().hide();
         })
         }
         });*/
        //实现二:链式操作
        //先改变层级
        this.$aLi.eq(_this.n).css('zIndex',1).siblings().css('zIndex',0);//就得先改变层级 再进行效果渐隐渐现
        //当前显示，其他隐藏
        this.$aLi.eq(_this.n).stop().fadeIn(_this.defaultOpt.duration, function () {
            $(this).siblings().stop().hide();
        });
        this.slideTip();
    },
    // 焦点轮播
    slideTip: function () {
        var _this=this;
        //this.$aLi=this.$oUl.children('li');//也可以在绑定完数据就立即获取
        //实现一
        //$.each(this.$aLi, function (index, item) {
        //    item.className= index==_this.n?'on':null;
        //});
        //实现二：链式操作
        $(this.$dot).eq(this.n).addClass('on').siblings().removeClass('on');
    },
    //鼠标经过显示+停止定时器
    overOut: function () {
        var _this=this;
        $(this.$slide).mouseover(function () {
            clearInterval(_this.timer);
            // $(_this.$btnLeft).css('display','block');
            // $(_this.$btnRight).css('display','block')
        });
        $(this.$slide).mouseout(function () {
            _this.timer=setInterval(function () {
                _this.autoMove();
            },_this.defaultOpt.interval);
            // $(_this.$btnLeft).css('display','none');
            // $(_this.$btnRight).css('display','none')
        });
    },
    handleChange: function () {
        var _this=this;
        //this.$aLi=this.$oUl.children('li');
        $.each(this.$dot,function (index, item) {
            $(item).click(function () {
                _this.n=index;
                _this.setSlide();
            });
        });
    },
    leftRight: function () {
        var _this=this;//解决_this
        $(this.$btnRight).click(function () {
            _this.autoMove();//一次的运动
        });
        $(this.$btnLeft).click(function () {
            if(_this.n<=0){
                _this.n=_this.$aLi.length;
            }
            _this.n--;
            _this.setSlide();
        });
    }
};