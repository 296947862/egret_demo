//横向布局：忽略子项上的坐标设置，所有子项的位置将由布局类统一管理
var BHorizontalLayout = (function (_super) {
    __extends(BHorizontalLayout, _super);
    function BHorizontalLayout() {
        _super.call(this);
        this.myGroup = new eui.Group();
        this.addChild(this.myGroup);
        this.myGroup.layout = new eui.BasicLayout();
        this.myGroup.width = 500;
        this.myGroup.height = 300;
        var outline = new egret.Shape();
        outline.graphics.lineStyle(3, 0x00eeee);
        outline.graphics.beginFill(0x000000, 0);
        outline.graphics.drawRect(0, 0, 500, 300);
        outline.graphics.endFill();
        this.myGroup.addChild(outline);
        var btn1 = new eui.Button();
        btn1.label = "Btn A";
        var btn2 = new eui.Button();
        btn2.label = "Btn B";
        var btn3 = new eui.Button();
        btn3.label = "Btn C";
        this.myGroup.addChild(btn1);
        this.myGroup.addChild(btn2);
        this.myGroup.addChild(btn3);
        var hLayout = new eui.HorizontalLayout();
        //gap属性：设置子项之间的间距
        hLayout.gap = 10;
        //padding系列：设置容器内间距
        hLayout.paddingTop = 30;
        //设置对齐方式
        hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.myGroup.layout = hLayout;
    }
    var d = __define,c=BHorizontalLayout,p=c.prototype;
    return BHorizontalLayout;
}(egret.Sprite));
egret.registerClass(BHorizontalLayout,'BHorizontalLayout');
//# sourceMappingURL=BHorizontalLayout.js.map