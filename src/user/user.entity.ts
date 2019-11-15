import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	OneToMany,
	ManyToMany,
	JoinTable
} from "typeorm";
import { IsEmail } from "class-validator";
import { Exclude, Type } from "class-transformer";
import { ApiResponseModelProperty } from "@nestjs/swagger";
import Transaction from "../transaction/transaction.entity";
import Company from "../company/company.entity";
import Product from "../product/product.entity";

@Entity()
export default class User {
	@ApiResponseModelProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "user_id" })
	public readonly id: number;

	@ApiResponseModelProperty({ example: "Jane Doe" })
	@Column()
	public readonly name: string;

	@ApiResponseModelProperty({ example: "my.email@gmail.com" })
	@Column()
	@IsEmail()
	public readonly email: string;

	@Exclude()
	@Column({ nullable: true })
	public readonly jwt?: string;

	@Exclude()
	@Column({ name: "google_access_token", nullable: true })
	public readonly googleAccessToken?: string;

	@ApiResponseModelProperty({ example: false })
	@Column({ default: false })
	public readonly admin: boolean;

	@Exclude()
	@OneToMany(type => Transaction, transaction => transaction.user)
	@Type(() => Transaction)
	public readonly transactions: Transaction[];

	@ApiResponseModelProperty({ type: Company })
	@ManyToMany(type => Company, company => company.employees)
	@Type(() => Company)
	public readonly companies: Company[];

	@ApiResponseModelProperty({ type: Product })
	@ManyToMany(type => Product, product => product.authors)
	@Type(() => Product)
	@JoinTable({
		name: "author",
		joinColumn: { name: "user_id" },
		inverseJoinColumn: { name: "product_id" }
	})
	public readonly products: Product[];

	@Exclude()
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;

	@ApiResponseModelProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;
}
