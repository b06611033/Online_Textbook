import { Controller } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import SubscriptionService from "./subscription.service";

@ApiUseTags("subscriptions")
@Controller("subscriptions")
export default class SubscriptionController {
	public constructor(private readonly subscriptionService: SubscriptionService) {}
}
