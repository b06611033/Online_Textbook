import { Repository, EntityRepository } from "typeorm";
import { Logger } from "@nestjs/common";
import Product from "./product.entity";

@EntityRepository(Product)
export default class ProductRepository extends Repository<Product> {
	private static readonly logger = new Logger(ProductRepository.name);
}
