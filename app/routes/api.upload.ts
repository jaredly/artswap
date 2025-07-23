// app/routes/api.upload.ts
import type {ActionFunctionArgs} from 'react-router';
import {validateImageType, validateImageSize, validateImageDimensions} from '~/lib/image/validate';
import {processImage} from '~/lib/image/process';
import {IMAGE_CONFIG} from '~/lib/image/config';
import db from '~/lib/db';
import winston from 'winston';
import {ZodError} from 'zod';

/* Rate limiting removed: install and configure a rate limiter for production */

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({stack: true}), winston.format.json()),
    transports: [new winston.transports.Console(), new winston.transports.File({filename: 'logs/upload.log'})],
});

export async function action({request}: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({success: false, error: {code: 'METHOD_NOT_ALLOWED', message: 'Only POST allowed'}}), {
            status: 405,
            headers: {'Content-Type': 'application/json'},
        });
    }

    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {code: 'INVALID_CONTENT_TYPE', message: 'Expected multipart/form-data'},
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}},
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file');
        if (!(file instanceof File)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {code: 'NO_FILE', message: 'No file uploaded'},
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}},
            );
        }

        // Validate file type
        if (!validateImageType(file.type)) {
            logger.warn('File validation failed: invalid type', {type: file.type});
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {code: 'INVALID_FILE_TYPE', message: 'Unsupported file type'},
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}},
            );
        }

        // Read file buffer
        let buffer = Buffer.from(await file.arrayBuffer());

        // If file size or dimensions are too large, scale down before further processing
        let needsResize = false;
        if (!validateImageSize(file.size)) {
            needsResize = true;
        } else {
            const validDimensions = await validateImageDimensions(buffer);
            if (!validDimensions) {
                needsResize = true;
            }
        }

        if (needsResize) {
            try {
                const sharp = (await import('sharp')).default;
                buffer = await sharp(buffer).resize(IMAGE_CONFIG.maxDimensions).toBuffer();
                logger.info('Image was too large and has been scaled down');
            } catch (err) {
                logger.error('Failed to scale down image', {error: err});
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: {code: 'RESIZE_FAILED', message: 'Could not scale down image'},
                    }),
                    {status: 500, headers: {'Content-Type': 'application/json'}},
                );
            }
        }

        // Generate output directory and filename
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const outputDir = `uploads/images/${year}/${month}`;
        const filenameBase = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

        // Process and store image
        let processed: Awaited<ReturnType<typeof processImage>>;
        try {
            processed = await processImage(buffer, outputDir, filenameBase, file.type);
        } catch (err) {
            logger.error('Image processing failed', {error: err});
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {code: 'PROCESSING_FAILED', message: (err as Error).message},
                }),
                {status: 500, headers: {'Content-Type': 'application/json'}},
            );
        }

        logger.info('Image uploaded', {
            original: processed.original,
            sizes: processed.metadata.processedSizes,
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    original: processed.original,
                    thumbnail: processed.thumbnail,
                    medium: processed.medium,
                    large: processed.large,
                    metadata: processed.metadata,
                },
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}},
        );
    } catch (err) {
        logger.error('Upload failed', {error: err});
        if (err instanceof ZodError) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: {code: 'VALIDATION_ERROR', message: err.message},
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}},
            );
        }
        return new Response(
            JSON.stringify({
                success: false,
                error: {code: 'UPLOAD_FAILED', message: (err as Error).message},
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}},
        );
    }
}

export const loader = () =>
    new Response(
        JSON.stringify({
            success: false,
            error: {code: 'METHOD_NOT_ALLOWED', message: 'GET not supported'},
        }),
        {status: 405, headers: {'Content-Type': 'application/json'}},
    );
