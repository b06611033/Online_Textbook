import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn,
	JoinTable
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Type, Exclude } from "class-transformer";
import Product from "../product/product.entity";
import User from "../user/user.entity";

@Entity()
export default class Company {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "company_id" })
	public readonly id: number;

	@ApiResponseProperty({ example: "MYMathApps" })
	@Column()
	public readonly name: string;

	@ApiResponseProperty({ type: Product })
	@OneToMany((type) => Product, (product) => product.company)
	@Type(() => Product)
	public readonly products: Product[];

	@ApiResponseProperty({ type: [User] })
	@ManyToMany((type) => User, (user) => user.companies)
	@JoinTable({
		name: "employee",
		joinColumn: { name: "company_id" },
		inverseJoinColumn: { name: "user_id" }
	})
	@Type(() => User)
	public readonly employees: User[];

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	@Exclude()
	public readonly updatedAt: Date;
}
