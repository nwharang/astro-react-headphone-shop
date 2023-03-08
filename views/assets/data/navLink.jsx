import {
  HomeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid/index.js";

const navLink = [
  { href: "/", title: "Home", icon: <HomeIcon className="h-8 w-8" /> },
  {
    href: "/about",
    title: "About",
    icon: <InformationCircleIcon className="h-8 w-8" />,
  },
].reverse();

export default navLink;
