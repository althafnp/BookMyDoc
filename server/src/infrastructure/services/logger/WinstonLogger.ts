import winston from "winston";
import { ILogger } from "../../../application/interfaces/ILogger";
import { injectable } from "inversify";
import { env } from "../../config/env";


@injectable()
export class WinstonLogger implements ILogger {
    private _logger: winston.Logger;

    constructor() {
        this._logger = winston.createLogger({
            level: env.NODE_ENV === "production" ? "info" : "debug",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                //In dev: log to console with colors
                ...(env.NODE_ENV === "development"
                    ? [new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple()
                        ),
                    })]
                    : []),

                // Always: log to files
                new winston.transports.File({ filename: "logs/warn.log", level: "warn" }),
                new winston.transports.File({ filename: "logs/error.log", level: "error" }),
                new winston.transports.File({ filename: "logs/combined.log" })


                // In production: send to monitoring service
                // new WinstonCloudWatch({ logGroup: "my-app", ... }),
                // new WinstonDatadog({ apiKey: "...", ... }),
            ]
        });
    }

    info(message: string, meta?: unknown): void {
        this._logger.info(message, meta);
    }

    error(message: string, meta?: unknown): void {
        this._logger.error(message, meta);
    }

    warn(message: string, meta?: unknown): void {
        this._logger.warn(message, meta);
    }

    debug(message: string, meta?: unknown): void {
        this._logger.debug(message, meta);
    }
}