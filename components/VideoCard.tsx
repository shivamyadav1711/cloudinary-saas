"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import {
  Download,
  Clock,
  FileDown,
  FileUp,
  Sparkles,
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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 500,
      height: 300,
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
      width: 500,
      height: 300,
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
        relative
        overflow-hidden
        rounded-3xl
        border
        border-primary/30
        bg-base-100/70
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(99,102,241,0.25)]
        hover:shadow-[0_0_60px_rgba(99,102,241,0.45)]
        hover:-translate-y-2
        transition-all
        duration-500
        group
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* glowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-80"></div>

      {/* animated glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>

      <div className="relative z-10">
        <figure className="aspect-video relative overflow-hidden">
          {isHovered ? (
            previewError ? (
              <div className="w-full h-full flex items-center justify-center bg-base-200">
                <p className="text-error font-bold">
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
                className="w-full h-full object-cover scale-105"
                onError={handlePreviewError}
              />
            )
          ) : (
            <>
              <img
                src={getThumbnailUrl(video.publicId)}
                alt={video.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            </>
          )}

          <div className="absolute top-3 left-3">
            <div className="badge badge-primary gap-1 p-3 shadow-lg">
              <Sparkles size={14} />
              AI Optimized
            </div>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-md">
            <Clock size={14} className="mr-1" />
            {formatDuration(video.duration)}
          </div>
        </figure>

        <div className="p-5">
          <h2 className="text-2xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {video.title}
          </h2>

          <p className="text-sm opacity-80 mb-3 line-clamp-2">
            {video.description}
          </p>

          <p className="text-xs opacity-60 mb-5">
            Uploaded {dayjs(video.createdAt).fromNow()}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-2xl bg-base-200/60 border border-base-300 p-4 backdrop-blur-lg">
              <div className="flex items-center mb-2">
                <FileUp
                  size={18}
                  className="mr-2 text-primary"
                />
                <span className="font-bold text-sm">
                  Original
                </span>
              </div>

              <div className="text-lg font-extrabold">
                {formatSize(
                  Number(video.originalSize)
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-base-200/60 border border-base-300 p-4 backdrop-blur-lg">
              <div className="flex items-center mb-2">
                <FileDown
                  size={18}
                  className="mr-2 text-success"
                />
                <span className="font-bold text-sm">
                  Compressed
                </span>
              </div>

              <div className="text-lg font-extrabold text-success">
                {formatSize(
                  Number(video.compressedSize)
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs opacity-70">
                Compression
              </p>

              <h3 className="text-2xl font-extrabold text-success drop-shadow-lg">
                {compressionPercentage}%
              </h3>
            </div>

            <button
              className="
                btn
                btn-primary
                rounded-2xl
                px-6
                shadow-[0_0_20px_rgba(99,102,241,0.5)]
                hover:shadow-[0_0_35px_rgba(99,102,241,0.9)]
                hover:scale-105
                transition-all
                duration-300
              "
              onClick={handleDownloadClick}
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;