import React from "react";

/** `tableFooter` — strip under a table inside the same card. `page` — standalone bar below the table card. */
export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  variant = "tableFooter",
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const stripInner = (
    <div className="grid grid-cols-3 items-center gap-3 min-h-[44px]">
      <div className="flex justify-start">
        <button
          type="button"
          disabled={safePage <= 1 || total === 0}
          onClick={() => onPageChange(safePage - 1)}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45 dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:bg-muted/50"
        >
          Previous
        </button>
      </div>
      <div className="flex justify-center">
        <span className="text-sm font-medium tabular-nums text-slate-600 dark:text-foreground/80">
          Page {safePage} of {totalPages}
        </span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={safePage >= totalPages || total === 0}
          onClick={() => onPageChange(safePage + 1)}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45 dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:bg-muted/50"
        >
          Next
        </button>
      </div>
    </div>
  );

  if (variant === "page") {
    return <div className="w-full pt-3">{stripInner}</div>;
  }

  return (
    <div className="w-full border-t border-border/50 pt-3 dark:border-border/60">
      {stripInner}
    </div>
  );
}

export const DEFAULT_TABLE_PAGE_SIZE = 10;
