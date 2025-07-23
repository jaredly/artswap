// app/lib/image/process.ts

import sharp from 'sharp';
import {IMAGE_CONFIG} from './config';

export interface ImageProcessingResult {
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
    metadata: {
        originalSize: number;
        processedSizes: Record<string, number>;
        format: string;
        dimensions: {width: number; height: number};
    };
}

/**
 * Process an image buffer into thumbnail, medium, and large sizes.
 * Returns file paths and metadata.
 */
export async function processImage(buffer: Buffer, outputDir: string, filenameBase: string, mimeType: string): Promise<ImageProcessingResult> {
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const originalPath = `${outputDir}/original/${filenameBase}.${ext}`;
    const thumbnailPath = `${outputDir}/thumbnails/${filenameBase}.${ext}`;
    const mediumPath = `${outputDir}/medium/${filenameBase}.${ext}`;
    const largePath = `${outputDir}/large/${filenameBase}.${ext}`;

    // Save original
    await sharp(buffer).toFile(originalPath);

    // Process and save thumbnail
    await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.small).toFile(thumbnailPath);

    // Process and save medium
    await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.medium).toFile(mediumPath);

    // Process and save large
    await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.large).toFile(largePath);

    const metadata = await sharp(buffer).metadata();

    return {
        original: originalPath,
        thumbnail: thumbnailPath,
        medium: mediumPath,
        large: largePath,
        metadata: {
            originalSize: buffer.length,
            processedSizes: {
                thumbnail: (await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.small).toBuffer()).length,
                medium: (await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.medium).toBuffer()).length,
                large: (await sharp(buffer).resize(IMAGE_CONFIG.thumbnailSizes.large).toBuffer()).length,
            },
            format: metadata.format || '',
            dimensions: {
                width: metadata.width || 0,
                height: metadata.height || 0,
            },
        },
    };
}
