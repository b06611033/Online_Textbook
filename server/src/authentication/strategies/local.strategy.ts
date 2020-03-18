import { Injectable, UnauthorizedException, BadRequestException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, IStrategyOptionsWithRequest } from "passport-local";
import { Request } from "express";
import User from "../../user/user.entity";
import AuthenticationService from "../authentication.service";
import UserService from "../../user/user.service";
import AuthenticationProvider from "../authentication.provider";

@Injectable()
export default class LocalStrategy extends PassportStrategy(
	Strategy,
	AuthenticationProvider.LOCAL
) {
	private static readonly logger = new Logger(LocalStrategy.name);

	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly userService: UserService
	) {
		super({
			usernameField: "email",
			passwordField: "hashedPassword",
			session: true,
			passReqToCallback: true
		} as IStrategyOptionsWithRequest);
	}

	public async validate(
		req: Request,
		email: string,
		hashedPassword: string,
		done: CallableFunction
	): Promise<User> {
		const name = req.body.name as string | undefined;
		const isNewUser = req.path.endsWith("sign-up");
		if (name !== undefined && !isNewUser) {
			done(new BadRequestException(), undefined);
		}

		const user = isNewUser
			? await this.userService.createUserFromLocalStrategy(name!, email, hashedPassword)
			: await this.authenticationService.validateUser(email, hashedPassword);
		if (user === undefined) {
			done(new UnauthorizedException(), undefined);
		}

		return done(null, user);
	}
}
