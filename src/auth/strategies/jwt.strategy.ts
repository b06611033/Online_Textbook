import { IncomingMessage } from "http";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";
import AuthService from "../auth.service";
import JwtPayload from "../jwt-payload";
import AuthProvider from "../auth.provider";
import ConfigService from "../../config/config.service";
import User from "../../user/user.entity";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy, AuthProvider.JWT) {
	public constructor(private readonly authService: AuthService, configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.jwtSecret,
			passReqToCallback: true
		} as StrategyOptions);
	}

	public async validate(
		req: IncomingMessage & Request,
		payload: JwtPayload,
		done: VerifiedCallback
	): Promise<User> {
		const user = await this.authService.validateUserByJwtPayload(payload);
		if (user === undefined) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
