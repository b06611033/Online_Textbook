import { IncomingMessage } from "http";
import { Controller, Logger, UseGuards, Get, Req, Post, Query, Redirect } from "@nestjs/common";
import { SetCookies } from "@nestjsplus/cookies";
import { AuthGuard } from "@nestjs/passport";
import {
	ApiBearerAuth,
	ApiTags,
	ApiBasicAuth,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiCreatedResponse
} from "@nestjs/swagger";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import User from "../user/user.entity";
import EnvConfigService from "../server-config/env-config.service";
import EmailService from "../email/email.service";
import AuthenticationProvider from "./authentication.provider";
import AuthenticationService from "./authentication.service";

@ApiTags("authentication")
@Controller("api/authentication")
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
	@Redirect("", 301)
	public async googleLoginCallback(
		@Req() req: IncomingMessage & Request
	): Promise<{ url: string }> {
		const user = req.user as User;
		/* eslint-disable @typescript-eslint/ban-ts-ignore, require-atomic-updates */
		// @ts-ignore 2551
		req._cookies = [
			{
				name: "jwt",
				value: await this.authenticationService.createJwt(user),
				options: {
					sameSite: "strict",
					httpOnly: true
				}
			}
		];
		/* eslint-enable */
		return { url: this.envConfigService.mymaContentRootRoute };
	}

	@Get("jwt/login")
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@ApiUnauthorizedResponse({ description: "User with given credentials does not exist" })
	@UseGuards(AuthGuard(AuthenticationProvider.JWT))
	@SetCookies()
	public async jwtLogin(@Req() req: IncomingMessage & Request): Promise<User> {
		const user = req.user as User;
		/* eslint-disable @typescript-eslint/ban-ts-ignore, require-atomic-updates */
		// @ts-ignore 2551
		req._cookies = [
			{
				name: "jwt",
				value: await this.authenticationService.createJwt(user),
				options: {
					sameSite: "strict",
					httpOnly: true
				}
			}
		];
		/* eslint-enable */
		return plainToClass(User, user);
	}

	@ApiBasicAuth()
	@ApiCreatedResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@Post("local/sign-up")
	@UseGuards(AuthGuard(AuthenticationProvider.LOCAL))
	@Redirect("", 301)
	@SetCookies()
	public async localSignUp(@Req() req: IncomingMessage & Request): Promise<{ url: string }> {
		const user = req.user as User;
		/* eslint-disable @typescript-eslint/ban-ts-ignore, require-atomic-updates */
		// @ts-ignore 2551
		req._cookies = [
			{
				name: "jwt",
				value: await this.authenticationService.createJwt(user),
				options: {
					sameSite: "strict",
					httpOnly: true
				}
			}
		];
		/* eslint-enable */
		return { url: this.envConfigService.mymaContentRootRoute };
	}

	@ApiBasicAuth()
	@ApiOkResponse({ type: User, description: "Successfully logged the user in" })
	@ApiBadRequestResponse({ description: "Request did not satisfy necessary parameters" })
	@ApiUnauthorizedResponse({ description: "User with given credentials does not exist" })
	@Post("local/login")
	@UseGuards(AuthGuard(AuthenticationProvider.LOCAL))
	@Redirect("", 301)
	@SetCookies()
	public async localLogin(@Req() req: IncomingMessage & Request): Promise<{ url: string }> {
		const user = req.user as User;
		/* eslint-disable @typescript-eslint/ban-ts-ignore, require-atomic-updates */
		// @ts-ignore 2551
		req._cookies = [
			{
				name: "jwt",
				value: await this.authenticationService.createJwt(user),
				options: {
					sameSite: "strict",
					httpOnly: true
				}
			}
		];
		/* eslint-enable */
		return { url: this.envConfigService.mymaContentRootRoute };
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
