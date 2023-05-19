import { MoonIcon, SunIcon } from "@heroicons/react/24/solid/index.js";
import { useEffect, useState } from "react";

const ThemeChanger = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");
  const [mount, setMount] = useState(false);
  const handleClick = () => {
    // https://stackoverflow.com/questions/7391567/when-using-settimeout-do-you-have-to-cleartimeout
    // Without setTimeout , clicking bug while transitioning
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
    }, 100);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    setMount(true);
  }, []);

  return theme === "light" && mount ? (
    <MoonIcon
      className="w-10 cursor-pointer rounded-full bg-black p-1 text-yellow-500"
      onClick={handleClick}
    />
  ) : (
    <SunIcon
      className="w-10 cursor-pointer rounded-full bg-white p-1 text-yellow-500"
      onClick={handleClick}
    />
  );
};

const Header = () => {
  return (
    <>
      <div className="fixed inset-0 -z-50 flex items-end bg-gray-200 dark:bg-gray-800"></div>
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <header className="">
        <nav className="z-50 flex">
          <div className="fixed bottom-[5%] right-[5%] z-50">
            <ThemeChanger />
          </div>
        </nav>
      </header>
      <div
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:bottom-0"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </>
  );
};
export default Header;
