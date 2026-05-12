export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {

    // USER AUTH
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // CLOUDINARY IMPORT
    const { v2: cloudinary } = await import("cloudinary");

    // CLOUDINARY CONFIG
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // FORM DATA
    const formData = await req.formData();

    // IMPORTANT
    const file = formData.get("file") as File | null;

    const title =
      (formData.get("title") as string) || "";

    const description =
      (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No video uploaded" },
        { status: 400 }
      );
    }

    // BUFFER
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // UPLOAD TO CLOUDINARY
    const uploadResult: any = await new Promise(
      (resolve, reject) => {

        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "video-uploads",
            },
            (error, result) => {

              if (error) {
                console.log(error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(buffer);
      }
    );

    // SAVE TO DATABASE
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: uploadResult.public_id,
        originalSize: String(uploadResult.bytes),
        compressedSize: String(uploadResult.bytes),
        duration: uploadResult.duration || 0,
      },
    });

    return NextResponse.json(video);

  } catch (error: any) {

    console.log("VIDEO_UPLOAD_ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}