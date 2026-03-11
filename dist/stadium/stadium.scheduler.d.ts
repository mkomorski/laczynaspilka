import { StadiumService } from './stadium.service';
import { SubscriberService } from '../subscriber/subscriber.service';
export declare class StadiumScheduler {
    private readonly stadiumService;
    private readonly subscriberService;
    constructor(stadiumService: StadiumService, subscriberService: SubscriberService);
    checkStadium(): Promise<void>;
}
