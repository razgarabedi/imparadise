-- Add thumbnail fields to images table
ALTER TABLE images 
ADD COLUMN thumbnail_filename VARCHAR(255),
ADD COLUMN thumbnail_url TEXT;

-- Create index for better performance
CREATE INDEX idx_images_thumbnail_filename ON images(thumbnail_filename); 