// app/lib/image/validate.ts

import sharp from 'sharp';
import {IMAGE_CONFIG} from './config';

/**
 * Validate image MIME type.
 */
export function validateImageType(mimeType: string): boolean {
    return IMAGE_CONFIG.supportedFormats.includes(mimeType);
}

/**
 * Validate image file size.
 */
export function validateImageSize(fileSize: number): boolean {
    return fileSize <= IMAGE_CONFIG.maxFileSize;
}

/**
 * Validate image dimensions using sharp.
 */
export async function validateImageDimensions(buffer: Buffer): Promise<boolean> {
    const metadata = await sharp(buffer).metadata();
    const {width, height} = metadata;
    if (!width || !height) return false;
    return width <= IMAGE_CONFIG.maxDimensions.width && height <= IMAGE_CONFIG.maxDimensions.height;
}
