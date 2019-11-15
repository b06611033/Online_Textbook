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
import { ApiResponseModelProperty } from "@nestjs/swagger";
import { Type, Exclude } from "class-transformer";
import Product from "../product/product.entity";
import User from "../user/user.entity";

@Entity()
export default class Company {
	@ApiResponseModelProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "company_id" })
	public readonly id: number;

	@ApiResponseModelProperty({ example: "MY Math Apps" })
	@Column()
	public readonly name: string;

	@ApiResponseModelProperty({ type: Product })
	@OneToMany(type => Product, product => product.company)
	@Type(() => Product)
	public readonly products: Product[];

	@ApiResponseModelProperty({ type: User })
	@ManyToMany(type => User, user => user.companies)
	@JoinTable({
		name: "employees",
		joinColumn: { name: "company_id" },
		inverseJoinColumn: { name: "user_id" }
	})
	public readonly employees: User[];

	@ApiResponseModelProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	@Exclude()
	public readonly updatedAt: Date;
}
