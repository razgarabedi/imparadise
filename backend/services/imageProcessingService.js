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

  /**
   * Generate a preview from an uploaded image
   * @param {string} originalPath - Path to the original image
   * @param {string} uploadsDir - Directory where uploads are stored
   * @returns {Promise<{previewFilename: string, previewPath: string}>}
   */
  async generatePreview(originalPath, uploadsDir) {
    try {
      const previewFilename = `preview-${uuidv4()}.webp`;
      const previewPath = path.join(uploadsDir, previewFilename);

      // Generate preview using Sharp
      await sharp(originalPath)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(previewPath);

      return {
        previewFilename,
        previewPath
      };
    } catch (error) {
      console.error('Error generating preview:', error);
      throw new Error('Failed to generate preview');
    }
  }

  /**
   * Process and save an image, calculating the total disk space used by the original image, its thumbnail, and its preview
   * @param {Object} file - The uploaded file object
   * @param {string} folderId - The ID of the folder where the image will be saved
   * @returns {Promise<{filename: string, path: string, size: number, mimeType: string, thumbnail_filename: string, thumbnail_path: string, preview_filename: string, preview_path: string}>}
   */
  async processAndSaveImage(file, folderId) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const folderUploadDir = path.join(uploadDir, folderId.toString());
    await fs.mkdir(folderUploadDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    let extension = path.extname(file.originalname);
    const baseFilename = path.basename(file.originalname, extension);

    // Ensure we handle AVIF and other formats that need conversion
    const isAvif = file.mimetype === 'image/avif';
    const needsConversion = !['.jpeg', '.jpg', '.png', '.webp'].includes(extension.toLowerCase());

    if (isAvif || needsConversion) {
      extension = '.jpg'; // Convert to JPEG
    }

    const newFilename = `${baseFilename}-${uniqueSuffix}${extension}`;
    const newPath = path.join(folderUploadDir, newFilename);

    // Process the image: convert if necessary, otherwise just move
    if (isAvif || needsConversion) {
      await sharp(file.path)
        .jpeg({ quality: 90 })
        .toFile(newPath);
      await fs.unlink(file.path); // Clean up original temp file
    } else {
      await fs.rename(file.path, newPath);
    }

    try {
      const originalMetadata = await sharp(newPath).metadata();
      let totalSize = originalMetadata.size || (await fs.stat(newPath)).size;

      const thumbFilename = `thumb-${newFilename}`;
      const thumbPath = path.join(folderUploadDir, thumbFilename);
      await sharp(newPath)
        .resize({ width: 200 })
        .toFile(thumbPath);

      const previewFilename = `preview-${newFilename.substring(0, newFilename.lastIndexOf('.'))}.webp`;
      const previewPath = path.join(folderUploadDir, previewFilename);
      await sharp(newPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(previewPath);

      try {
        const thumbMetadata = await sharp(thumbPath).metadata();
        totalSize += thumbMetadata.size || (await fs.stat(thumbPath)).size;
      } catch (error) {
        console.error('Could not get thumbnail metadata, falling back to fs.stat:', error);
        try {
          totalSize += (await fs.stat(thumbPath)).size;
        } catch (statError) {
          console.error('fs.stat for thumbnail failed:', statError);
        }
      }

      try {
        const previewMetadata = await sharp(previewPath).metadata();
        totalSize += previewMetadata.size || (await fs.stat(previewPath)).size;
      } catch (error) {
        console.error('Could not get preview metadata, falling back to fs.stat:', error);
        try {
          totalSize += (await fs.stat(previewPath)).size;
        } catch (statError) {
          console.error('fs.stat for preview failed:', statError);
        }
      }
      
      const dbPath = (subpath) => path.join('uploads', folderId.toString(), subpath).replace(/\\/g, '/');

      return {
        filename: newFilename,
        path: dbPath(newFilename),
        size: totalSize,
        mimeType: isAvif || needsConversion ? 'image/jpeg' : file.mimetype,
        thumbnail_filename: thumbFilename,
        thumbnail_path: dbPath(thumbFilename),
        preview_filename: previewFilename,
        preview_path: dbPath(previewFilename),
      };
    } catch (error) {
      console.error('Error processing image:', error);
      await fs.unlink(newPath).catch(err => console.error('Error cleaning up processed file:', err));
      throw new Error('Failed to process image');
    }
  }
}

module.exports = new ImageProcessingService();