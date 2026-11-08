import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useActiveCategories } from '../hooks/useCategories';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Băng chuyền danh mục: ô giới thiệu bên trái + các thẻ danh mục cuộn ngang,
 * có nút mũi tên trái/phải hai bên.
 */
export const CategoryCarousel: React.FC = () => {
    const { data, isLoading, isError, refetch } = useActiveCategories();
    const categories = data?.data?.content || [];

    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, [updateArrows, categories.length, isLoading]);

    const scrollByPage = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
    };

    if (isError) return <ErrorState onRetry={() => refetch()} />;
    if (!isLoading && categories.length === 0) return null;

    const arrowClass =
        'absolute top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full ' +
        'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 transition-colors';

    return (
        <section aria-label="Danh mục sản phẩm" className="relative">
            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {/* Ô giới thiệu bên trái */}
                <div className="snap-start shrink-0 w-48 sm:w-64 rounded-2xl p-5 flex flex-col justify-between text-white bg-gradient-to-br bg-[#006600]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-100">Danh mục</p>
                        <h2 className="mt-2 text-xl sm:text-2xl font-extrabold leading-tight">
                            Chọn nhanh nông sản tươi
                        </h2>
                        <p className="mt-2 text-sm text-primary-50">Rau, củ, quả sạch theo từng nhóm.</p>
                    </div>
                    <Link
                        to="/categories"
                        className="mt-6 inline-flex w-fit items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50 transition-colors"
                    >
                        Xem tất cả
                    </Link>
                </div>

                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-40 sm:w-52 rounded-2xl border border-gray-200 bg-white p-3 space-y-3"
                        >
                            <Skeleton className="aspect-square w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>
                    ))
                    : categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?categoryId=${cat.id}`}
                            className="group snap-start shrink-0 w-40 sm:w-52 flex flex-col rounded-2xl border border-gray-200 bg-white p-3 hover:border-primary-500 transition-colors"
                        >
                            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                                <ImageWithFallback
                                    src={cat.image}
                                    alt={cat.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="mt-3 min-h-[2.75rem]">
                                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 line-clamp-2">
                                    {cat.name}
                                </h3>
                                {cat.parentCategoryName && (
                                    <p className="mt-0.5 text-[11px] text-gray-400 line-clamp-1">{cat.parentCategoryName}</p>
                                )}
                            </div>
                            <span className="mt-2 inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white group-hover:bg-primary-700 transition-colors">
                                Xem sản phẩm
                            </span>
                        </Link>
                    ))}
            </div>

            <button
                type="button"
                aria-label="Danh mục trước"
                onClick={() => scrollByPage(-1)}
                className={clsx(arrowClass, 'left-2', !canPrev && 'sm:hidden')}
            >
                <ChevronLeft size={20} />
            </button>
            <button
                type="button"
                aria-label="Danh mục sau"
                onClick={() => scrollByPage(1)}
                className={clsx(arrowClass, 'right-2', !canNext && 'sm:hidden')}
            >
                <ChevronRight size={20} />
            </button>
        </section>
    );
};

export default CategoryCarousel;