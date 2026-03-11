import { Module } from '@nestjs/common';
import { StadiumService } from './stadium.service';
import { StadiumScheduler } from './stadium.scheduler';
import { SubscriberModule } from '../subscriber/subscriber.module';

@Module({
  imports: [SubscriberModule],
  providers: [StadiumService, StadiumScheduler],
  exports: [StadiumService],
})
export class StadiumModule {}
