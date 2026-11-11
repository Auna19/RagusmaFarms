import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      // Check single file
      const single = formData.get('file');
      if (single) {
        files.push(single);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const savedUrls = [];

    for (const file of files) {
      if (typeof file === 'string') continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate file extension
      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
      
      if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: `File type ${ext} is not allowed` }, { status: 400 });
      }

      const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadDir, safeName);

      await fs.writeFile(filePath, buffer);
      savedUrls.push(`/uploads/${safeName}`);
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

