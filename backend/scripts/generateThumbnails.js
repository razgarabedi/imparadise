const Image = require('../models/Image');
const imageProcessingService = require('../services/imageProcessingService');
const path = require('path');
const fs = require('fs').promises;

async function generateThumbnailsForExistingImages() {
  try {
    console.log('Starting thumbnail generation for existing images...');
    
    // Get all images that don't have thumbnails
    const images = await Image.findByFolderId(null); // This will get all images
    const imagesWithoutThumbnails = images.filter(img => !img.thumbnail_filename);
    
    console.log(`Found ${imagesWithoutThumbnails.length} images without thumbnails`);
    
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    for (const image of imagesWithoutThumbnails) {
      try {
        const originalPath = path.join(uploadsDir, image.stored_filename);
        
        // Check if original file exists
        try {
          await fs.access(originalPath);
        } catch (error) {
          console.log(`Skipping ${image.filename} - original file not found`);
          continue;
        }
        
        // Check if it's a supported image format
        if (!imageProcessingService.isSupportedImageFormat(image.mimetype)) {
          console.log(`Skipping ${image.filename} - unsupported format: ${image.mimetype}`);
          continue;
        }
        
        // Generate thumbnail
        const thumbnailResult = await imageProcessingService.generateThumbnail(originalPath, uploadsDir);
        
        // Update database with thumbnail info
        const thumbnailUrl = `http://localhost:5000/uploads/${thumbnailResult.thumbnailFilename}`;
        await Image.updateThumbnail(image.id, thumbnailResult.thumbnailFilename, thumbnailUrl);
        
        console.log(`Generated thumbnail for: ${image.filename}`);
        
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${image.filename}:`, error.message);
      }
    }
    
    console.log('Thumbnail generation completed!');
    
  } catch (error) {
    console.error('Error in thumbnail generation script:', error);
  }
}

// Run the script if called directly
if (require.main === module) {
  generateThumbnailsForExistingImages()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateThumbnailsForExistingImages }; 