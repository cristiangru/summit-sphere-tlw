"use client";

import Link from "next/link";
import Image from "next/image";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function FollowingPointerDemo() {
  const cards = [
    {
      slug: "amazing-tailwindcss-grid-layouts",
      author: "Manu Arora",
      date: "28th March, 2023",
      title: "Amazing Tailwindcss Grid Layout Examples",
      description:
        "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcs grid and React.",
      image: "/demo/thumbnail.png",
      authorAvatar: "/manu.png",
    },
    {
      slug: "react-hooks-guide",
      author: "John Doe",
      date: "15th April, 2023",
      title: "Complete React Hooks Guide",
      description:
        "Master React hooks with this comprehensive guide. Learn useState, useEffect, useContext and more.",
      image: "/demo/thumbnail2.png",
      authorAvatar: "/john.png",
    },
    {
      slug: "nextjs-performance",
      author: "Jane Smith",
      date: "5th May, 2023",
      title: "Optimize Your Next.js App Performance",
      description:
        "Discover techniques to improve your Next.js application performance and user experience.",
      image: "/demo/thumbnail3.png",
      authorAvatar: "/jane.png",
    },
  ];

  return (
    <div className="w-full">
      {/* Header cu buton */}
      <div className="flex items-center justify-between mb-12 px-4">
        <h2 className="text-3xl font-bold text-zinc-900">Articole Recent</h2>
        <Link
          href="/blog"
          className="rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Mai multe articole
        </Link>
      </div>

      {/* Grid carduri - DIMENSIUNI FIXE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
        {cards.map((blogContent) => (
          <Link
            key={blogContent.slug}
            href={`/blog/${blogContent.slug}`}
            className="group"
          >
            <FollowerPointerCard
              title={
                <TitleComponent
                  title={blogContent.author}
                  avatar={blogContent.authorAvatar}
                />
              }
            >
              <div className="h-[500px] flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
                {/* Image - FIXED */}
                <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-gray-100">
                  <Image
                    src={blogContent.image}
                    alt={blogContent.title}
                    fill
                    className="object-cover transition duration-200 group-hover:scale-95"
                  />
                </div>

                {/* Content - FIXED HEIGHT */}
                <div className="flex flex-col flex-grow p-4">
                  <h2 className="h-14 text-lg font-bold text-zinc-700 line-clamp-2">
                    {blogContent.title}
                  </h2>
                  <p className="h-10 text-sm font-normal text-zinc-500 line-clamp-2">
                    {blogContent.description}
                  </p>
                </div>

                {/* Footer - FIXED */}
                <div className="h-16 flex items-center justify-between border-t border-zinc-100 px-4 py-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{blogContent.date}</span>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="rounded-lg bg-black px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </FollowerPointerCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2">
    <Image
      src={avatar}
      height={20}
      width={20}
      alt={title}
      className="rounded-full border-2 border-white"
    />
    <p className="text-sm font-medium">{title}</p>
  </div>
);