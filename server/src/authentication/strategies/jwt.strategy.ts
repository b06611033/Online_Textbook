import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";
import JwtPayload from "../jwt-payload";
import AuthenticationProvider from "../authentication.provider";
import MYMAConfigService from "../../server-config/myma-config.service";
import { User } from "../../user/user.entity";
import UserRepository from "../../user/user.repository";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy, AuthenticationProvider.JWT) {
	public constructor(
		private readonly userRepository: UserRepository,
		mymaConfigService: MYMAConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: mymaConfigService.mymaJwtSecret
		} as StrategyOptions);
	}

	public async validate(payload: JwtPayload, done: VerifiedCallback): Promise<User> {
		const user = await this.userRepository.findOne(payload.sub);
		if (user === undefined) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
