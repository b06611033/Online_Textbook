import { Injectable, Logger } from "@nestjs/common";
import { UpdateResult } from "typeorm";
import UserRepository from "./user.repository";
import User from "./user.entity";

@Injectable()
export default class UserService {
	private static readonly logger = new Logger(UserService.name);

	public constructor(private readonly userRepository: UserRepository) {}

	public findById(id: number): Promise<User | undefined> {
		return this.userRepository.findOne(id);
	}

	public update(id: number, data: Partial<User>): Promise<UpdateResult> {
		return this.userRepository.update({ id }, { ...data });
	}

	public async delete(id: number): Promise<boolean> {
		const deleteResult = await this.userRepository.delete({ id });
		if (deleteResult.affected !== undefined) {
			return deleteResult.affected > 0;
		}

		return false;
	}
}
