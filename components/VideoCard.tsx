"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import {
  Download,
  Clock,
  FileDown,
  FileUp,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      quality: "auto",
      format: "mp4",
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      quality: "auto",
      format: "mp4",
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.max(
    0,
    Math.round(
      (1 -
        Number(video.compressedSize) /
          Number(video.originalSize)) *
        100
    )
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  const handleDownloadClick = () => {
    const videoUrl = getFullVideoUrl(video.publicId);

    const link = document.createElement("a");

    link.href = videoUrl;

    link.setAttribute(
      "download",
      `${video.title}.mp4`
    );

    link.setAttribute("target", "_blank");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div
      className="
        card
        bg-base-100
        shadow-xl
        hover:shadow-2xl
        hover:scale-[1.02]
        transition-all
        duration-300
        border
        border-base-300
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative overflow-hidden">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-red-500 font-semibold">
                Preview not available
              </p>
            </div>
          ) : (
            <video
              key={video.publicId}
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center">
          <Clock size={16} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">
          {video.title}
        </h2>

        <p className="text-sm text-base-content opacity-70 mb-2">
          {video.description}
        </p>

        <p className="text-sm text-base-content opacity-60 mb-4">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center bg-base-200 p-3 rounded-xl">
            <FileUp
              size={18}
              className="mr-2 text-primary"
            />

            <div>
              <div className="font-semibold">
                Original
              </div>

              <div>
                {formatSize(
                  Number(video.originalSize)
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-base-200 p-3 rounded-xl">
            <FileDown
              size={18}
              className="mr-2 text-secondary"
            />

            <div>
              <div className="font-semibold">
                Compressed
              </div>

              <div>
                {formatSize(
                  Number(video.compressedSize)
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="text-sm font-semibold">
            Compression:
            <span className="text-success ml-2">
              {compressionPercentage}%
            </span>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownloadClick}
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;