const sharp = require('sharp');
const fs = require('fs').promises; // Verwende promises für async/await
const path = require('path');

const sizes = [
  { width: 320, suffix: 'sm' },
  { width: 768, suffix: 'md' },
  { width: 1024, suffix: 'lg' },
];

// Unterstützte Bildformate
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Hauptfunktion zum Scannen des Verzeichnisses und Verarbeiten der Bilder
async function processDirectory(directoryPath) {
  try {
    // Alle Dateien im Verzeichnis lesen
    const files = await fs.readdir(directoryPath);

    // Filtern nach unterstützten Bildformaten
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    });

    console.log(`Gefundene Bilder: ${imageFiles.length}`);

    // Jedes Bild verarbeiten
    for (const file of imageFiles) {
      const filePath = path.join(directoryPath, file);
      console.log(`Verarbeite: ${file}`);
      await processImage(filePath);
    }

    console.log('Alle Bilder wurden verarbeitet!');
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Bilder:', error);
  }
}

// Funktion zur Verarbeitung einzelner Bilder (unverändert)
async function processImage(filePath) {
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath, path.extname(filePath));

  for (const size of sizes) {
    try {
      await sharp(filePath)
        .resize(size.width)
        .toFile(path.join(dir, `${filename}-${size.suffix}.webp`));
      console.log(`  ✓ Erstellt: ${filename}-${size.suffix}.webp`);
    } catch (error) {
      console.error(`  ✗ Fehler bei ${filename}-${size.suffix}.webp:`, error);
    }
  }
}

// Script ausführen
// Verwenden Sie den Pfad zu Ihrem Bildverzeichnis
const imageDirectory = './images'; // Ändern Sie dies zu Ihrem Bildverzeichnis
processDirectory(imageDirectory);
