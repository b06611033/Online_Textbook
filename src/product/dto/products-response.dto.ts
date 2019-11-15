import { Type } from "class-transformer";
import { ApiResponseModelProperty } from "@nestjs/swagger";
import Product from "../product.entity";

export default class ProductsResponseDto {
	@ApiResponseModelProperty({ type: Product })
	@Type(() => Product)
	public readonly products: Product[];
}
