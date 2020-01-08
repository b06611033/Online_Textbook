/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from "typeorm";
import Product from "../product/product.entity";
import Subscription from "../subscription/subscription.entity";
import Company from "../company/company.entity";
import User from "../user/user.entity";

type SubscriptionOmitProps = "createdAt" | "updatedAt" | "id" | "product" | "transactions";

export default class MYMAStore1560460502518 implements MigrationInterface {
	private readonly users: Array<
		Omit<
			User,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "googleAccessToken"
			| "transactions"
			| "companies"
			| "products"
		>
	> = [
		{
			name: "Phillip Yasskin",
			admin: true,
			email: "yasskin@tamu.edu"
		},
		{
			name: "Matthew Prisman",
			admin: true,
			email: "prisman@gmail.com"
		}
	];

	private readonly companies: Array<
		Omit<Company, "id" | "employees" | "createdAt" | "updatedAt" | "products">
	> = [
		{
			name: "MYMathApps"
		},
		{
			name: "Prisman Math"
		}
	];

	private readonly products: Array<
		Omit<Product, "company" | "authors" | "createdAt" | "updatedAt" | "id" | "subscriptions">
	> = [
		{
			title: "MYMathApps Calculus 1: Differential Calculus",
			codeName: "MYMACalc1",
			tagLine: "Viewing and doing, a wizard's guide to calculus",
			startPage: "MContents.html"
		},
		{
			title: "MYMathApps Calculus 2: Integral Calculus",
			codeName: "MYMACalc2",
			tagLine: "Viewing and doing, a wizard's guide to calculus",
			startPage: "MContents.html"
		},
		{
			title: "MYMathApps Calculus 3: Multi-variable Calculus",
			codeName: "MYMACalc3",
			tagLine: "Viewing and doing, a wizard's guide to calculus",
			startPage: "MContents.html"
		},
		{
			title: "Maplets for Calculus",
			codeName: "M4C",
			tagLine: "Tutoring without the tutor"
		},
		{
			title: "Introduction to Derivative Securities",
			codeName: "IntroToDerSecurities"
		},
		{
			title: "Fixed Income Fundamentals",
			codeName: "FixedIncomeFund"
		},
		{
			title: "Essays in Portfolio Management",
			codeName: "EssaysInPortfolioMgmt"
		}
	];

	private readonly subscriptions: Array<
		Array<
			| Omit<Subscription, SubscriptionOmitProps>
			| Omit<Subscription, SubscriptionOmitProps | "downloadLimit">
		>
	> = [
		[
			{
				length: 120,
				cost: 4000,
				downloadable: false
			},
			{
				length: 180,
				cost: 6000,
				downloadable: false
			}
		],
		[
			{
				length: 120,
				cost: 4000,
				downloadable: false
			},
			{
				length: 180,
				cost: 6000,
				downloadable: false
			}
		],
		[
			{
				length: 120,
				cost: 4000,
				downloadable: false
			},
			{
				length: 180,
				cost: 6000,
				downloadable: false
			}
		],
		[
			{
				downloadLimit: 1,
				cost: 50,
				downloadable: true
			},
			{
				downloadLimit: 5,
				cost: 50,
				downloadable: true
			}
		],
		[
			{
				downloadLimit: 1,
				cost: 9000,
				downloadable: true
			},
			{
				downloadLimit: 5,
				cost: 9000,
				downloadable: true
			}
		],
		[
			{
				downloadLimit: 1,
				cost: 9000,
				downloadable: true
			},
			{
				downloadLimit: 5,
				cost: 9000,
				downloadable: true
			}
		],
		[
			{
				downloadLimit: 1,
				cost: 9000,
				downloadable: true
			},
			{
				downloadLimit: 5,
				cost: 9000,
				downloadable: true
			}
		]
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		const userRepository = queryRunner.manager.getRepository(User);
		const companyRespository = queryRunner.manager.getRepository(Company);
		const productRepository = queryRunner.manager.getRepository(Product);
		const subscriptionRepository = queryRunner.manager.getRepository(Subscription);

		const users = await Promise.all(
			this.users.map(value => userRepository.save(userRepository.create(value)))
		);

		const subscriptions = await Promise.all(
			this.subscriptions.map(value =>
				subscriptionRepository.save(subscriptionRepository.create(value))
			)
		);

		const products = await Promise.all(
			this.products.map((product, index) =>
				productRepository.save(
					productRepository.create({ ...product, subscriptions: subscriptions[index] })
				)
			)
		);

		// Adding authors to products
		await Promise.all([
			userRepository.save({ ...users[0], products: products.slice(0, 3) }),
			userRepository.save({ ...users[1], products: products.slice(3) })
		]);

		const companies = await Promise.all(
			this.companies.map(value => companyRespository.save(companyRespository.create(value)))
		);

		// Adding products and employees to companies
		await Promise.all([
			companyRespository.save({
				...companies[0],
				products: products.slice(0, 3),
				employees: [users[0]]
			}),
			companyRespository.save({
				...companies[1],
				products: products.slice(3),
				employees: [users[1]]
			})
		]);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async down(queryRunner: QueryRunner): Promise<void> {}
}
