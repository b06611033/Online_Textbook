import { Injectable, Logger } from "@nestjs/common";
import RoleRepository from "./role.repository";
import { Role } from "./role.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export default class RoleService {
	private static readonly logger = new Logger(RoleService.name);

	public constructor(@InjectRepository(Role) private readonly roleRepository: RoleRepository) {}

	async getAllAsync(): Promise<any> {
		return await this.roleRepository.getRoleCache;
	}

	async getCountAsync(): Promise<number> {
		return await this.roleRepository.count();
	}
}
