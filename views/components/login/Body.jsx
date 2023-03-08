import { trpc } from "@/utils/trpcClient.jsx";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
const Body = () => {
  const { isLoading, isError, data, error } = trpc.user.info.useQuery("", {
    queryKey: ["userInfo"],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(false);
  const form = useRef(null);
  const handleLogin = (gReCaptchaToken) => {
    axios
      .post("/login", {
        email: form.current.email.value,
        password: form.current.password.value,
        gReCaptchaToken: gReCaptchaToken,
      })
      .then((res) => setSuccess(true))
      .catch((error) => setError(error.response.data));
  };

  const handleReCaptchaVerify = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!executeRecaptcha) {
        return;
      }
      executeRecaptcha("SubmitRegistration").then((gReCaptchaToken) => {
        handleLogin(gReCaptchaToken);
      });
    },
    [executeRecaptcha]
  );
  useEffect(() => {
    if (Success || data?.user) {
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
    }
  }, [Success, data?.user]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100%-3.5rem)] flex-1 items-center justify-center overflow-hidden">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex h-[calc(100%-3.5rem)] flex-1 overflow-hidden">
      <div className="container flex h-full flex-1 flex-col items-center justify-center bg-white/60 dark:bg-black/60">
        {!Success && !data.user ? (
          <form
            method="POST"
            action="/login"
            onSubmit={handleReCaptchaVerify}
            className="flex w-full max-w-xs flex-col gap-3 p-2 sm:max-w-sm sm:p-0"
            ref={form}
          >
            {Error && (
              <div className="rounded-lg border border-current text-red-500">
                <p className="p-2">{Error}</p>
              </div>
            )}
            <label htmlFor="username" className="font-bold">
              Email
            </label>
            <input
              placeholder="Email Address"
              type="email"
              name="email"
              id="email"
              className="rounded-lg border border-black/10 bg-white/30 py-2 px-4 shadow-lg outline-slate-200 focus:outline-none dark:bg-slate-700 dark:shadow-black/70 dark:outline-slate-500"
            />
            <label htmlFor="password" className="mt-2 font-bold">
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              className="rounded-lg border border-black/10 bg-white/30 py-2 px-4 shadow-lg outline-slate-200 focus:outline-none dark:bg-slate-700 dark:shadow-black/70 dark:outline-slate-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 flex-1 rounded-2xl bg-black font-bold text-white dark:bg-white dark:text-black"
                disabled={data.user ? true : false || Success}
              >
                Log In
              </button>
              <button
                type="reset"
                className="h-10 flex-1 rounded-2xl border border-current font-bold"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-col">
              <p>Or login with</p>
              <a
                href="/login/google"
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-current font-bold"
              >
                {/* Google Icon */}
                <img
                  src="/static/Google_Logo.webp"
                  alt="Google_Logo"
                  className="h-8 w-8 p-2"
                />
                <p className="">Sign in with Google</p>
              </a>
            </div>
          </form>
        ) : (
          <div className="flex w-full max-w-xs flex-col gap-3 p-2 sm:max-w-sm sm:p-0">
            <p>You have successfully sign in</p>
            <p>Will redirect in 3 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Body;
