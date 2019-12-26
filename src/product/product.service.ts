import { Injectable, Logger } from "@nestjs/common";
import ProductRepository from "./product.repository";
import Product from "./product.entity";
import CreateProductDto from "./dto/requests/create-product.dto";
import ProductsDto from "./dto/responses/products.dto";

type FindOptions = {
	codeName?: string;
};

@Injectable()
export default class ProductService {
	private static readonly logger = new Logger(ProductService.name);

	public constructor(private readonly productRepository: ProductRepository) {}
}
