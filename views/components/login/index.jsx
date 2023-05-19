import config from "@/utils/config.jsx";
import { trpc } from "@/utils/trpcClient.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import React, { useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "../Header.jsx";
import Body from "./Body.jsx";
const Home = ({ recaptchaKey }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${config.host}/trpc`,
        }),
      ],
    })
  );
  return (
    <React.StrictMode>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Header />
            <Body />
          </QueryClientProvider>
        </trpc.Provider>
      </GoogleReCaptchaProvider>
    </React.StrictMode>
  );
};

export default Home;
