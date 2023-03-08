import { trpc } from "@/utils/trpcClient.jsx";
import useDebounce from "@/utils/useDebounce.jsx";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid/index.js";
import { useEffect, useState } from "react";
const items = [
  { href: "/", current: true, name: "Home" },
  { href: "/about", current: false, name: "About" },
];

const classNameCombine = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const UserStatus = () => {
  const [LoginPanel, setLoginPanel] = useState(false);
  const [CartPanel, setCartPanel] = useState(false);
  const { isLoading, isError, data, error } = trpc.user.info.useQuery("", {
    queryKey: ["userInfo"],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="ml-auto flex animate-pulse items-center gap-4 pr-2 pl-4">
        Loading...
      </div>
    );
  return (
    <div className="relative ml-auto flex items-center gap-4 pr-2 pl-4">
      {/* Notification */}
      {data?.user && (
        <div className="relative">
          <div
            onClick={() => {
              setCartPanel(!CartPanel);
            }}
          >
            {data.user.cartItem.length > 0 && (
              <span
                id="notification-number"
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-xs text-white"
              >
                {/* https://stackoverflow.com/a/6300596/19764071 */}
                {data.user.cartItem.reduce((acc, obj) => {
                  return acc + obj.quantity;
                }, 0)}
              </span>
            )}
            <ShoppingCartIcon className="h-7 w-7" />
          </div>
          {CartPanel && (
            <div className="absolute top-[calc(100%+0.5rem)] right-0 z-40 w-56 bg-gray-300 p-3 dark:bg-slate-500 md:w-72 md:p-4">
              <p className="">
                You have
                <span className="font-black">
                  {" "}
                  {data.user.cartItem.length}{" "}
                </span>
                items in your cart , click here to check it out
              </p>
              <div className="my-3 w-full">
                <a
                  href="/cart"
                  className=" border-2 border-sky-500 p-2 text-sky-500 hover:bg-sky-500 hover:text-current"
                >
                  View Cart
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      {/* User Icon */}
      {data?.user && data.user.image ? (
        <img
          src={data.user.image}
          className="h-7 w-7 rounded-full border border-black dark:border-white "
          onClick={() => setLoginPanel(!LoginPanel)}
        />
      ) : (
        <UserCircleIcon
          className="h-7 w-7"
          onClick={() => setLoginPanel(!LoginPanel)}
        />
      )}
      {data?.user && LoginPanel && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 flex min-w-[12.5rem] flex-col rounded-lg border border-black/25 bg-white/80 dark:border-white/25 dark:bg-black/80">
          <ul className="flex flex-1 flex-col divide-y text-right">
            <a href="/user" className="p-2">
              <li>Account</li>
            </a>
            <form method="POST" action="/logout">
              <button className="p-2" type="submit" value="Logout">
                Logout
              </button>
            </form>
          </ul>
        </div>
      )}
      {!data?.user && LoginPanel && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 flex min-w-[12.5rem] flex-col rounded-lg border border-black/25 bg-white/80 dark:border-white/25 dark:bg-black/80">
          <ul className="flex flex-1 flex-col divide-y text-right">
            <a href="/login" className="p-2">
              <li>Sign In</li>
            </a>
            <a href="/register" className="p-2">
              <li>Register</li>
            </a>
          </ul>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { isLoading, isError, data, error } =
    trpc.product.productSearch.useQuery(
      {},
      {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );
  const [SearchFocus, setSearchFocus] = useState(false);
  const [MobileButton, setMobileButton] = useState(false);
  const [SearchTerm, setSearchTerm] = useState("");
  const [SearchData, setSearchData] = useState("");
  //https://stackoverflow.com/questions/42361485/how-long-should-you-debounce-text-input
  const debouncedSearchTerm = useDebounce(SearchTerm, 300);

  const handlerMenuClickMobile = () => {
    setTimeout(() => {
      setMobileButton(!MobileButton);
    }, 100);
  };
  // Had to separate blur and focus because of tab change can cause problems
  const handlerFocusSearch = () => {
    setSearchFocus(true);
  };

  const handlerSearchBlur = (e) => {
    // set timeout for click link in search bar - time out is based on Client capacity , from 150ms to 500ms
    setTimeout(() => {
      setSearchFocus(false);
    }, 200);
  };
  useEffect(() => {
    setSearchData(
      data?.filter((v) =>
        v.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [debouncedSearchTerm]);

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
    <div className="flex h-14 w-full flex-shrink-0 items-center justify-center border-b border-gray-400/20 px-4 dark:border-gray-300/10">
      {/* Routes */}
      {!SearchFocus && (
        <div className="hidden items-center sm:flex">
          {items.map((e, k) => (
            <a
              key={"Routes" + k}
              className={classNameCombine(
                e.current
                  ? "border-current text-current"
                  : "border-transparent text-gray-500",
                "border-b-2 py-4 px-3  focus:border-current focus:text-current hover:border-current hover:text-current md:px-7"
              )}
              href={e.href}
            >
              {e.name}
            </a>
          ))}
        </div>
      )}
      {!SearchFocus && (
        <div className="pr-4 sm:hidden">
          <Bars3Icon className="h-7 w-7" onClick={handlerMenuClickMobile} />
        </div>
      )}
      {/* Search Bars */}
      <div className="relative flex h-10 w-full max-w-md rounded-md">
        <MagnifyingGlassIcon className="absolute top-1 left-1 h-8 w-8 text-gray-500" />
        <input
          type="text"
          name=""
          placeholder="Search"
          id=""
          onFocus={handlerFocusSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handlerSearchBlur}
          className="text-dark peer h-full w-full rounded-md border border-black/5 bg-white/30
        pl-10 pr-1 shadow-lg focus-visible:outline-none dark:bg-slate-700 dark:text-white dark:shadow-black/70 "
        />
        {SearchData && SearchFocus && (
          <div
            className="absolute top-[calc(100%+0.2rem)] left-0 z-30 flex max-h-[50vh] w-full flex-col divide-y divide-black/20 
          overflow-y-auto scroll-smooth whitespace-nowrap rounded-b-2xl bg-white py-2 shadow-lg shadow-black/60
          overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black dark:divide-white/20 dark:bg-gray-900 dark:shadow-white/40 dark:scrollbar-thumb-white"
          >
            {SearchData.length > 0 ? (
              SearchData.map((e, k) => {
                return (
                  <a
                    key={"SearchData" + k}
                    className="w-full p-3"
                    href={`/p/${e.id}`}
                  >
                    {e.title}
                  </a>
                );
              })
            ) : (
              <p className="py-2 px-4 text-right italic">No item found</p>
            )}
          </div>
        )}
      </div>
      {/* Right Panel */}
      {!SearchFocus && <UserStatus />}
      {MobileButton && (
        // Menu Mobile Go Here
        <div>
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handlerMenuClickMobile}
          ></div>
          <div className="container-sm absolute top-0 left-0 z-50 h-full w-full animate-slidein bg-white/90 dark:bg-black/90">
            <div className="flex flex-row justify-between">
              <p className="flex-1 p-2 text-center text-xl">Menu</p>
              <XMarkIcon className="h-8 w-8" onClick={handlerMenuClickMobile} />
            </div>
            <div className="w-100 flex flex-col">
              {items.map((e, k) => (
                <a
                  key={"items" + k}
                  className={classNameCombine(
                    e.current
                      ? "translate-x-2 text-lg text-current"
                      : "text-gray-500 focus:translate-x-2 focus:text-current hover:translate-x-2 hover:text-current",
                    "border-b-2 py-4  px-7 "
                  )}
                  href={e.href}
                >
                  {e.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
