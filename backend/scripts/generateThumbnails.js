const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const imageProcessingService = require('../services/imageProcessingService');

const generateForMissing = async () => {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Checking for images missing thumbnails or previews...');
        const [images] = await connection.query('SELECT * FROM images WHERE thumbnail_filename IS NULL OR preview_filename IS NULL');
        
        if (images.length === 0) {
            console.log('All images have thumbnails and previews.');
            return;
        }

        console.log(`Found ${images.length} images to process.`);
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        for (const image of images) {
            const imagePath = path.join(uploadsDir, image.stored_filename);
            if (fs.existsSync(imagePath)) {
                console.log(`Processing ${image.filename}...`);
                
                if (!image.thumbnail_filename) {
                    try {
                        const { thumbnailFilename } = await imageProcessingService.generateThumbnail(imagePath, uploadsDir);
                        const thumbnailUrl = `/uploads/${thumbnailFilename}`;
                        await connection.query('UPDATE images SET thumbnail_filename = ?, thumbnail_url = ? WHERE id = ?', [thumbnailFilename, thumbnailUrl, image.id]);
                        console.log(`  -> Thumbnail created.`);
                    } catch (thumbError) {
                        console.error(`  -> Failed to create thumbnail for ${image.filename}:`, thumbError);
                    }
                }

                if (!image.preview_filename) {
                    try {
                        const { previewFilename } = await imageProcessingService.generatePreview(imagePath, uploadsDir);
                        const previewUrl = `/uploads/${previewFilename}`;
                        await connection.query('UPDATE images SET preview_filename = ?, preview_url = ? WHERE id = ?', [previewFilename, previewUrl, image.id]);
                        console.log(`  -> Preview created.`);
                    } catch (previewError) {
                        console.error(`  -> Failed to create preview for ${image.filename}:`, previewError);
                    }
                }
            } else {
                console.warn(`  -> Source file not found for ${image.filename} at ${imagePath}`);
            }
        }
    } catch (error) {
        console.error('An error occurred during image processing:', error);
    } finally {
        if (connection) connection.release();
        console.log('Processing complete.');
    }
};

generateForMissing();
