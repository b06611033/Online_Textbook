import { ApiUseTags } from "@nestjs/swagger";
import { Controller } from "@nestjs/common";
import CompanyService from "./company.service";

@ApiUseTags("companies")
@Controller("companies")
export default class CompanyController {
	public constructor(private readonly companyService: CompanyService) {}
}
