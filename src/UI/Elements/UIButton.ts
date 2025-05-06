import { Container, FederatedPointerEvent, Graphics, Text, TextStyle } from 'pixi.js';

interface UIButtonConfig {
    width?: number;
    height?: number;
    label?: string;
    fontSize?: number;
    onClick?: () => void;
}

export default class UIButton extends Container {
    private config: UIButtonConfig;
    private background: Graphics;
    private labelText: Text;
    private buttonMode: boolean = true;

    constructor(config: UIButtonConfig) {
        super();
        
        this.config = config;

        this.background = new Graphics();
        this.labelText = new Text(config.label ?? '', new TextStyle({
            fill: 0xffffff,
            fontSize: config.fontSize ?? 18,
        }));

        this.drawButton();
        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', this.handleClick.bind(this));
    }

    protected drawButton(): void {
        const width = this.config.width ?? 150;
        const height = this.config.height ?? 50;

        this.background.clear();
        this.background.beginFill(0x333333);
        this.background.roundRect(0, 0, width, height, 10);
        this.background.endFill();

        this.addChild(this.background);

        this.labelText.anchor.set(0.5);
        this.labelText.position.set(width / 2, height / 2);
        this.addChild(this.labelText);
    }

    private handleClick(e: FederatedPointerEvent) {
        this.config.onClick?.();
    }

    public setLabel(newLabel: string) {
        this.labelText.text = newLabel;
    }

    public setEnabled(enabled: boolean) {
        this.interactive = this.buttonMode = enabled;
        this.alpha = enabled ? 1 : 0.5;
    }
}