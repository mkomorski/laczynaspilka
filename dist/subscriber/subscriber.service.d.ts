import { Repository } from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { SubscribeDto } from './dto/subscribe.dto';
export declare class SubscriberService {
    private readonly subscriberRepo;
    constructor(subscriberRepo: Repository<Subscriber>);
    subscribe(dto: SubscribeDto): Promise<{
        id: string;
        message: string;
    }>;
    findByMatchId(matchId: string): Promise<Subscriber[]>;
}
