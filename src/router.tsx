import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Vite sets BASE_URL to "/arcane-art-hub/" (with trailing slash) in production.
  // TanStack Router requires basepath WITHOUT trailing slash → "/arcane-art-hub"
  const basepath = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/";

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath,
  });

  return router;
};
