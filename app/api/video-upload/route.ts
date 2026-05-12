export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// ❗ DO NOT configure at top level
function getCloudinary() {
  const c = cloudinary;

  c.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  return c;
}

export async function POST(req: NextRequest) {
  try {
    // ⚠️ wrap auth safely (this fixes build-time crash cases)
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const originalSize = (formData.get("originalSize") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const cloudinaryClient = getCloudinary();

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinaryClient.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "video-uploads",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: uploadResult.public_id,
        originalSize,
        compressedSize: String(uploadResult.bytes),
        duration: uploadResult.duration ?? 0,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("VIDEO_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}