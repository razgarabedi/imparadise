# Supported Image Formats

Imparadise now supports a wide range of image formats commonly used across different devices and platforms.

## Standard Formats

### JPEG (.jpg, .jpeg)
- **MIME Type**: `image/jpeg`
- **Description**: Most common image format for photos
- **Use Cases**: Digital cameras, web images, social media
- **Compression**: Lossy compression
- **File Size**: Small to medium

### PNG (.png)
- **MIME Type**: `image/png`
- **Description**: Lossless format with transparency support
- **Use Cases**: Screenshots, graphics with transparency, web graphics
- **Compression**: Lossless compression
- **File Size**: Medium to large

### GIF (.gif)
- **MIME Type**: `image/gif`
- **Description**: Animated images and simple graphics
- **Use Cases**: Animated memes, simple animations, web graphics
- **Compression**: Lossless compression
- **File Size**: Small to medium

### BMP (.bmp)
- **MIME Type**: `image/bmp`
- **Description**: Uncompressed bitmap format
- **Use Cases**: Windows applications, simple graphics
- **Compression**: No compression
- **File Size**: Large

### WebP (.webp)
- **MIME Type**: `image/webp`
- **Description**: Modern web-optimized format by Google
- **Use Cases**: Web images, modern browsers
- **Compression**: Lossy and lossless options
- **File Size**: Small to medium

### TIFF (.tiff)
- **MIME Type**: `image/tiff`
- **Description**: High-quality format for professional use
- **Use Cases**: Professional photography, printing, archiving
- **Compression**: Lossless compression
- **File Size**: Large

### SVG (.svg)
- **MIME Type**: `image/svg+xml`
- **Description**: Vector graphics format
- **Use Cases**: Icons, logos, scalable graphics
- **Compression**: Text-based, very small
- **File Size**: Very small

## Apple Device Formats

### HEIC (.heic)
- **MIME Type**: `image/heic`
- **Description**: High Efficiency Image Container (iOS 11+)
- **Use Cases**: iPhone and iPad photos
- **Compression**: Advanced lossy compression
- **File Size**: Very small (50% smaller than JPEG)
- **Device Support**: iPhone 7+, iPad (2017+), macOS High Sierra+

### HEIF (.heif)
- **MIME Type**: `image/heif`
- **Description**: High Efficiency Image Format
- **Use Cases**: Modern Apple devices, some Android devices
- **Compression**: Advanced lossy compression
- **File Size**: Very small
- **Device Support**: iOS 11+, macOS High Sierra+, Android 9+

### HEIC Sequence (.heic-sequence)
- **MIME Type**: `image/heic-sequence`
- **Description**: Burst photos and Live Photos
- **Use Cases**: iPhone burst mode, Live Photos
- **Compression**: Advanced lossy compression
- **File Size**: Small to medium

### HEIF Sequence (.heif-sequence)
- **MIME Type**: `image/heif-sequence`
- **Description**: Burst photos in HEIF format
- **Use Cases**: Modern devices with burst mode
- **Compression**: Advanced lossy compression
- **File Size**: Small to medium

## Android and Modern Formats

### AVIF (.avif)
- **MIME Type**: `image/avif`
- **Description**: AV1 Image File Format
- **Use Cases**: Modern web, Android devices
- **Compression**: Advanced lossy compression
- **File Size**: Very small (30-50% smaller than WebP)
- **Device Support**: Android 12+, modern browsers

### JPEG XL (.jxl)
- **MIME Type**: `image/jxl`
- **Description**: Next-generation image format
- **Use Cases**: Future-proof image storage
- **Compression**: Advanced lossy and lossless
- **File Size**: Very small
- **Device Support**: Limited but growing

### JPEG XR (.jxr)
- **MIME Type**: `image/jxr`
- **Description**: Microsoft's extended JPEG format
- **Use Cases**: Windows applications, some mobile devices
- **Compression**: Advanced lossy compression
- **File Size**: Small to medium

### Windows Photo (.wdp)
- **MIME Type**: `image/vnd.ms-photo`
- **Description**: Windows Photo format
- **Use Cases**: Windows applications
- **Compression**: Advanced lossy compression
- **File Size**: Small to medium

## Additional Formats

### ICO (.ico)
- **MIME Type**: `image/x-icon`
- **Description**: Windows icon format
- **Use Cases**: Website favicons, Windows icons
- **Compression**: Limited compression
- **File Size**: Very small

### Photoshop (.psd)
- **MIME Type**: `image/vnd.adobe.photoshop`
- **Description**: Adobe Photoshop native format
- **Use Cases**: Professional image editing
- **Compression**: Limited compression
- **File Size**: Large

### RAW Formats (.raw)
- **MIME Type**: `image/x-raw`
- **Description**: Camera sensor data
- **Use Cases**: Professional photography, post-processing
- **Compression**: No compression
- **File Size**: Very large

### Portable Formats

#### PPM (.ppm)
- **MIME Type**: `image/x-portable-pixmap`
- **Description**: Portable pixmap format
- **Use Cases**: Simple image processing
- **Compression**: No compression
- **File Size**: Large

#### PGM (.pgm)
- **MIME Type**: `image/x-portable-graymap`
- **Description**: Portable graymap format
- **Use Cases**: Grayscale image processing
- **Compression**: No compression
- **File Size**: Medium to large

#### PBM (.pbm)
- **MIME Type**: `image/x-portable-bitmap`
- **Description**: Portable bitmap format
- **Use Cases**: Binary image processing
- **Compression**: No compression
- **File Size**: Small to medium

## Device Compatibility

### iOS Devices
- **iPhone 7+**: HEIC, HEIF, JPEG, PNG, GIF, WebP
- **iPad (2017+)**: HEIC, HEIF, JPEG, PNG, GIF, WebP
- **Older iOS**: JPEG, PNG, GIF, BMP

### Android Devices
- **Android 12+**: AVIF, WebP, JPEG, PNG, GIF, HEIF
- **Android 9-11**: WebP, JPEG, PNG, GIF, HEIF
- **Older Android**: JPEG, PNG, GIF, BMP

### Desktop Browsers
- **Chrome 85+**: AVIF, WebP, JPEG, PNG, GIF, SVG
- **Firefox 80+**: WebP, JPEG, PNG, GIF, SVG
- **Safari 14+**: WebP, JPEG, PNG, GIF, SVG
- **Edge 85+**: AVIF, WebP, JPEG, PNG, GIF, SVG

## Recommendations

### For Web Use
- **Best**: WebP, AVIF (modern browsers)
- **Fallback**: JPEG, PNG
- **Icons**: SVG

### For Mobile Photos
- **iPhone**: HEIC/HEIF (smaller files)
- **Android**: WebP, JPEG
- **Universal**: JPEG (widest compatibility)

### For Professional Use
- **Editing**: PSD, RAW
- **Printing**: TIFF, PNG
- **Archiving**: TIFF, PNG

### For Web Performance
- **Photos**: WebP, AVIF
- **Graphics**: SVG, PNG
- **Animations**: WebP, GIF

## File Size Guidelines

- **Web images**: < 500KB
- **Mobile photos**: < 5MB
- **Professional photos**: < 50MB
- **RAW files**: < 100MB

## Notes

- HEIC/HEIF files from Apple devices are automatically converted to JPEG for web display
- RAW files are supported but may not display in all browsers
- Some formats may require additional processing for optimal display
- File size limits are configurable in admin settings 