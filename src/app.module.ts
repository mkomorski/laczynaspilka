import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { StadiumModule } from './stadium/stadium.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    SubscriberModule,
    StadiumModule,
  ],
})
export class AppModule {}
