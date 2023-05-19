import config from "@/utils/config.jsx";
import { trpc } from "@/utils/trpcClient.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import React, { useState } from "react";
import Header from "../Header.jsx";
import Body from "./Body.jsx";
const Product = ({ productId }) => {
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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Body productId={productId} />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>
  );
};

export default Product;
