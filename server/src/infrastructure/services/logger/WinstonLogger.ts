import winston from "winston";
import { ILogger } from "../../../application/interfaces/ILogger";

class WinstonLogger implements ILogger{
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: "logs/error.log", level: "error" }),
                new winston.transports.File({ filename: "logs/combined.log" })
            ]
        });
    }

    info(message: string, meta?: unknown): void {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: unknown): void {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: unknown): void {
        this.logger.warn(message, meta);
    }
    
    debug(message: string, meta?: unknown): void {
        this.logger.debug(message, meta);
    }
}