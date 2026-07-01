"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types";
import Lightbox from "./Lightbox";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            aria-label={`Open image: ${img.alt}`}
            className="group relative aspect-[3/2] overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              placeholder="blur"
              blurDataURL={img.blurDataURL}
              unoptimized
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          </button>
        ))}
      </div>

      {open && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setOpen(false)}
          onIndexChange={setIndex}
        />
      )}
    </>
  );
}
