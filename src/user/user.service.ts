import { Injectable, Logger } from "@nestjs/common";
import UserRepository from "./user.repository";

@Injectable()
export default class UserService {
	private static readonly logger = new Logger(UserService.name);

	public constructor(private readonly userRepository: UserRepository) {}
}
