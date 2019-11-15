import { ServerResponse, IncomingMessage } from "http";
import fs from "fs";
import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	UseGuards,
	Param,
	Query,
	Res,
	Req,
	BadRequestException
} from "@nestjs/common";
import {
	ApiUseTags,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiBearerAuth
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { Response, Request } from "express";
import AuthProvider from "../auth/auth.provider";
import Roles from "../auth/role.decorator";
import Role from "../auth/role";
import RoleGuard from "../auth/guards/role.guard";
import ConfigService from "../config/config.service";
import ProductGuard from "./product.guard";
import ProductService from "./product.service";
import Product from "./product.entity";
import CreateProductDto from "./dto/create-product.dto";
import ProductsResponseDto from "./dto/products-response.dto";

@ApiUseTags("products")
@Controller("products")
export default class ProductController {
	public constructor(
		private readonly productService: ProductService,
		private readonly configService: ConfigService
	) {}

	@Post()
	@ApiCreatedResponse({ type: Product, description: "Successfully created a product" })
	@ApiBadRequestResponse({ description: "Bad request" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	public create(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return this.productService.create(createProductDto);
	}

	@Get()
	@ApiOkResponse({ type: ProductsResponseDto, description: "Successfully retrieved" })
	public async get(@Query("codeName") codeName?: string): Promise<ProductsResponseDto> {
		if (codeName !== undefined) {
			return plainToClass(ProductsResponseDto, await this.productService.find({ codeName }));
		}

		return plainToClass(ProductsResponseDto, await this.productService.findAll());
	}

	@Delete(":id")
	@ApiOkResponse({ type: Product, description: "Product deleted" })
	@ApiBearerAuth()
	@Roles(Role.ADMIN)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	public delete(@Param("id") id: number): Promise<boolean> {
		return this.productService.delete(id);
	}

	@Get(":product/*")
	@UseGuards(ProductGuard)
	public product(
		@Req() req: IncomingMessage & Request,
		@Res() res: ServerResponse & Response
	): void {
		const file = req.url.split("/api/v1/products").slice(1)[0];
		const path = `${this.configService.productsPath}/${file}`;

		if (!fs.existsSync(path)) {
			throw new BadRequestException("File does not exist");
		}

		res.sendFile(path);
	}
}
