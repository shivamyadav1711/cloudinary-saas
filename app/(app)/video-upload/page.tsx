"use client";

import React, { useState } from "react";

export default function VideoUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please select a video");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // IMPORTANT
      formData.append("file", videoFile);

      formData.append("title", title);
      formData.append("description", description);

      const response = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Video uploaded successfully");

      setTitle("");
      setDescription("");
      setVideoFile(null);

      window.location.href = "/home";
    } catch (error: any) {
      console.log(error);
      alert(error.message || "Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-3xl p-8 shadow-2xl">

          <h1 className="text-4xl font-bold text-center mb-10">
            Upload Video
          </h1>

          <form onSubmit={handleUpload} className="space-y-8">

            {/* TITLE */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-white">
                Video Title
              </label>

              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-[#374151]
                  rounded-xl
                  px-5
                  py-4
                  text-white
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-white">
                Description
              </label>

              <textarea
                rows={5}
                placeholder="Write something about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-[#374151]
                  rounded-xl
                  px-5
                  py-4
                  text-white
                  placeholder:text-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-500
                  resize-none
                "
              />
            </div>

            {/* FILE */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-white">
                Select Video File
              </label>

              <div
                className="
                  bg-[#111827]
                  border-2
                  border-dashed
                  border-[#374151]
                  rounded-2xl
                  p-8
                "
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setVideoFile(e.target.files?.[0] || null)
                  }
                  className="
                    w-full
                    text-white
                    file:bg-violet-600
                    file:text-white
                    file:border-0
                    file:rounded-lg
                    file:px-4
                    file:py-2
                    file:mr-4
                    file:cursor-pointer
                    cursor-pointer
                  "
                />

                {videoFile && (
                  <div className="mt-4">
                    <p className="text-green-400 font-medium">
                      Selected: {videoFile.name}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-violet-600
                hover:bg-violet-700
                transition-all
                duration-300
                rounded-xl
                py-4
                text-lg
                font-bold
                shadow-lg
                disabled:opacity-50
              "
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}