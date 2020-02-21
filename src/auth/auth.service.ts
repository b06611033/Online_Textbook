import { Injectable, Logger } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";

@Injectable()
export default class AuthService {
	private static readonly logger = new Logger(AuthService.name);

	public readonly jwtService: JwtService;

	public constructor(jwtService: JwtService) {
		this.jwtService = jwtService;
	}
}
