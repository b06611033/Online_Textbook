import { IncomingMessage, ServerResponse } from "http";
import { Controller, Logger, UseGuards, Get, Req, Res, Post, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
	ApiBearerAuth,
	ApiTags,
	ApiBasicAuth,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse
} from "@nestjs/swagger";
import { Response, Request } from "express";
import { plainToClass } from "class-transformer";
import User from "../user/user.entity";
import EnvConfigService from "../server-config/env-config.service";
import EmailService from "../email/email.service";
import AuthenticationProvider from "./authentication.provider";
import AuthenticationService from "./authentication.service";

@ApiTags("authentication")
@Controller("authentication")
export default class AuthenticationController {
	private static readonly logger = new Logger(AuthenticationController.name);

	public constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly envConfigService: EnvConfigService,
		private readonly emailService: EmailService
	) {}

	@Get("google/login")
	@UseGuards(AuthGuard(AuthenticationProvider.GOOGLE))
	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
	public googleLogin(): void {}

	@Get("google/callback")
	@UseGuards(AuthGuard(AuthenticationProvider.GOOGLE))
	public googleLoginCallback(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): void {
		const user = req.user as User;
		res.cookie("jwt", this.authenticationService.createJwt(user));
		res.redirect(this.envConfigService.mymaStoreDomain);
	}

	@Get("jwt/login")
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@ApiUnauthorizedResponse({ description: "User with given credentials does not exist" })
	@UseGuards(AuthGuard(AuthenticationProvider.JWT))
	public jwtLogin(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): void {
		const user = req.user as User;
		res.cookie("jwt", this.authenticationService.createJwt(user));
		res.send(JSON.stringify(plainToClass(User, user)));
	}

	@ApiBasicAuth()
	@ApiOkResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@Post("local/sign-up")
	@UseGuards(AuthGuard(AuthenticationProvider.LOCAL))
	public async localSignUp(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): Promise<void> {
		const user = req.user as User;
		res.cookie("jwt", await this.authenticationService.createJwt(user));
		res.send(JSON.stringify(plainToClass(User, user)));
	}

	@ApiBasicAuth()
	@ApiOkResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@ApiUnauthorizedResponse({ description: "User with given credentials does not exist" })
	@Post("local/login")
	@UseGuards(AuthGuard(AuthenticationProvider.LOCAL))
	public async localLogin(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): Promise<void> {
		const user = req.user as User;
		res.cookie("jwt", await this.authenticationService.createJwt(user));
		res.send(JSON.stringify(plainToClass(User, user)));
	}

	@ApiOkResponse({
		description: "Sent an email to the specified address with a temporary password"
	})
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@ApiNotFoundResponse({ description: "User with supplied email does not exist" })
	@ApiInternalServerErrorResponse({ description: "Unable to send email to the specifed address" })
	@Get("forgotPassword")
	public async forgotPassword(@Query("email") email: string): Promise<void> {
		this.emailService.forgotPassword(email);
	}
}
