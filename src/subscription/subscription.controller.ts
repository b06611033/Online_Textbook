import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import SubscriptionService from "./subscription.service";

@ApiTags("subscriptions")
@Controller("subscriptions")
export default class SubscriptionController {
	public constructor(private readonly subscriptionService: SubscriptionService) {}
}
