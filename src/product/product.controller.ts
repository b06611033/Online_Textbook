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
	Res,
	Req,
	BadRequestException,
	NotFoundException
} from "@nestjs/common";
import {
	ApiTags,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiBearerAuth,
	ApiNotFoundResponse
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { Response, Request } from "express";
import EnvConfigService from "../server-config/env-config.service";
import Roles from "../authorization/decorators/role.decorator";
import RoleName from "../authorization/role-name";
import AuthenticationProvider from "../authentication/authentication.provider";
import RoleGuard from "../authorization/guards/role.guard";
import ProductGuard from "./product.guard";
import ProductService from "./product.service";
import Product from "./product.entity";
import CreateProductDto from "./dto/requests/create-product.dto";
import ProductsDto from "./dto/responses/products.dto";
import ProductRepository from "./product.repository";

@ApiTags("products")
@Controller("products")
export default class ProductController {
	public constructor(
		private readonly envConfigService: EnvConfigService,
		private readonly productService: ProductService,
		private readonly productRepository: ProductRepository
	) {}

	@Post()
	@ApiCreatedResponse({ type: Product, description: "Successfully created a product" })
	@ApiBadRequestResponse({ description: "Bad request" })
	@ApiBearerAuth()
	@Roles(RoleName.ADMIN)
	@UseGuards(AuthGuard(AuthenticationProvider.JWT), RoleGuard)
	public create(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return this.productRepository.save(this.productRepository.create(createProductDto));
	}

	@Get()
	@ApiOkResponse({ type: [ProductsDto], description: "Successfully retrieved" })
	public async getAllProducts(): Promise<ProductsDto> {
		const products = await this.productRepository.findAll();

		return plainToClass(ProductsDto, { products } as ProductsDto);
	}

	@Get(":codeName")
	@ApiOkResponse({ type: ProductsDto, description: "Successfully retrieved" })
	@ApiNotFoundResponse({ description: "No product with that code name exists" })
	public async getProduct(@Param("codeName") codeName: string): Promise<ProductsDto> {
		const product = await this.productRepository.findOne(
			{ codeName },
			{ relations: ["subscriptions", "company"] }
		);

		if (product === undefined) {
			throw new NotFoundException();
		}

		return plainToClass(ProductsDto, { products: [product] } as ProductsDto);
	}

	@Delete(":id")
	@ApiOkResponse({ description: "Product deleted" })
	@ApiBearerAuth()
	@Roles(RoleName.ADMIN)
	@UseGuards(AuthGuard(AuthenticationProvider.JWT), RoleGuard)
	public async delete(@Param("id") id: number): Promise<void> {
		await this.productRepository.delete({ id });
	}

	@Get("content/:product/*")
	@ApiBadRequestResponse({ description: "File does not exist" })
	@UseGuards(ProductGuard)
	public product(
		@Req() req: IncomingMessage & Request & { file?: string },
		@Res() res: ServerResponse & Response
	): void {
		if (req.file === undefined) {
			throw new BadRequestException("File is undefined");
		}

		const path = `${this.envConfigService.productsPath}/${req.file}`;

		if (!fs.existsSync(path)) {
			throw new BadRequestException("File does not exist");
		}

		res.sendFile(path);
	}
}
