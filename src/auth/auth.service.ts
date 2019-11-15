import { Injectable, Logger } from "@nestjs/common";
import { Profile } from "passport";
import { JwtService } from "@nestjs/jwt";
import User from "../user/user.entity";
import UserRepository from "../user/user.repository";
import JwtPayload from "./jwt-payload";
import AuthProvider from "./auth.provider";

@Injectable()
export default class AuthService {
	private static readonly logger = new Logger(AuthService.name);
	private readonly userRepository: UserRepository;
	public readonly jwtService: JwtService;

	public constructor(userRepository: UserRepository, jwtService: JwtService) {
		this.userRepository = userRepository;
		this.jwtService = jwtService;
	}

	public generateJwtForUser(id: number): string {
		const payload: JwtPayload = {
			id
		};

		const jwt = this.jwtService.sign(payload);

		this.userRepository.update(id, { jwt });

		return jwt;
	}

	public async validateUserByJwtPayload(payload: JwtPayload): Promise<User | undefined> {
		return this.userRepository.findOne(payload.id);
	}

	public async validateUserByToken<P extends Profile>(
		token: string,
		profile: P
	): Promise<User | undefined> {
		if (profile.provider === AuthProvider.GOOGLE) {
			let user = await this.userRepository
				.createQueryBuilder("user")
				.select(["user.id", "user.admin"])
				.where("user.email = :email", { email: profile!.emails![0].value })
				.getOne();

			if (user === undefined) {
				user = await this.userRepository.save(
					this.userRepository.create({
						name: profile!.displayName,
						email: profile!.emails![0].value,
						googleAccessToken: token
					})
				);
			}

			return user;
		}

		return undefined;
	}
}
