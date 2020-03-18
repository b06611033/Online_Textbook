import { ServerResponse } from "http";
import {
	Body,
	Controller,
	Post,
	Get,
	Delete,
	UseGuards,
	Param,
	Res,
	NotFoundException,
	HttpStatus,
	HttpCode
} from "@nestjs/common";
import {
	ApiTags,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { Response } from "express";
import EnvConfigService from "../server-config/env-config.service";
import Roles from "../authorization/decorators/role.decorator";
import RoleName from "../authorization/role-name";
import AuthenticationProvider from "../authentication/authentication.provider";
import RoleGuard from "../authorization/guards/role.guard";
import ProductGuard from "./product.guard";
import Product from "./product.entity";
import CreateProductDto from "./dto/requests/create-product.dto";
import ProductsDto from "./dto/responses/products.dto";
import ProductRepository from "./product.repository";

@ApiTags("products")
@Controller("products")
export default class ProductController {
	public constructor(private readonly productRepository: ProductRepository) {}

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

	@Get("access/:product")
	@ApiBadRequestResponse({ description: "File does not exist" })
	@ApiUnauthorizedResponse({ description: "User is not authorized to view this content" })
	@UseGuards(ProductGuard)
	// eslint-disable-next-line class-methods-use-this
	public product(@Param("product") product: string, @Res() res: ServerResponse & Response): void {
		res.cookie(`${product}-Access`, "true", { httpOnly: true, sameSite: "strict", secure: true });
		res.redirect(`file:///home/tristan957/Projects/myma-store-server/products/${product}`);
	}
}
