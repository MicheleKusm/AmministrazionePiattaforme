type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const PAGE_BTN = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white";

export function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
    return (
        <div className="flex items-center gap-2">
            <button type="button" className={PAGE_BTN} disabled={currentPage <= 0} onClick={onPrev}>‹</button>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-primary-600 px-2 text-sm font-semibold text-primary-700">
                {currentPage + 1}
            </span>
            <button type="button" className={PAGE_BTN} disabled={currentPage + 1 >= totalPages} onClick={onNext}>›</button>
        </div>
    );
}
