import {DetailedHTMLProps, HTMLProps, ReactNode} from "react";

type BaseUiProps = HTMLProps<HTMLDivElement>;

export abstract class SpiralPlugin<UiProps extends BaseUiProps> {
  public abstract pluginId: string;

  // Plugin UI
  public abstract ui: (props: UiProps) => ReactNode | undefined;
  protected _uiInstance: ReactNode | undefined = undefined;

  /**
   * Create an instance of the UI
   * @param props Props to pass the UI
   */
  public createUi(props: UiProps): void {

    if (!this.ui) {
      throw new Error("UI does not exist & therefore cannot be mounted!");
    }

    this._uiInstance = this.ui(props);

  }

  /**
   * Getter for the UI instance
   */
  public get uiInstance(): ReactNode | undefined {
    return this._uiInstance
  }

  /**
   * Handler run when the plugin is enabled
   */
  public async onEnable(): Promise<void> {
  }

  /**
   * Handler run when the plugin is disabled
   */
  public async onDisable(): Promise<void> {
  }

}


