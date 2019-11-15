import { IncomingMessage } from "http";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
	OAuth2Strategy,
	IOAuth2StrategyOptionWithRequest,
	Profile,
	VerifyFunction
} from "passport-google-oauth";
import AuthService from "../auth.service";
import AuthProvider from "../auth.provider";
import ConfigService from "../../config/config.service";

@Injectable()
export default class GoogleStrategy extends PassportStrategy(OAuth2Strategy, AuthProvider.GOOGLE) {
	public constructor(private readonly authService: AuthService, configService: ConfigService) {
		super({
			clientID: configService.googleOAuthClientId,
			clientSecret: configService.googleOAuthClientSecret,
			callbackURL: `${configService.googleOAuthCallback}/api/v1/auth/google/callback`,
			passReqToCallback: true,
			scope: ["profile", "email"]
		} as IOAuth2StrategyOptionWithRequest & { scope: string | string[] });
	}

	// eslint-disable-next-line class-methods-use-this
	public async validate(
		req: IncomingMessage,
		accessToken: string,
		refreshToken: string | undefined,
		profile: Profile,
		done: VerifyFunction
	): Promise<void> {
		const user = await this.authService.validateUserByToken(accessToken, profile);
		if (user === undefined) {
			return done(new InternalServerErrorException("Unknown authentication provider"));
		}

		done(undefined, user);
	}
}
