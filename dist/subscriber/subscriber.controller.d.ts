import { SubscriberService } from './subscriber.service';
import { SubscribeDto } from './dto/subscribe.dto';
export declare class SubscriberController {
    private readonly subscriberService;
    constructor(subscriberService: SubscriberService);
    subscribe(dto: SubscribeDto): Promise<{
        id: string;
        message: string;
    }>;
}
