import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { currentUser } from "@clerk/nextjs/server";

export const authenticatedActionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next, clientInput, metadata }) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  return next({ ctx: { user } });
});
