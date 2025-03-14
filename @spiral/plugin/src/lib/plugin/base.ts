import {HTMLProps, ReactNode} from "react";

type BaseUiProps = HTMLProps<HTMLDivElement>;



// todo decide how iw anna structure this (i.e. do i want different types of plugins?)
// ideally ALL plugins should have an API for implementing a settings UI with a JSON-style schema & predefined UI components
// they don't actually get to define the UI components themselves, but they can define the schema & we should build it
// but then other than that i need to decide if there are different types of components
// maybe we keep it Base in case we need non-ui components in the future but make a UiComponent the standard
// there's also the question of plugin categories. do we want a set # of categories plugins must fall into, or do
// we want to allow them to make their own arbitrary categories & we just group ones that use the same name?
// also note that the plugin id should be in the manifest, meaning NEVER trust the plugin to send its own id
// this way we can always PREVENT plugins from accessing each other's data

export abstract class SpiralPlugin<UiProps extends BaseUiProps> {

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


