import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToMany,
	ManyToOne,
	JoinColumn
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import Subscription from "../subscription/subscription.entity";
import Company from "../company/company.entity";
import User from "../user/user.entity";

@Entity()
export default class Product {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "product_id" })
	public readonly id: number;

	@ApiResponseProperty({ example: "Calculus 1" })
	@Column({ type: "text" })
	public readonly title: string;

	@ApiResponseProperty({ example: "Calculus is easy as Pi" })
	@Column({ name: "tag_line", nullable: true })
	public readonly tagLine?: string;

	@ApiResponseProperty({ example: "MContents.html" })
	@Column({ name: "start_page", nullable: true })
	public readonly startPage?: string;

	@ApiResponseProperty({ type: Subscription })
	@OneToMany((type) => Subscription, (subscription) => subscription.product)
	@Type(() => Subscription)
	public readonly subscriptions: Subscription[];

	@ApiResponseProperty({ example: "MYMACalc1" })
	@Column({ type: "varchar", length: 128, unique: true, name: "code_name" })
	public readonly codeName: string;

	@ApiResponseProperty({ type: Company })
	@ManyToOne((type) => Company, (company) => company.products)
	@JoinColumn({ name: "company_id" })
	@Type(() => Company)
	public readonly company: Company;

	@ApiResponseProperty({ type: User })
	@ManyToMany((type) => User, (user) => user.products)
	@Type(() => User)
	public readonly authors: User[];

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
