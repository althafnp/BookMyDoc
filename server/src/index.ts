import { connectDB } from "./infrastructure/config/db";
import { startServer } from "./infrastructure/web/express/server";

async function bootstrap() {
	try {
		await connectDB();
		startServer();
	} catch (error) {
		console.error("❌ Bootstrap failed", error);
		process.exit(1);
	}
}

bootstrap();