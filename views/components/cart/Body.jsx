import { trpc } from "@/utils/trpcClient.jsx";

const priceFomat = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const Body = () => {
  const { isLoading, isError, data, isSuccess } = trpc.cart.get.useQuery("", {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  if (isError || data.error)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        {data.code == 401
          ? "You are not login yet"
          : "Opps , Something might wrong"}
      </div>
    );
  return (
    isSuccess && (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
        {/* Main Container */}
        <div className="flex basis-1/2 flex-col">
          {/* Main header */}
          <div className="flex items-center border-b border-gray-400/20 dark:border-gray-300/10">
            <a className="py-4 pl-3 text-current md:pl-7" href="/">
              Home /
            </a>
            <p className="py-4 pl-3 text-gray-400">Cart</p>
          </div>
          {/* Main content */}
          <div className="sm:text-md flex h-full flex-row flex-wrap items-start gap-y-2 overflow-y-scroll scroll-smooth bg-white/40 py-5 px-5 text-sm leading-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black dark:bg-black/40 dark:scrollbar-thumb-white">
            {data?.map((product) =>
              product.variants.map((variant, k) => (
                <div
                  key={variant.id + k}
                  className="h-fit basis-full p-2 text-right"
                >
                  <div className="my-2 flex w-full flex-col rounded-lg sm:flex-row">
                    <div className="relative aspect-square w-full flex-none sm:w-2/5">
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="absolute z-0 aspect-square w-full rounded-lg object-cover shadow-lg shadow-slate-300 dark:shadow-slate-600"
                      />
                    </div>
                    <div className="relative flex w-full flex-col p-2 pt-0 sm:pl-0">
                      <div className="flex h-full flex-col rounded-b-lg bg-gray-100 p-2 shadow-lg shadow-slate-300 dark:bg-gray-800 dark:shadow-slate-800 sm:rounded-l-none sm:rounded-r-lg">
                        <div className="flex flex-1 flex-col">
                          <p className="pb-2 font-bold">{product.title}</p>
                          <p className="rounded-lg bg-gray-200 p-2 text-xl font-bold text-sky-600 dark:bg-gray-800">
                            {product.discount ? (
                              <span className="pl-2 text-gray-500 line-through opacity-60 dark:text-gray-400">
                                {priceFomat(product.list_price)}
                              </span>
                            ) : (
                              ""
                            )}{" "}
                            {priceFomat(product.price)}
                          </p>
                          <p className="pb-2">{product.brand}</p>
                        </div>
                        <div className="-mb-1 flex w-full divide-x divide-current border-t border-current text-center subpixel-antialiased">
                          <p className="flex-1 rounded-br-lg px-2 py-1 hover:font-bold">
                            {variant.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Info Content */}
        <div className="flex basis-1/2 flex-col">
          {/* Info header */}
          <div className="flex items-center border-b border-l border-gray-400/20 dark:border-gray-300/10">
            <p className="py-4 pl-3 text-current md:pl-7">Contact Info</p>
          </div>
          {/* Info content */}
          <div className="sm:text-md flex h-full flex-row flex-wrap items-start gap-y-2 overflow-y-scroll scroll-smooth bg-white/40 py-5 px-5 text-sm leading-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black dark:bg-black/40 dark:scrollbar-thumb-white">
            <form>
              <h3>Your Contact</h3>
              <div>
                <label htmlFor="">Email address</label>
                <input type="text" />
              </div>
              <h3>Shipping infomation</h3>
            </form>
          </div>
        </div>
      </div>
    )
  );
};
export default Body;
