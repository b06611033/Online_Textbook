/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from "typeorm";
import Product from "../product/product.entity";
import Subscription from "../subscription/subscription.entity";
import Company from "../company/company.entity";
import User from "../user/user.entity";
import Role from "../authorization/role.entity";
import RoleName from "../authorization/role-name";
import Permission from "../authorization/permission.entity";
import PermissionName from "../authorization/permission-name";

type SubscriptionOmitProps = "createdAt" | "updatedAt" | "id" | "product" | "transactions";

export default class MYMAStore1560460502518 implements MigrationInterface {
	private readonly permissions: Array<
		Omit<Permission, "id" | "roles" | "createdAt" | "updatedAt">
	> = [
		{
			name: PermissionName.READ_SELF
		},
		{
			name: PermissionName.READ_OTHERS
		},
		{
			name: PermissionName.UPDATE_SELF
		},
		{
			name: PermissionName.UPDATE_OTHERS
		},
		{
			name: PermissionName.DELETE_SELF
		},
		{
			name: PermissionName.DELETE_OTHERS
		}
	];

	private readonly roles: Array<
		Omit<Role, "id" | "users" | "permissions" | "createdAt" | "updatedAt">
	> = [
		{
			name: RoleName.ADMIN
		},
		{
			name: RoleName.USER
		}
	];

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
			| "roles"
		>
	> = [
		{
			name: "Phillip Yasskin",
			email: "yasskin@tamu.edu"
		},
		{
			name: "Eli Prisman",
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
			codeName: "IntroductionToDerivativeSecurities"
		},
		{
			title: "Fixed Income Fundamentals",
			codeName: "FixedIncomeFundamentals"
		},
		{
			title: "Essays in Portfolio Management",
			codeName: "EssaysInPortfolioManagement"
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
		const permissionRepository = queryRunner.manager.getRepository(Permission);
		const roleRepository = queryRunner.manager.getRepository(Role);
		const userRepository = queryRunner.manager.getRepository(User);
		const companyRespository = queryRunner.manager.getRepository(Company);
		const productRepository = queryRunner.manager.getRepository(Product);
		const subscriptionRepository = queryRunner.manager.getRepository(Subscription);

		const permissions = await Promise.all(
			this.permissions.map(value => permissionRepository.save(permissionRepository.create(value)))
		);

		const roles = await Promise.all(
			this.roles.map(value => roleRepository.save(roleRepository.create(value)))
		);

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

		// Adding permissions to roles
		await Promise.all([
			roleRepository.save({ ...roles[0], permissions }),
			roleRepository.save({
				...roles[1],
				permissions: [permissions[0], permissions[2], permissions[4]]
			})
		]);

		// Adding roles to users
		await Promise.all([
			userRepository.save({ ...users[0], roles }),
			userRepository.save({ ...users[1], roles })
		]);

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
