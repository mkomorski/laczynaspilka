import { Body, Controller, Post } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller()
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    return this.subscriberService.subscribe(dto);
  }
}
