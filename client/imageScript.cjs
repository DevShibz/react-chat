const fs = require('fs');
const path = require('path');

// Directory containing images
const imagesDirectory = path.join(__dirname, 'src', 'assets', 'images');

// Output file path
const outputFile = path.join(__dirname, 'src', 'utils', 'image.js');

// Function to read images and generate JSON
function readImages(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }

      // Filter out non-image files (assuming common image formats)
      const imageFiles = files.filter(file => {
        return /\.(jpg|jpeg|png|gif|bmp|svg)$/.test(file);
      });

      // Create JSON array with import paths
      const imageImports = imageFiles.map((file, index) => {
        return {
          filename: file,
          path: `images[${index}]`
        };
      });

      resolve({ imageImports, imageFiles });
    });
  });
}

// Function to write JSON data to a JavaScript file
function writeImageImportsToFile(data, filePath) {
  const { imageImports, imageFiles } = data;
  const imports = imageFiles.map((file, index) => `import image${index} from '../assets/images/${file}';`).join('\n');
  const fileContent = `${imports}\n\nexport const images = [${imageFiles.map((_, index) => `image${index}`).join(', ')}];\n\nexport const imagePaths = images.map((image, index) => ({
    path: \`images[\${index}]\`,
  }));\n`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// Use the functions and handle the process
readImages(imagesDirectory)
  .then(data => {
    return writeImageImportsToFile(data, outputFile);
  })
  .then(() => {
    console.log('Image imports written to utils/image.js');
  })
  .catch(error => {
    console.error('Error:', error);
  });
