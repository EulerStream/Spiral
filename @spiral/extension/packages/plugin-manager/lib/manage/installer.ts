import JSZip from "jszip";
import {z} from "zod";
import {pluginStorage} from "@extension/storage";
import {toast} from "sonner";

type Manifest = {
  name: string;
  version: string;
}

const manifestSchema = z.object({
  name: z.string(),
  version: z.string()
});

export async function installPlugin(file: File) {

  // Load the file (it's a zip file) & unzip it
  const zip = new JSZip();
  const zipFile = await zip.loadAsync(file);

  // Plugins have two files, a *.js file and a manifest.json file
  // The manifest.json file contains information about the plugin
  // The *.js file contains the plugin code
  // We need to extract both files from the zip file
  const manifest = zipFile.file("manifest.json");

  // find the plugin name i.e. the only file that ends with .js
  const plugin = Object.values(zipFile.files).find(file => file.name.endsWith(".js"));

  if (!manifest || !plugin) {
    throw new Error("Invalid plugin file");
  }

  // Read the files
  const manifestContent = await manifest.async("text");
  const pluginContent = await plugin.async("text");

  // Parse the manifest
  const manifestData: Manifest = manifestSchema.parse(JSON.parse(manifestContent));

  // Install the plugin by storing it in the database
  if (await pluginStorage.hasPlugin(manifestData.name)) {
    throw new Error("Plugin already installed");
  }

  await pluginStorage.setPlugin(
      manifestData.name,
      {
        script: pluginContent,
        enabled: false,
        manifest: manifestData
      }
  );

  toast.success("Plugin installed successfully");


}