import { IncomingMessage } from "http";
import {
	Injectable,
	Logger,
	NotFoundException,
	InternalServerErrorException
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import {
	Strategy,
	StrategyOptions,
	Profile,
	VerifyCallback,
	StrategyOptionsWithRequest
} from "passport-google-oauth20";
import AuthService from "../auth.service";
import AuthProvider from "../auth.provider";
import EnvConfigService from "../../server-config/env-config.service";
import UserRepository from "../../user/user.repository";

@Injectable()
export default class GoogleStrategy extends PassportStrategy(Strategy, AuthProvider.GOOGLE) {
	private static readonly logger = new Logger(GoogleStrategy.name);

	public constructor(
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
		envConfigService: EnvConfigService
	) {
		super({
			clientID: envConfigService.googleOAuthClientId,
			clientSecret: envConfigService.googleOAuthClientSecret,
			callbackURL: `${envConfigService.googleOAuthCallback}/api/v1/auth/google/callback`,
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
					googleAccessToken: accessToken
				})
			));

		if (user === undefined) {
			return done(new InternalServerErrorException());
		}

		return done(undefined, user);
	}
}
