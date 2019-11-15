import { IncomingMessage, ServerResponse } from "http";
import { Controller, Logger, UseGuards, Get, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";
import { Response, Request } from "express";
import User from "../user/user.entity";
import ConfigService from "../config/config.service";
import AuthService from "./auth.service";
import AuthProvider from "./auth.provider";
import Role from "./role";
import Roles from "./role.decorator";
import RoleGuard from "./guards/role.guard";

@ApiUseTags("auth")
@Controller("auth")
export default class AuthController {
	private static readonly logger = new Logger(AuthController.name);

	public constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Get("google/login")
	@UseGuards(AuthGuard(AuthProvider.GOOGLE))
	// eslint-disable-next-line class-methods-use-this
	public googleLogin(): void {}

	@Get("google/callback")
	@UseGuards(AuthGuard(AuthProvider.GOOGLE))
	public googleLoginCallback(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): void {
		res.cookie("jwt", this.authService.generateJwtForUser((req.user as User).id));
		res.redirect(this.configService.mymaStoreDomain);
	}

	@Get("jwt/login")
	@ApiBearerAuth()
	@UseGuards(AuthGuard(AuthProvider.JWT))
	// eslint-disable-next-line class-methods-use-this
	public jwtLogin(@Req() req: IncomingMessage & Request): User {
		return req.user as User;
	}

	@Get("jwt/admin")
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	// eslint-disable-next-line class-methods-use-this
	public jwtAuthenticated(@Req() req: IncomingMessage & Request): string {
		return `${(req.user as User).name}`;
	}
}
