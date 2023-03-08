import NavData from "@assets/data/navLink";
const Nav = () => {
  return (
    <div className="absolute top-[5%] left-[5%] ">
      <ul className="relative flex skew-x-[-5deg] skew-y-[0deg] flex-row-reverse text-white dark:text-black">
        {NavData.map((e, k) => {
          return (
            <li key={k} className="nav3d group">
              <a
                href={e.href}
                className="flex h-full w-full items-center justify-center"
              >
                {e.icon}
              </a>
              <p className="absolute top-full hidden p-1 font-bold group-hover:animate-slidein group-hover:sm:block">
                {e.title}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
// https://codepen.io/FelixRilling/pen/oNNLMb or this
export default Nav;
