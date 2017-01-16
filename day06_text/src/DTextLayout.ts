///文本布局
class DTextLayout extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(e: egret.Event): void {
		var shape: egret.Shape = new egret.Shape();
		shape.graphics.beginFill(0xff0000);
		shape.graphics.drawRect(0, 0, 400, 400);
		shape.graphics.endFill();
		this.addChild(shape);
		var label: egret.TextField = new egret.TextField();
		this.addChild(label);
		label.width = 400;
		label.height = 400;
		label.text = "这是一个文本";
		// label.textAlign = egret.HorizontalAlign.RIGHT;
		// label.textAlign = egret.HorizontalAlign.CENTER;
		// label.verticalAlign = egret.VerticalAlign.BOTTOM;
		label.verticalAlign = egret.VerticalAlign.MIDDLE;
	}
}