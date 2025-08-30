import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import { AuthProvider } from "./contexts/AuthContext.tsx";
// 1. Import QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// 2. Create a client instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {/* 3. Wrap your app with the provider */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>
);