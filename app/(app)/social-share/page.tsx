"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [selectedFormat, setSelectedFormat] =
    useState<SocialFormat>("Instagram Square (1:1)");

  const [isUploading, setIsUploading] = useState(false);

  const [isTransforming, setIsTransforming] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;

    try {
      const response = await fetch(imageRef.current.src);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${selectedFormat
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12">
          Social Media Image Creator
        </h1>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6">
            Upload an Image
          </h2>

          <div className="mb-6">
            <label className="block mb-3 text-gray-300 text-lg">
              Choose an image file
            </label>

            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl p-4 file:mr-4 file:py-3 file:px-6 file:border-0 file:rounded-lg file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
          </div>

          {isUploading && (
            <div className="mb-6">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Select Social Media Format
                </h2>

                <select
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                  className="w-full p-4 rounded-xl bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option
                      key={format}
                      value={format}
                      className="bg-[#111827] text-white"
                    >
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <h3 className="text-3xl font-bold mb-6">
                  Preview:
                </h3>

                <div className="flex justify-center overflow-hidden rounded-2xl border border-gray-700 bg-black p-4">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-2xl">
                      <span className="loading loading-spinner loading-lg text-white"></span>
                    </div>
                  )}

                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transformed Image"
                    crop="fill"
                    gravity="auto"
                    aspectRatio={
                      socialFormats[selectedFormat].aspectRatio
                    }
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-2xl max-w-full h-auto"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-500 transition-all px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
                >
                  Download for {selectedFormat}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}