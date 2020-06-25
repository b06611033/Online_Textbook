import crypto from "crypto";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import RoleRepository from "../authorization/role.repository";
import UserRepository from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export default class UserService {
	private static readonly logger = new Logger(UserService.name);

	public constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository
	) {}

	public async activateAccount(activationCode: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { activationCode } });
		if (user === undefined) {
			return undefined;
		}

		user.activatedAccount = true;

		return this.userRepository.save(user);
	}

	public async createUserFromLocalStrategy(
		name: string,
		email: string,
		hashedPassword: string
	): Promise<User> {
		return this.userRepository.save(
			this.userRepository.create({
				name,
				email,
				hashedPassword,
				activationCode: crypto.randomBytes(16).toString("hex"),
				roles: [(await this.roleRepository.getRoleCache()).USER!]
			})
		);
	}

	public async createTemporaryPasswordForUser(email: string): Promise<User> {
		const user = await this.userRepository.findOneOrFail({ where: { email } });

		const temporaryPassword = crypto.randomBytes(8).toString("hex");
		user.temporaryPassword = temporaryPassword;
		user.temporaryPasswordRequestedAt = new Date();

		return this.userRepository.save(user);
	}

	/**
	 * Users have 24 hours to activate their accounts. In this case that they
	 * did not activate in time, their account would be deleted, and they would
	 * be expected to recreate their account.
	 */
	@Cron(CronExpression.EVERY_HOUR)
	public async cullUnactivatedAccounts(): Promise<void> {
		UserService.logger.log("Culling unactivated accounts");
		this.userRepository
			.createQueryBuilder("user")
			.delete()
			.where("!user.activated_account")
			.andWhere("TIMESTAMPDIFF(SECOND, CURRENT_TIMESTAMP(), user.created_at) >= 86400")
			.execute()
			.then((res) => UserService.logger.log("Finished culling unactivated accounts"))
			.catch((err) => UserService.logger.error("Failed to cull unaactivated accounts"));
	}
}
