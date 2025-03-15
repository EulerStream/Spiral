import {SpiralPlugin} from "@spiral/plugin/src/index";
import SampleUI from "./ui";

export class SamplePlugin extends SpiralPlugin<{}> {
  ui = SampleUI;

  async onEnable(): Promise<void> {
    console.log('Sample plugin enabled');
  }

}

