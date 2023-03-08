import useDebounce from "@/utils/useDebounce";
import {
  CheckIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid/index.js";
import { useEffect, useState } from "react";

const DynamicIcon = () => {
  return {
    Success: <CheckIcon />,
    Error: <ExclamationCircleIcon />,
    Warning: <ExclamationCircleIcon />,
    NotAuthenticated: <LockClosedIcon />,
  };
};

const Toasts = ({ toastMessage, opt = { autohide: true, timeout: 5000 } }) => {
  const { autohide, timeout } = opt;
  const toastDefaultsMessage = "Missing Toast Message";
  const [Toast, setToast] = useState([]);
  const DebounceCleanToast = useDebounce(Toast, timeout);
  const seftHide = (id) => {
    let data = document.querySelector(`#toastMessage${id}`);
    if (data) data.remove();
  };

  useEffect(() => {
    if (toastMessage.message && autohide) {
      setToast([
        ...Toast,
        {
          ...toastMessage,
          seftDetructor: setTimeout(() => {
            seftHide(toastMessage.id);
          }, timeout),
        },
      ]);
    }
    if (toastMessage.message && !autohide) {
      setToast([...Toast], toastMessage);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (Toast.length > 0) setToast([]);
  }, [DebounceCleanToast]);

  return (
    Toast.length > 0 && (
      <div class="fixed bottom-5 left-5 z-50  flex w-full max-w-xs flex-col ">
        {Toast.map((e, k) => {
          return (
            <div
              id={"toastMessage" + e.id}
              key={"toasted" + k}
              className="mb-4 flex animate-slidein items-center rounded-lg bg-white p-4 shadow dark:bg-gray-800"
            >
              <div class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <CheckIcon className="h-5 w-5" />
                <span class="sr-only">Check icon</span>
              </div>
              <div class="ml-3 font-normal">
                {e.message || toastDefaultsMessage}
              </div>
              <button
                type="button"
                class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 focus:ring-2 focus:ring-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => {
                  seftHide(e.id);
                }}
              >
                <span class="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>
    )
  );
};

export default Toasts;
