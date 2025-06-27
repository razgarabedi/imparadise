-- Add thumbnail fields to images table
ALTER TABLE images 
ADD COLUMN IF NOT EXISTS thumbnail_filename VARCHAR(255),
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_images_thumbnail_filename ON images(thumbnail_filename); 