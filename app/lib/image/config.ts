// app/lib/image/config.ts

export const IMAGE_CONFIG = {
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxDimensions: {
        width: 4000,
        height: 4000,
    },
    thumbnailSizes: {
        small: {width: 300, height: 300},
        medium: {width: 800, height: 800},
        large: {width: 1200, height: 1200},
    },
    quality: {
        jpeg: 85,
        webp: 80,
    },
};
