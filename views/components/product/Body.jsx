import { trpc } from "@/utils/trpcClient.jsx";
import { decode } from "html-entities";
import { createElement, useEffect, useRef, useState } from "react";
import Toasts from "../Toasts.jsx";
const renderHTML = (rawHTML) => {
  return createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });
};

const priceFomat = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const Body = ({ productId }) => {
  const [OptionValue, setOptionValue] = useState(null);
  const [VariantId, setVariantId] = useState(null);
  const [ToastMessage, setToastMessage] = useState({});
  const { isLoading, isError, data, isSuccess } =
    trpc.product.productId.useQuery(
      { id: productId },
      {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      }
    );
  const user = trpc.user.info.useQuery("", {
    queryKey: ["userInfo"],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const mutation = trpc.cart.add.useMutation();
  const imgRef = useRef(null);

  const handleChange = (e) => {
    imgRef.current.src = e.target.value;
  };

  const handleAddToCart = (e) => {
    // Add to cart route
    if (user.data.user) {
      setToastMessage({
        state: "Success",
        message: "Added to cart",
        id: ToastMessage.id + 1 || 0,
      });
      mutation.mutate({
        productId: data.id,
        variantId: VariantId,
        userId: user.data.user.id,
      });
    }
    if (!user.data.user)
      setToastMessage({
        state: "NotAuthenticated",
        message: "Please Sign in",
        id: ToastMessage.id + 1 || 0,
      });
  };

  useEffect(() => {
    if (isSuccess) {
      setOptionValue(data.variants[0].options);
      setVariantId(data.variants[0].id);
    }
  }, [isSuccess]);

  useEffect(() => {
    user.refetch();
  }, [mutation.isSuccess]);

  if (isLoading || user.isLoading)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  if (isError || user.isError)
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Opps , Something might wrong
      </div>
    );
  return (
    <div className="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
      {/* Main Container */}
      <div className="flex flex-grow flex-col">
        {/* Main header */}
        <div className="flex items-center justify-between border-b border-gray-400/20 dark:border-gray-300/10">
          <p className="py-4 px-3 text-gray-500 md:px-7">
            <a href="/">Home /</a>{" "}
            <span className="text-black dark:text-white">Product /</span>
          </p>
        </div>
        {/* Main content */}
        <div className="sm:text-md flex h-full flex-col gap-y-2 overflow-y-scroll scroll-smooth bg-white/40 py-5 px-5 text-sm leading-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black dark:bg-black/40 dark:scrollbar-thumb-white">
          <div className="flex flex-1 flex-col text-right sm:flex-row">
            {/* Product Image */}
            <div className="h-fit p-2 sm:max-w-md sm:basis-1/2">
              <div className="relative sm:min-h-[20rem] md:min-h-[26rem] lg:min-h-[32rem]">
                {data.images[0] && (
                  <img
                    ref={imgRef}
                    src={data.images[0].url}
                    alt={data.images[0].alt}
                    className="w-full rounded-lg object-contain shadow-lg shadow-black/50 dark:shadow-white/50"
                  />
                )}
                {data.discount ? (
                  <span className="absolute top-0 right-0 rounded-lg bg-red-500 px-2 py-1 text-white">
                    {data.discount}%
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-2 gap-y-5">
                {data.images.map((e, k) => {
                  return (
                    <label
                      key={"images" + k}
                      className="aspect-square h-fit flex-none basis-[calc(25%-0.4rem)] rounded-lg"
                    >
                      <input
                        type="radio"
                        name="img"
                        value={e.url}
                        className="peer sr-only"
                        onChange={handleChange}
                        defaultChecked={k === 0}
                      />
                      <div className="relative z-40 opacity-0 peer-checked:-translate-y-2 peer-checked:opacity-100">
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                        </span>
                      </div>
                      <img
                        src={e.url}
                        alt={e.alt}
                        className="h-full w-full rounded-lg object-cover shadow-lg shadow-black/30 peer-checked:-translate-y-2 dark:shadow-white/30"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            {/* Product Details */}
            <div className="flex-1 p-2">
              <h1 className="pb-2 text-lg font-bold">{data.title}</h1>
              <p className="rounded-lg bg-gray-200 p-2 text-xl font-bold text-sky-600 dark:bg-gray-800">
                {data.discount ? (
                  <span className="pl-2 text-gray-500 line-through opacity-60 dark:text-gray-400">
                    {priceFomat(data.list_price)}
                  </span>
                ) : (
                  ""
                )}
                {priceFomat(data.price)}
              </p>
              <div className="mt-3 w-full">
                <p className="text-lg font-bold">Options </p>
                <select
                  name=""
                  id=""
                  className="mt-1 rounded-3xl border border-black/20 bg-white/60 p-2 dark:border-white/20 dark:bg-black/60"
                  onChange={(e) => {
                    setVariantId(e.target.value);
                    setOptionValue(
                      data.variants.find((v) => v.id === e.target.value).options
                    );
                  }}
                >
                  {data.variants.map((e, k) => {
                    return (
                      <option key={"variant" + k} className="p-2" value={e.id}>
                        {e.sku}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mt-3 w-full">
                <p className="text-lg font-bold">SKU Details</p>
                <div className="flex flex-col rounded-lg bg-gray-200 p-3 dark:bg-gray-800">
                  {OptionValue && !OptionValue.includes("Title") ? (
                    OptionValue.split(",").map((e, k) => {
                      return k % 2 == 0 ? (
                        <div key={"options1" + k} className="font-bold">
                          {e}
                        </div>
                      ) : (
                        <div key={"options2" + k}>
                          <div>{e}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div>Default</div>
                  )}
                </div>
              </div>
              <div className="mt-3 w-full">
                <p className="text-lg font-bold">Brand</p>
                <div className="flex flex-col rounded-lg bg-gray-200 p-3 dark:bg-gray-800">
                  <p className="font-bold">{data.brand}</p>
                </div>
              </div>
              {/* Buy Section */}
              <div className="mt-3 flex w-full space-x-4 md:text-lg">
                <div className="flex flex-auto space-x-2 sm:space-x-4">
                  <button
                    className="h-10 flex-1 rounded-md bg-black px-3 font-semibold text-white dark:bg-white dark:text-black md:px-6"
                    type="submit"
                  >
                    Buy now
                  </button>
                  <button
                    className="h-10 flex-1 whitespace-nowrap rounded-md border border-slate-800 px-3 font-semibold text-current dark:border-slate-200 md:px-6"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Spec - Description*/}

          <div className="relative mt-4 rounded-xl border border-black/20 bg-white/60 p-3 indent-4 leading-8 dark:border-white/20 dark:bg-black/60 sm:p-4">
            <h1 className="absolute bottom-[calc(100%-0.75rem)] text-xl font-bold">
              Specifications
            </h1>
            {renderHTML(decode(data.description, { level: "html5" }))}
          </div>
        </div>
      </div>
      <Toasts toastMessage={ToastMessage} />
    </div>
  );
};
export default Body;

// Data Sample
// "data": {
//   "id": "63c1b096cc41579fdb30641d",
//   "title": "Sony MDR-ZX110AP Extra Bass On Ear Headphones with Mic",
//   "description": "&lt;h3 class=&quot;a-spacing-mini&quot;&gt;Extra Bass Smartphone Headset with Mic&lt;/h3&gt;\n&lt;h4 class=&quot;a-spacing-mini a-color-secondary a-text-italic&quot;&gt;Smartphone connectivity, impressive bass&lt;/h4&gt;\n&lt;p class=&quot;a-spacing-base&quot;&gt;Form meets function with smartphone control for life on the go. More than your basic pair of over-the-head headphones, the Sony MDR-ZX110AP headset delivers rock-solid audio performance, integrated microphone for hands-free calling, and media playback controls for convenient operation.&lt;/p&gt;",
//   "price": 21,
//   "list_price": 24,
//   "discount": 15,
//   "type": "Headphones",
//   "quantity_total": 4,
//   "brand": "Sony",
//   "createdAt": "2023-01-13T19:27:18.445Z",
//   "updatedAt": "2023-01-13T19:27:18.445Z",
//   "images": [
//     {
//       "id": "63c1b0a2cc41579fdb306ad7",
//       "productId": "63c1b096cc41579fdb30641d",
//       "url": "https://res.cloudinary.com/dapxj4quf/assets/mdrzx110ap_large.jpg",
//       "alt": ""
//     },
//     {
//       "id": "63c1b0a2cc41579fdb306ad9",
//       "productId": "63c1b096cc41579fdb30641d",
//       "url": "https://res.cloudinary.com/dapxj4quf/assets/mdrzx110-folded_large.jpg",
//       "alt": ""
//     }
//   ],
//   "variants": [
//     {
//       "id": "63c1b09ccc41579fdb306681",
//       "productId": "63c1b096cc41579fdb30641d",
//       "quantity": 4,
//       "sku": "mdrzx110ap",
//       "barcode": "027242879416",
//       "options": "Title,Default Title"
//     }
//   ]
// }
