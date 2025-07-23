// app/lib/image/upload.ts

import type {ImageProcessingResult} from './process';
import {processImage} from './process';
import {validateImageDimensions, validateImageSize, validateImageType} from './validate';

/**
 * Handle image upload: validate and process.
 * Throws error if validation fails.
 */
export async function handleImageUpload(buffer: Buffer, mimeType: string, outputDir: string, filenameBase: string): Promise<ImageProcessingResult> {
    if (!validateImageType(mimeType)) {
        throw new Error('Unsupported image type');
    }
    if (!validateImageSize(buffer.length)) {
        throw new Error('Image file too large');
    }
    const validDimensions = await validateImageDimensions(buffer);
    if (!validDimensions) {
        throw new Error('Image dimensions exceed allowed maximum');
    }
    return await processImage(buffer, outputDir, filenameBase, mimeType);
}
