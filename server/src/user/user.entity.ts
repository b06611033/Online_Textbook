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
import { IsEmail, IsUUID } from "class-validator";
import { Exclude, Type } from "class-transformer";
import { ApiResponseProperty } from "@nestjs/swagger";
import Transaction from "../transaction/transaction.entity";
import Company from "../company/company.entity";
import Product from "../product/product.entity";
import Role from "../authorization/role.entity";

@Entity()
export default class User {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "user_id" })
	public readonly id: number;

	@ApiResponseProperty({ example: "Jane Doe" })
	@Column()
	public readonly name: string;

	@ApiResponseProperty({ example: "jane.doe@example.com" })
	@Column({ unique: true })
	@IsEmail()
	public readonly email: string;

	@Exclude()
	@Column({ name: "google_access_token", nullable: true })
	public googleAccessToken?: string;

	@Exclude()
	@Column({ nullable: true })
	public readonly hashedPassword?: string;

	@Exclude()
	@Column({ default: false })
	public requestedTemporaryPassword?: boolean;

	@Exclude()
	@Column({ nullable: true })
	public temporaryPassword?: string;

	@ApiResponseProperty({ type: [Role] })
	@ManyToMany(
		type => Role,
		role => role.users
	)
	@JoinTable({
		name: "user_roles",
		joinColumn: { name: "user_id" },
		inverseJoinColumn: { name: "role_id" }
	})
	@Type(() => Role)
	public roles: Role[];

	@Exclude()
	@OneToMany(
		type => Transaction,
		transaction => transaction.user
	)
	@Type(() => Transaction)
	public readonly transactions: Transaction[];

	@ApiResponseProperty({ type: [Company] })
	@ManyToMany(
		type => Company,
		company => company.employees
	)
	@Type(() => Company)
	public readonly companies: Company[];

	@ApiResponseProperty({ type: [Product] })
	@ManyToMany(
		type => Product,
		product => product.authors
	)
	@Type(() => Product)
	@JoinTable({
		name: "author",
		joinColumn: { name: "user_id" },
		inverseJoinColumn: { name: "product_id" }
	})
	public readonly products: Product[];

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
