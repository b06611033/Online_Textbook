import crypto from "crypto";
import { Injectable, Logger } from "@nestjs/common";
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
				roles: [(await this.roleRepository.getRoleCache()).USER!]
			})
		);
	}

	public async forgotPassword(email: string): Promise<string> {
		const user = await this.userRepository.findOneOrFail({ where: { email } });
		const temporaryPassword = crypto.randomBytes(8).toString("hex").substring(0, 8);
		user.temporaryPassword = temporaryPassword;
		await this.userRepository.save(user);

		return temporaryPassword;
	}
}
