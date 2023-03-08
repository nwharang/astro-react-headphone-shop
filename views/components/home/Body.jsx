import { trpc } from "@/utils/trpcClient.jsx";
import { FunnelIcon } from "@heroicons/react/24/solid/index.js";
import { useCallback, useRef } from "react";

const priceFomat = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const classNameCombine = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Body = () => {
  const {
    isFetchingNextPage,
    isLoading,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
  } = trpc.product.all.useInfiniteQuery(
    {},
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastpage, allpage) =>
        lastpage.hasNextPage ? lastpage.cursor + 1 : undefined,
    }
  );

  const intObserver = useRef();
  const lastPageRef = useCallback(
    (items) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();
      // https://github.com/gitdagray/react_infinite_scroll/blob/main/src/Example2.js
      intObserver.current = new IntersectionObserver((items) => {
        if (items[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (items) intObserver.current.observe(items);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Opps , Something might wrong
      </div>
    );
  return (
    <div className="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
      {/* Main Sidebar */}
      <div className="hidden flex-shrink-0 basis-60 overflow-auto border-r border-gray-400/20 p-6 dark:border-gray-300/10 sm:block"></div>
      {/* Main Container */}
      <div className="flex flex-grow flex-col">
        {/* Main header */}
        <div className="flex items-center justify-between border-b border-gray-400/20 dark:border-gray-300/10">
          <a className="py-4 px-3 text-current md:px-7" href="/">
            Home /
          </a>
          <FunnelIcon className="mr-3 h-7 w-7 sm:hidden" />
        </div>
        {/* Main content */}
        <div className="sm:text-md flex h-full flex-row flex-wrap gap-y-2 overflow-y-scroll scroll-smooth bg-white/40 py-5 px-5 text-sm leading-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black dark:bg-black/40 dark:scrollbar-thumb-white">
          {data.pages.map((page) =>
            page.items.map((e, k) => {
              return (
                <div
                  key={k}
                  className="basis-full p-2 text-right lg:basis-1/2"
                  ref={lastPageRef}
                >
                  <div className="my-2 flex w-full flex-col rounded-lg sm:flex-row">
                    <div className="relative aspect-square w-full flex-none sm:w-2/5">
                      <img
                        src={e.images[0].url}
                        alt={e.images[0].alt}
                        className="absolute z-0 aspect-square w-full rounded-lg object-cover shadow-lg shadow-slate-300 dark:shadow-slate-600"
                      />
                      <span className="absolute top-0 left-0 p-2 font-bold text-black">
                        {e.quantity_total > 0 ? "In Stock" : "Out Of Stock"}
                      </span>
                      {e.discount && (
                        <span className="absolute top-0 right-0 rounded-lg bg-sky-600 px-2 py-1 text-white">
                          {e.discount}%
                        </span>
                      )}
                    </div>
                    <div className="relative flex w-full flex-col p-2 pt-0 sm:pl-0">
                      <div className="flex h-full flex-col justify-between rounded-b-lg bg-gray-100 p-2 shadow-lg shadow-slate-300 dark:bg-gray-800 dark:shadow-slate-800 sm:rounded-l-none sm:rounded-r-lg">
                        <p className="pb-2 font-bold">{e.title}</p>
                        <p className="rounded-lg bg-gray-200 p-2 text-xl font-bold text-sky-600 dark:bg-gray-800">
                          {e.discount ? (
                            <span className="pl-2 text-gray-500 line-through opacity-60 dark:text-gray-400">
                              {priceFomat(e.list_price)}
                            </span>
                          ) : (
                            ""
                          )}{" "}
                          {priceFomat(e.price)}
                        </p>
                        <p className="pb-2">{e.brand}</p>
                        <div className="-mb-1 flex w-full divide-x divide-current border-t border-current text-center subpixel-antialiased">
                          <a
                            className="flex-1 rounded-br-lg px-2 py-1 hover:font-bold"
                            href={`/p/${e.id}`}
                          >
                            See Detail
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {isFetchingNextPage && (
            <div className="min-h-[20vh] flex-1"> Loading... </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Body;
