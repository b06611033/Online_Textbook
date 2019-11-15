import { Injectable, Logger } from "@nestjs/common";
import { FindConditions } from "typeorm";
import ProductRepository from "./product.repository";
import Product from "./product.entity";
import CreateProductDto from "./dto/create-product.dto";
import ProductsResponseDto from "./dto/products-response.dto";

type FindOptions = {
	codeName?: string;
};

@Injectable()
export default class ProductService {
	private static readonly logger = new Logger(ProductService.name);

	public constructor(private readonly productRepository: ProductRepository) {}

	public create(createProductDto: CreateProductDto): Promise<Product> {
		return this.productRepository.save(this.productRepository.create(createProductDto));
	}

	public async find(options: FindOptions): Promise<ProductsResponseDto> {
		let where: FindConditions<Product> = {};
		if (options.codeName !== undefined) {
			where = { ...where, codeName: options.codeName };
		}

		const products = await this.productRepository.find({
			relations: ["company", "subscriptions"],
			where
		});

		return { products };
	}

	public async findAll(): Promise<ProductsResponseDto> {
		const products = await this.productRepository
			.createQueryBuilder("product")
			.select()
			.innerJoinAndSelect("product.subscriptions", "subscription")
			.innerJoinAndSelect("product.company", "company")
			.orderBy("product.title", "ASC")
			.addOrderBy("company.name", "ASC")
			.getMany();

		return { products };
	}

	public async delete(id: number): Promise<boolean> {
		const deleteResult = await this.productRepository.delete({ id });
		if (deleteResult.affected !== undefined) {
			return deleteResult.affected > 0;
		}

		return false;
	}
}
