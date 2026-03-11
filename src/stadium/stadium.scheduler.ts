import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StadiumService } from './stadium.service';
import { SubscriberService } from '../subscriber/subscriber.service';

const DEFAULT_MATCH_ID = 'PLAL26';

@Injectable()
export class StadiumScheduler {
  constructor(
    private readonly stadiumService: StadiumService,
    private readonly subscriberService: SubscriberService,
  ) {}

  @Cron('* * * * *') // co minutę
  async checkStadium() {
    const matchId = process.env.MATCH_ID ?? DEFAULT_MATCH_ID;
    try {
      const sectors = await this.stadiumService.getSectorsWithSeats(matchId);
      if (sectors.length > 0) {
        const ts = new Date().toISOString();
        console.log(`[${ts}] Mecz ${matchId}: wolne miejsca w ${sectors.length} sektorach`);
        sectors.forEach((s) => {
          console.log(`  - ${s.displayName} (${s.tribuneName}): ${s.availableSeats} miejsc`);
        });
        // Tutaj w przyszłości: pobrać subskrybentów i wysłać powiadomienia (email/SMS)
        const subscribers = await this.subscriberService.findByMatchId(matchId);
        if (subscribers.length > 0) {
          console.log(`  Subskrybenci do powiadomienia: ${subscribers.length}`);
        }
      }
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Błąd odpytywania ${matchId}:`, (err as Error).message);
    }
  }
}
