import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[40rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div className="font-sans font-bold text-xl text-neutral-800 dark:text-neutral-100">
          {title}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg flex-1 mb-4">
        {header}
      </div>

      <div className="space-y-2">
        <div className="font-sans text-sm font-medium text-neutral-700 dark:text-neutral-200 italic leading-relaxed line-clamp-6">
          {description}
        </div>
      </div>
    </div>
  );
};