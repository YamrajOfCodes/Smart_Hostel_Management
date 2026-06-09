import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";


function getPagesArray(currentPage, totalPages, siblingCount = 1) {
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalPageNumbers = siblingCount * 2 + 5; 

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), "...", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, "...", ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  return [1, "...", ...range(leftSiblingIndex, rightSiblingIndex), "...", totalPages];
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }) {
  if (totalPages <= 1) return null;

  const pages = getPagesArray(currentPage, totalPages, siblingCount);

  const btnBase =
    "flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer select-none";
  const pageBtn = `${btnBase} w-8 h-8`;
  const navBtn = `${btnBase} w-8 h-8 border`;

  return (
    <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#EAE8E3]">
      {/* Left: jump to first + prev */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First page"
          className={`${navBtn} ${
            currentPage === 1
              ? "text-[#C4BFBA] border-[#EAE8E3] cursor-not-allowed bg-transparent"
              : "text-[#6B6560] border-[#DDD9D4] hover:border-[#C8A96E] hover:text-[#C8A96E] bg-white"
          }`}
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
          className={`${navBtn} ${
            currentPage === 1
              ? "text-[#C4BFBA] border-[#EAE8E3] cursor-not-allowed bg-transparent"
              : "text-[#6B6560] border-[#DDD9D4] hover:border-[#C8A96E] hover:text-[#C8A96E] bg-white"
          }`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Centre: page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-sm text-[#A09890]"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${pageBtn} ${
                page === currentPage
                  ? "bg-[#1A1714] text-white shadow-sm"
                  : "text-[#6B6560] hover:bg-[#F0EDE8] hover:text-[#1A1714]"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Right: next + jump to last */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
          className={`${navBtn} ${
            currentPage === totalPages
              ? "text-[#C4BFBA] border-[#EAE8E3] cursor-not-allowed bg-transparent"
              : "text-[#6B6560] border-[#DDD9D4] hover:border-[#C8A96E] hover:text-[#C8A96E] bg-white"
          }`}
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last page"
          className={`${navBtn} ${
            currentPage === totalPages
              ? "text-[#C4BFBA] border-[#EAE8E3] cursor-not-allowed bg-transparent"
              : "text-[#6B6560] border-[#DDD9D4] hover:border-[#C8A96E] hover:text-[#C8A96E] bg-white"
          }`}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}