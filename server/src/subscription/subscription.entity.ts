import {
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	ManyToOne,
	JoinColumn
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import Product from "../product/product.entity";
import Transaction from "../transaction/transaction.entity";

@Entity()
export default class Subscription {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "subscription_id" })
	public readonly id: number;

	@ApiResponseProperty({ example: 120 })
	@Column({ nullable: true })
	public readonly length?: number;

	@ApiResponseProperty({ example: 1876 })
	@Column()
	public readonly cost: number;

	@ApiResponseProperty({ example: false })
	@Column()
	public readonly downloadable: boolean;

	@ApiResponseProperty({ example: null })
	@Column({ name: "download_limit", nullable: true })
	public readonly downloadLimit?: number;

	@Exclude()
	@ManyToMany(
		type => Transaction,
		transaction => transaction.subscriptions
	)
	public readonly transactions: Transaction[];

	@Exclude()
	@ManyToOne(
		type => Product,
		product => product.subscriptions
	)
	@JoinColumn({ name: "product_id" })
	public readonly product: Product;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@Exclude()
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
