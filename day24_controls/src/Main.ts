//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */

    protected startCreateScene(): void {
        //创建主布局
        var scroller = new eui.Scroller();
        scroller.percentWidth = 100;
        scroller.percentHeight = 100;
        this.addChild(scroller);
        var mainGroup = new eui.Group();
        let mainLayout: eui.VerticalLayout = new eui.VerticalLayout();
        mainLayout.gap = 8;
        mainGroup.layout = mainLayout;
        scroller.viewport = mainGroup;
        scroller.addChild(mainGroup);
        //创建文本
        let label: eui.Label = new eui.Label();
        label.text = "测试文本,今天天气真不错啊，不是吗？Yes, what a great day.";
        label.width = 600;
        label.height = 300;
        label.fontFamily = "Microsoft Yahei, Tahama";
        label.textColor = 0xffeeaa;
        label.size = 36;
        label.bold = false;
        label.italic = false;
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.lineSpacing = 8;

        mainGroup.addChild(label);

        //自定义styley以及创建按钮
        var button = new eui.Button();
        EXML.load("resource/skins/MyLabelSkin.exml", (clazz: any, url: string) => {
            button.skinName = clazz;
            button.labelDisplay.text = "Good";
            (<eui.Label>button.labelDisplay).size = 49;
            button.enabled = true;
        }, this);
        mainGroup.addChild(button);

        //创建图片
        let image: eui.Image = new eui.Image();
        image.source = "resource/assets/egret_icon.png";
        //九宫格的四个参数分别是：区域1的宽高，区域5的宽高
        image.scale9Grid = new egret.Rectangle(10, 10, 80, 80);
        // image.width = 200;
        // image.height = 200;
        mainGroup.addChild(image);

        // 创建复选框
        let cbx = new eui.CheckBox();
        cbx.label = "选择1";
        mainGroup.addChild(cbx);
        cbx.addEventListener(eui.UIEvent.CHANGE, (e: eui.UIEvent) => {
            egret.log(e.target.selected);
        }, this);
        let cbx2 = new eui.CheckBox();
        cbx2.label = "选择2";
        mainGroup.addChild(cbx2);
        let cbx3 = new eui.CheckBox();
        cbx3.label = "选择3";
        mainGroup.addChild(cbx3);
        cbx3.enabled = false;

        //创建单选框
        // let rdb: eui.RadioButton = new eui.RadioButton();
        // rdb.label = "单选1";
        // rdb.value = 1;
        // rdb.groupName = "group1";
        // rdb.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        // this.addChild(rdb);
        // let rdb2: eui.RadioButton = new eui.RadioButton();
        // rdb2.label = "单选2";
        // rdb2.value = 2;
        // rdb2.groupName = "group1";
        // rdb2.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        // this.addChild(rdb2);
        // let rdb3: eui.RadioButton = new eui.RadioButton();
        // rdb3.label = "单选3";
        // rdb3.value = 3;
        // rdb3.groupName = "group1";
        // rdb3.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        // this.addChild(rdb3);

        //使用RadioGroup
        let rdbGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        rdbGroup.addEventListener(eui.UIEvent.CHANGE, (e: eui.UIEvent) => {
            let rdbGroup: eui.RadioButtonGroup = e.target;
            egret.log(rdbGroup.selectedValue);
        }, this);
        let rdb: eui.RadioButton = new eui.RadioButton();
        rdb.label = "单选1";
        rdb.value = 1;
        rdb.group = rdbGroup;
        mainGroup.addChild(rdb);
        let rdb2: eui.RadioButton = new eui.RadioButton();
        rdb2.label = "单选2";
        rdb2.value = 2;
        rdb2.group = rdbGroup;
        mainGroup.addChild(rdb2);
        let rdb3: eui.RadioButton = new eui.RadioButton();
        rdb3.label = "单选3";
        rdb3.value = 3;
        rdb3.group = rdbGroup;
        mainGroup.addChild(rdb3);

        //使用状态切换按钮
        let switchButton: eui.ToggleSwitch = new eui.ToggleSwitch();
        switchButton.label = "ToggleSwitch";
        switchButton.addEventListener(eui.UIEvent.CHANGE, (e: eui.UIEvent) => {
            let switchButton: eui.ToggleSwitch = e.target;
            egret.log(switchButton.selected);
        }, this);
        mainGroup.addChild(switchButton);

        var toggleGroup: eui.Group = new eui.Group();
        var toggleGroupLayout = new eui.HorizontalLayout();
        toggleGroupLayout.verticalAlign = egret.VerticalAlign.CONTENT_JUSTIFY;
        toggleGroup.layout = toggleGroupLayout;
        mainGroup.addChild(toggleGroup);
        //使用ToggleButton
        var toggleBtns: Array<eui.ToggleButton> = [];
        for (var i: number = 0; i < 4; i++) {
            var btn: eui.ToggleButton = new eui.ToggleButton();
            btn.label = i + 1 + "";
            btn.addEventListener(eui.UIEvent.CHANGE, (e: eui.UIEvent) => {
                for (var i: number = 0; i < toggleBtns.length; i++) {
                    var btn: eui.ToggleButton = toggleBtns[i];
                    btn.selected = (btn == e.target);
                }
            }, this);
            toggleBtns.push(btn);
            toggleGroup.addChild(btn);
        }

        //使用滑动选择器,水平滑动HSlider, 竖直滑动VSlider
        let hSlider: eui.HSlider = new eui.HSlider();
        hSlider.width = 200;
        hSlider.x = 20;
        hSlider.y = 20;
        hSlider.minimum = 0;
        hSlider.maximum = 100;
        hSlider.value = 10;
        hSlider.addEventListener(eui.UIEvent.CHANGE, (e: eui.UIEvent) => {
            console.log(e.target.value);
        }, this);
        mainGroup.addChild(hSlider);

        //使用进度条
        let progressBar: eui.ProgressBar = new eui.ProgressBar();
        progressBar.maximum = 200;
        progressBar.minimum = 20;
        progressBar.width = 400;
        progressBar.height = 40;
        progressBar.value = 40;
        //定义进度条的方向
        progressBar.direction = eui.Direction.BTT;
        mainGroup.addChild(progressBar);
        let timer = new egret.Timer(1000, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            progressBar.value += 10;
            if (progressBar.value >= progressBar.maximum) {
                timer.stop();
            }
        }, this)
        timer.start();

        //使用文本输入控件
        var inputGroup: eui.Group = new eui.Group();
        inputGroup.layout = new eui.BasicLayout();
        mainGroup.addChild(inputGroup);
        var editBackground: eui.Image = new eui.Image();
        var editText: eui.EditableText = new eui.EditableText();
        editBackground.source = "resource/assets/bg_edit.png";
        editBackground.scale9Grid = new egret.Rectangle(2, 2, 20, 20);
        editBackground.width = 500;
        editBackground.height = 200;
        editBackground.verticalCenter = 0;
        editBackground.horizontalCenter = 0;
        inputGroup.addChild(editBackground);

        editText.text = "请输入文本";
        editText.textColor = 0x2233aa;
        editText.multiline = true;
        editText.verticalCenter = 0;
        editText.horizontalCenter = 0;
        editText.displayAsPassword = false;
        editText.wordWrap = true;
        editText.width = editBackground.width - 16;
        editText.height = editBackground.height - 16;
        editText.left = 0;
        inputGroup.addChild(editText);

        //使用TextInput
        let textInput = new eui.TextInput();
        textInput.prompt = "请输入文字";
        mainGroup.addChild(textInput);
    }

    private radioChangeHandler(e: eui.UIEvent): void {
        egret.log(e.target.value);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}
