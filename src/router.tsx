import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // In production (GitHub Pages), Vite sets BASE_URL to /arcane-art-hub/
  // TanStack Router needs to know this to match routes correctly
  const basepath = import.meta.env.BASE_URL ?? "/";

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath,
  });

  return router;
};
