import { IncomingMessage } from "http";
import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import {
	Strategy,
	Profile,
	VerifyCallback,
	StrategyOptionsWithRequest
} from "passport-google-oauth20";
import AuthenticationProvider from "../authentication.provider";
import MYMAConfigService from "../../server-config/myma-config.service";
import UserRepository from "../../user/user.repository";
import RoleRepository from "../../authorization/role.repository";
import RoleName from "../../authorization/role-name";

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
	Strategy,
	AuthenticationProvider.GOOGLE
) {
	private static readonly logger = new Logger(GoogleStrategy.name);

	public constructor(
		private readonly userRepository: UserRepository,
		private readonly roleRepository: RoleRepository,
		mymaConfigService: MYMAConfigService
	) {
		super({
			clientID: mymaConfigService.googleOAuthClientId,
			clientSecret: mymaConfigService.googleOAuthClientSecret,
			callbackURL: `${mymaConfigService.googleOAuthCallback}/api/v1/authentication/google/callback`,
			passReqToCallback: true,
			scope: ["profile", "email"]
		} as StrategyOptionsWithRequest);
	}

	public async validate(
		req: IncomingMessage & Request,
		accessToken: string,
		refreshToken: string | undefined,
		profile: Profile,
		done: VerifyCallback
	): Promise<void> {
		const user =
			(await this.userRepository
				.createQueryBuilder("user")
				.select(["user.id", "user.admin"])
				.where("user.email = :email", { email: profile!.emails![0].value })
				.getOne()) ??
			(await this.userRepository.save(
				this.userRepository.create({
					name: profile.displayName,
					email: profile.emails![0].value,
					googleAccessToken: accessToken,
					roles: [(await this.roleRepository.getRoleCache()).USER!]
				})
			));

		if (user === undefined) {
			return done(new InternalServerErrorException());
		}

		return done(undefined, user);
	}
}
