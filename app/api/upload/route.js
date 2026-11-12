import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://loygsmxtvgmwicskxwvs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'ragusma-uploads';

// Helper to determine mime type from extension
function getMimeType(ext) {
  switch (ext) {
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.jpg':
    case '.jpeg':
    default:
      return 'image/jpeg';
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      const single = formData.get('file');
      if (single) {
        files.push(single);
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const savedUrls = [];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

    for (const file of files) {
      if (typeof file === 'string') continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';

      if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: `File type ${ext} is not allowed` }, { status: 400 });
      }

      const mimeType = file.type || getMimeType(ext);
      const safeName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;

      let uploadedUrl = null;

      // 1. Try uploading to Supabase Cloud Storage (primary for Vercel production)
      if (SUPABASE_URL && SUPABASE_KEY) {
        try {
          const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${safeName}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${SUPABASE_KEY}`,
              apikey: SUPABASE_KEY,
              'Content-Type': mimeType
            },
            body: buffer
          });

          if (uploadRes.ok) {
            uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${safeName}`;
          } else {
            const errData = await uploadRes.text();
            console.warn('Supabase storage upload notice:', errData);
          }
        } catch (supabaseErr) {
          console.warn('Supabase storage exception:', supabaseErr.message);
        }
      }

      // 2. If Supabase upload succeeded, save it
      if (uploadedUrl) {
        savedUrls.push(uploadedUrl);
        continue;
      }

      // 3. Fallback: try local filesystem if writable (local development)
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, safeName);
        await fs.writeFile(filePath, buffer);
        savedUrls.push(`/uploads/${safeName}`);
        continue;
      } catch (fsErr) {
        console.warn('Local fs upload skipped (serverless environment):', fsErr.message);
      }

      // 4. Fallback for read-only serverless environments without cloud storage: Data URI
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64}`;
      savedUrls.push(dataUri);
    }

    return NextResponse.json({
      success: true,
      urls: savedUrls,
      url: savedUrls[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file(s): ' + error.message }, { status: 500 });
  }
}
