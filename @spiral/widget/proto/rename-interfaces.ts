import { promises as fs } from 'fs';

async function addIPrefixToInterfaces(filePath: string): Promise<void> {
  try {
    // Read the file content
    let data = await fs.readFile(filePath, 'utf-8');

    // Regex to find interface declarations with optional prefixes like `export`
    const interfaceDeclRegex = /(?:export\s+)?interface (\w+)/g;

    // Array to store interface names to avoid double renaming
    let interfaces: string[] = [];

    // Replace interface declarations with prefixed version
    data = data.replace(interfaceDeclRegex, (match, name) => {
      interfaces.push(name);
      return `${match.startsWith('export') ? 'export ' : ''}interface I${name}`;
    });

    interfaces.forEach(name => {
      // For each interface, replace in two instances
      // (1) MessageFns<InterfaceName> -> MessageFns<IInterfaceName>
      // (2) : InterfaceName -> : IInterfaceName
      // (3) DeepPartial<IInterfaceName> -> DeepPartial<IInterfaceName>

      const messageFnsRegex = new RegExp(`MessageFns<${name}>`, 'g');
      data = data.replace(messageFnsRegex, `MessageFns<I${name}>`);

      const interfaceTypeRegex = new RegExp(`: ${name}`, 'g');
      data = data.replace(interfaceTypeRegex, `: I${name}`);

      const deepPartialRegex = new RegExp(`DeepPartial<${name}>`, 'g');
      data = data.replace(deepPartialRegex, `DeepPartial<I${name}>`);
    });

    // Write the modified content back to the file
    await fs.writeFile(filePath, data, 'utf-8');

    console.log('Interfaces have been prefixed successfully.');
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

// Call the function
addIPrefixToInterfaces(filePath);
