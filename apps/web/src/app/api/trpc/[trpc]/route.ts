import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@umbrasilva/api/routers/index";
import { NextRequest } from "next/server";

import { withEvlog } from "@/lib/evlog";

import { createContext } from "../../../../context";

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
}
export const GET = withEvlog(handler);
export const POST = withEvlog(handler);
