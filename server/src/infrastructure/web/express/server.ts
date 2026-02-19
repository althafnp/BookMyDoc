import app from "./app";
import { env } from "../../config/env";

export const startServer = () => {
    return app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port http://localhost:${env.PORT}`);
    });
};
