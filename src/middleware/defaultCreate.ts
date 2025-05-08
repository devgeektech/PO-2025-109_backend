import { createAdmin } from "../services/auth/controller"
import { setupSite } from "../services/site/controller";

export const defaultCreateMiddlewares=async ()=>{
    try {
        await createAdmin();
        await setupSite();
    } catch (error) {}
}