"use client";

import Link from "next/link";
import Image from "next/image";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { getLatestArticles } from "@/lib/articles";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";

export default function RecentArticles() {
  const cards = getLatestArticles(3);

  return (
    <div className="w-full">
      {/* Header cu buton (Rămâne neschimbat dacă vrei buton și sus) */}
   <div className="flex items-center justify-end mb-10 px-4">
        <Link href="/blog">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="div"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-4 py-2"
          >
            <span>Toate articolele</span>
            <ArrowRight className="h-4 w-4" />
          </HoverBorderGradient>
        </Link>
      </div>

      {/* Grid carduri */}
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
              <div className="h-[500px] flex flex-col overflow-hidden mb-8 rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
                {/* Imagine */}
                <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-gray-100">
                  <Image
                    src={blogContent.image}
                    alt={blogContent.title}
                    fill
                    className="object-cover transition duration-200 group-hover:scale-95"
                  />
                </div>

                {/* Conținut */}
                <div className="flex flex-col flex-grow p-4">
                  <h2 className="h-14 text-lg font-bold text-zinc-700 line-clamp-2">
                    {blogContent.title}
                  </h2>
                  <p className="text-sm font-normal text-zinc-500 line-clamp-3 min-h-[4.5rem] flex-grow mt-5 text-justify">
                    {blogContent.description}
                  </p>
                </div>

                {/* Footer cu butonul NOU */}
                <div className="h-16 flex items-center justify-between border-t border-zinc-100 px-4 py-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{blogContent.date}</span>
                  
                  {/* Butonul HoverBorderGradient integrat în loc de cel negru simplu */}
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="div"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-3 py-1.5"
                  >
                    <span className="text-xs font-semibold">Citește articolul</span>
               
                  </HoverBorderGradient>
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