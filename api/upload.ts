/**
 * File Upload Endpoint
 * Handle file uploads for tracker features (inventory images, documents)
 *
 * POST /api/upload
 * Multipart form data with file field
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db/client';
import { extractToken, verifyToken } from '@/lib/auth-utils';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/csv',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify authentication
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Parse form data
    const form = formidable({
      multiples: false,
      maxFileSize: MAX_FILE_SIZE,
      uploadDir: UPLOAD_DIR,
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(uploadedFile.mimetype || '')) {
      await fs.unlink(uploadedFile.filepath);
      return res.status(400).json({
        error: 'Invalid file type',
        allowed: ALLOWED_TYPES,
      });
    }

    // Generate unique filename
    const fileExt = path.extname(uploadedFile.originalFilename || '');
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
    const finalPath = path.join(UPLOAD_DIR, fileName);

    // Move file to final location
    await fs.rename(uploadedFile.filepath, finalPath);

    // Create file record in database
    const fileRecord = await sql`
      CREATE TABLE IF NOT EXISTS user_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        file_size BIGINT,
        mime_type VARCHAR(100),
        storage_path TEXT NOT NULL,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO user_files (user_id, file_name, original_name, file_size, mime_type, storage_path, url)
      VALUES (
        ${userId},
        ${fileName},
        ${uploadedFile.originalFilename},
        ${uploadedFile.size},
        ${uploadedFile.mimetype},
        ${finalPath},
        ${`/uploads/${fileName}`}
      )
      RETURNING id, file_name, url, created_at, file_size
    `;

    return res.status(201).json({
      success: true,
      file: fileRecord.rows[0],
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('[Upload] Error:', error);

    // Clean up if error occurs
    if (error instanceof Error && 'filepath' in error) {
      try {
        await fs.unlink((error as any).filepath);
      } catch (cleanupError) {
        console.error('[Upload] Cleanup error:', cleanupError);
      }
    }

    return res.status(500).json({
      error: 'File upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
