import * as fs from 'fs/promises';
import * as path from 'node:path';

const JSZip = require('jszip');

async function createPluginZip() {
  try {
    const pkgPath = path.resolve(__dirname, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    const qualifiedName = pkg.name.split('/')[1];
    const prettyName = qualifiedName.split('-').map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const pluginFileName = `${prettyName}-${pkg.version}.plugin`;
    const zipFileName = pluginFileName + '.spiral';

    const manifest = {
      name: prettyName,
      description: pkg.description,
      version: pkg.version,
      id: qualifiedName
    };

    const outputsDir = path.resolve(__dirname, 'build/outputs');
    const distDir = path.resolve(__dirname, 'build/dist');

    // Ensure output directory exists
    await fs.mkdir(outputsDir, {recursive: true});

    // Write the manifest
    await fs.writeFile(path.resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Zip the dist folder & output it in build/outputs
    const zip = new JSZip();
    const files = await fs.readdir(distDir);

    for (let file of files) {
      const filePath = path.resolve(distDir, file);
      const fileContent = await fs.readFile(filePath);
      zip.file(file, fileContent);
    }

    const zipContent = await zip.generateAsync({type: 'nodebuffer'});
    await fs.writeFile(path.resolve(outputsDir, zipFileName), zipContent);
    console.log('Zip file has been created successfully!');

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

createPluginZip();
