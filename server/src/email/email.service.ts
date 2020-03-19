import { Injectable, Logger } from "@nestjs/common";
import EnvConfigService from "../server-config/env-config.service";
import UserService from "../user/user.service";

@Injectable()
export default class EmailService {
	private static readonly logger = new Logger(EmailService.name);

	public constructor(
		private readonly envConfigService: EnvConfigService,
		private readonly userService: UserService
	) {}

	public forgotPassword(email: string): void {
		const temporaryPassword = this.userService.forgotPassword(email);
	}
}
