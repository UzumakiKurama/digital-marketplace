import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    auth : authRouter,
    signUpRoute : publicProcedure.query(() => "hello")
})

export type TAppRouter = typeof appRouter;