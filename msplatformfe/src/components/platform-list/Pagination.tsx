type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

export function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
    return (
        <footer className="pager">
            <button disabled={currentPage <= 0} onClick={onPrev} type="button">
                Indietro
            </button>
            <span>
                Pagina {currentPage + 1} / {Math.max(totalPages, 1)}
            </span>
            <button disabled={currentPage + 1 >= totalPages} onClick={onNext} type="button">
                Avanti
            </button>
        </footer>
    );
}
