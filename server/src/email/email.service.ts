import fs from "fs";
import path from "path";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { toUndefined } from "fp-ts/lib/Option";
import Handlebars from "handlebars";
import MYMAConfigService from "../server-config/myma-config.service";
import UserService from "../user/user.service";
import { User } from "../user/user.entity";

type ActivateAccountParams = {
	name: string;
	email: string;
	storeDomain: string;
	activateAccountRoute: string;
	activationCode: string;
	contactRoute: string;
};

type ForgotPasswordParams = {
	name: string;
	email: string;
	temporaryPassword: string;
	storeDomain: string;
	forgotPasswordRoute: string;
	contactRoute: string;
};

@Injectable()
export default class EmailService implements OnModuleDestroy {
	private static readonly logger = new Logger(EmailService.name);

	private readonly transporter: Mail;
	private readonly activateAccountTemplateDelegate: HandlebarsTemplateDelegate<
		ActivateAccountParams
	>;
	private readonly temporaryPasswordTemplateDelegate: HandlebarsTemplateDelegate<
		ForgotPasswordParams
	>;
	private readonly from?: string;

	public constructor(
		private readonly mymaConfigService: MYMAConfigService,
		private readonly userService: UserService
	) {
		if (this.mymaConfigService.mymaEmailEnabled) {
			this.activateAccountTemplateDelegate = Handlebars.compile(
				fs.readFileSync(path.join(__dirname, "templates", "activate-account.txt")).toString()
			);
			this.temporaryPasswordTemplateDelegate = Handlebars.compile(
				fs.readFileSync(path.join(__dirname, "templates", "temporary-password.txt")).toString()
			);

			const port = toUndefined(this.mymaConfigService.mailgunPort)!;
			const mailgunUsername = toUndefined(this.mymaConfigService.mailgunUsername);
			this.from = `"MYMathApps <${mailgunUsername}>`;
			this.transporter = createTransport({
				host: toUndefined(this.mymaConfigService.mailgunServer)!,
				port: port,
				// 465 is the secure port for SMTP although research says it is deprecated.
				// Confirm with Mailgun.
				secure: port === 465 || port === 587,
				auth: {
					user: mailgunUsername!,
					pass: toUndefined(this.mymaConfigService.mailgunPassword)!
				}
			});

			this.transporter
				.verify()
				.then(() => EmailService.logger.log("Mailgun transport verified"))
				.catch((e: Error) => {
					EmailService.logger.error(e.message);
					process.exit(1);
				});
		}
	}

	public onModuleDestroy(): void {
		if (this.mymaConfigService.mymaEmailEnabled) {
			this.transporter.close();
		}
	}

	public async activateAccount(user: User): Promise<void> {
		if (!this.mymaConfigService.mymaEmailEnabled) {
			await this.userService.activateAccount(user.activationCode!);
			EmailService.logger.debug(
				`Activated account for ${user.email} with activation code ${user.activationCode}`
			);
			return;
		}

		this.transporter
			.sendMail({
				from: this.from,
				to: user.email,
				subject: "Activate Account",
				text: this.activateAccountTemplateDelegate({
					name: user.name,
					email: user.email,
					storeDomain: this.mymaConfigService.mymaStoreDomain,
					activateAccountRoute: this.mymaConfigService.mymaActivateAccountRoute,
					activationCode: user.activationCode!,
					contactRoute: this.mymaConfigService.contactRoute
				})
			})
			.then(() => EmailService.logger.debug(`Sent activate account email to ${user.email}`))
			.catch((e: Error) => EmailService.logger.error(e.message));
	}

	public async temporaryPassword(email: string): Promise<void> {
		const user = await this.userService.createTemporaryPasswordForUser(email);
		if (!this.mymaConfigService.mymaEmailEnabled) {
			EmailService.logger.debug(`Temporary password for ${email}: ${user.temporaryPassword}`);
			return;
		}

		this.transporter
			.sendMail({
				from: this.from,
				to: user.email,
				subject: "Temporary Password",
				text: this.temporaryPasswordTemplateDelegate({
					name: user.name,
					email: user.email,
					temporaryPassword: user.temporaryPassword!,
					storeDomain: this.mymaConfigService.mymaStoreDomain,
					forgotPasswordRoute: this.mymaConfigService.mymaForgotPasswordRoute,
					contactRoute: this.mymaConfigService.contactRoute
				})
			})
			.then(() => EmailService.logger.debug(`Sent temporary password email to ${user.email}`))
			.catch((e: Error) => EmailService.logger.error(e.message));
	}
}
