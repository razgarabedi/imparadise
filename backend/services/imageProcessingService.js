const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ImageProcessingService {
  constructor() {
    this.thumbnailSize = 300; // Width and height for thumbnails
    this.thumbnailQuality = 80; // JPEG quality for thumbnails
  }

  /**
   * Generate a thumbnail from an uploaded image
   * @param {string} originalPath - Path to the original image
   * @param {string} uploadsDir - Directory where uploads are stored
   * @returns {Promise<{thumbnailFilename: string, thumbnailPath: string}>}
   */
  async generateThumbnail(originalPath, uploadsDir) {
    try {
      const thumbnailFilename = `thumb_${uuidv4()}.jpg`;
      const thumbnailPath = path.join(uploadsDir, thumbnailFilename);

      // Generate thumbnail using Sharp
      await sharp(originalPath)
        .resize(this.thumbnailSize, this.thumbnailSize, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: this.thumbnailQuality })
        .toFile(thumbnailPath);

      return {
        thumbnailFilename,
        thumbnailPath
      };
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  /**
   * Check if a file is a supported image format
   * @param {string} mimetype - MIME type of the file
   * @returns {boolean}
   */
  isSupportedImageFormat(mimetype) {
    const supportedFormats = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];
    return supportedFormats.includes(mimetype.toLowerCase());
  }

  /**
   * Clean up thumbnail file
   * @param {string} thumbnailPath - Path to the thumbnail file
   */
  async cleanupThumbnail(thumbnailPath) {
    try {
      await fs.unlink(thumbnailPath);
    } catch (error) {
      console.error('Error cleaning up thumbnail:', error);
    }
  }
}

module.exports = new ImageProcessingService(); 