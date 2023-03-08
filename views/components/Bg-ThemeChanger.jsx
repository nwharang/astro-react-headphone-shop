import heroBackgound from "@assets/images/hero.webp";
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

  return (
    <>
      {theme === "light" && mount ? (
        <MoonIcon
          className="w-10 cursor-pointer rounded-full bg-black p-1 text-yellow-500"
          onClick={handleClick}
        />
      ) : (
        <SunIcon
          className="w-10 cursor-pointer rounded-full bg-white p-1 text-yellow-500"
          onClick={handleClick}
        />
      )}
    </>
  );
};

const Header = () => {
  return (
    <>
      <div className="fixed inset-0 -z-50 flex items-end bg-gray-200 dark:bg-gray-800">
        <img
          src={heroBackgound}
          alt=""
          className="max-h-[30vh] object-contain object-bottom lg:max-h-[60vh]"
        />
      </div>
      <header className="">
        <nav className="z-50 flex">
          <div className="fixed bottom-[5%] right-[5%] z-50">
            <ThemeChanger />
          </div>
        </nav>
      </header>
    </>
  );
};
export default Header;
