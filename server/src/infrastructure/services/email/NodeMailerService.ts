import { IEmailService } from "../../../application/interfaces/IEmailService";
import nodemailer, { Transporter} from "nodemailer";
import { env } from "../../config/env";
import { injectable } from "inversify";


@injectable()
export class NodeMailerService implements IEmailService{
    private _transporter: Transporter;

    constructor() {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASS
            },
        });
    }

    async sendVerificationEmail(email: string, link: string): Promise<void> {
        const mailOptions = {
            from: env.EMAIL_USER,
            to: email,
            subject: "Verify your account",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Verify Your Email 👋</h2>
                    <p>
                        Thank you for registering. Please verify your email by clicking the button below:
                    </p>

                    <a 
                        href="${link}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            margin: 16px 0;
                            background-color: #2563eb;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                        "
                    >
                        Verify Email
                    </a>

                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        };

        await this._transporter.sendMail(mailOptions);
    }


    async sendPasswordResetVerificationEmail(email: string, link: string): Promise<void> {
        const mailOptions = {
            from: env.EMAIL_USER,
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Reset Password 👋</h2>
                    <p>
                        Please reset your password by clicking the button below:
                    </p>

                    <a 
                        href="${link}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            margin: 16px 0;
                            background-color: #2563eb;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                        "
                    >
                        Reset password
                    </a>

                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        };

        await this._transporter.sendMail(mailOptions);
    }
}