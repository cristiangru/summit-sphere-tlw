import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <main className="relative min-h-screen bg-white pt-28 pb-20 overflow-x-hidden">
      
      <TracingBeam>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 antialiased relative">
          
          {/* 1. Imaginea Hero */}
          {article.image && (
            <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border border-zinc-100">
              <div className="relative aspect-[16/9]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            </div>
          )}

          {/* 2. Metadata & Titlu */}
          <header className="mb-12 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="inline-block bg-zinc-400 text-white rounded-full text-[10px] sm:text-xs font-medium px-3 py-1 uppercase tracking-widest">
                {article.author}
              </span>
              <time className="text-xs sm:text-sm text-zinc-500 border-l border-zinc-200 pl-3">
                {article.date}
              </time>
            </div>
            
            <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-center tracking-tight text-zinc-900 leading-tight">
              {article.title}
            </h1>
          </header>

          {/* 3. Conținutul Articolului cu JUSTIFY RE-ACTIVAT */}
          <article className="prose prose-zinc prose-lg max-w-none">
            <div className="space-y-6 text-base sm:text-lg text-zinc-800">
              {paragraphs.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="leading-relaxed text-justify [hyphens:auto] text-black"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

      
         {/* 4. Butonul Back */}
<div className="mt-20 pt-10 border-t border-zinc-100 bg-white relative z-20 flex justify-center sm:justify-start">
  <Link href="/blog" className="group block w-full sm:w-auto">
    <HoverBorderGradient
   
      // Am scos bg-black de aici pentru a nu mai avea acel bloc negru solid
      className="bg-white  text-black  flex items-center justify-center space-x-2 px-8 py-4 text-base shadow-sm"
    >
      <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
      <span>Înapoi la toate articolele</span>
    </HoverBorderGradient>
  </Link>
</div>
        </div>
      </TracingBeam>


    </main>
  );
}