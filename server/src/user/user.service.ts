import { Injectable, Logger } from "@nestjs/common";
import RoleRepository from "../authorization/role.repository";
import UserRepository from "./user.repository";
import User from "./user.entity";

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
}
