"use client";

import Link from "next/link";
import Image from "next/image";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { getAllArticles } from "@/lib/articles";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function BlogPage() {
  const cards = getAllArticles();

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header - Am marit marginea de jos (mb-20) */}
      <div className="mb-20 px-4 pt-12 max-w-7xl mx-auto">
        <p className="mt-4 text-lg text-zinc-600 max-w-2xl">
          Descoperă ultimele noutăți și informații din domeniul medical
        </p>
      </div>

      {/* Grid carduri - gap-y-24 adauga spatiul mare intre randuri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-24 px-4 max-w-7xl mx-auto pb-20">
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
              <div className="h-[500px] flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 ">
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
                  <p className="text-sm font-normal text-zinc-500 line-clamp-3 min-h-[4.5rem] flex-grow mt-5 text-justify">
                    {blogContent.description}
                  </p>
                </div>

                {/* Footer - FIXED cu noul buton */}
                <div className="h-16 flex items-center justify-between border-t border-zinc-100 px-4 py-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{blogContent.date}</span>
                  
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