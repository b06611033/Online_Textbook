import { IncomingMessage } from "http";
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
	UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import UserRepository from "../user/user.repository";
import JwtPayload from "../auth/jwt-payload";
import AuthService from "../auth/auth.service";
import ProductRepository from "./product.repository";

@Injectable()
export default class ProductGuard implements CanActivate {
	public constructor(
		private readonly reflector: Reflector,
		private readonly userRepository: UserRepository,
		private readonly productRepository: ProductRepository,
		private readonly authService: AuthService
	) {}

	public async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest<IncomingMessage & Request & { file?: string }>();
		const file = request.url.split("/api/v1/products/content/").slice(1)[0];

		request.file = file;

		// Only check HTML files otherwise the assets won't load
		if (!file.endsWith(".html")) {
			return true;
		}

		const params = request.params as { product?: string };

		if (params.product !== undefined) {
			const product = await this.productRepository.findOne({
				where: { codeName: params.product }
			});

			if (product === undefined) {
				throw new BadRequestException("No product with that code name exists.");
			}

			if (request.cookies === undefined || request.cookies.jwt === undefined) {
				throw new UnauthorizedException("Must be logged in to view this product.");
			}

			const userId = (this.authService.jwtService.decode(request.cookies.jwt) as JwtPayload).sub;
			const hasValidSubscription = await this.userRepository.validUserSubscriptionForProduct(
				userId,
				product.id
			);

			if (!hasValidSubscription) {
				throw new UnauthorizedException("Must have a valid subscription to view this product.");
			}
		}

		return true;
	}
}
