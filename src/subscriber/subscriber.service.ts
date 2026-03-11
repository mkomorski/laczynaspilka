import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class SubscriberService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: SubscribeDto): Promise<{ id: string; message: string }> {
    const hasEmail = dto.email?.trim();
    const hasPhone = dto.phone?.trim();
    if (!hasEmail && !hasPhone) {
      throw new BadRequestException('Podaj email albo numer telefonu');
    }

    const matchId = dto.matchId.trim().toUpperCase();
    const email = hasEmail ? hasEmail : null;
    const phone = hasPhone ? hasPhone.replace(/\s/g, '') : null;

    const existing = await this.prisma.subscriber.findFirst({
      where: {
        matchId,
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existing) {
      return {
        id: existing.id,
        message: 'Już jesteś zapisany na ten mecz.',
      };
    }

    const saved = await this.prisma.subscriber.create({
      data: { email, phone, matchId },
    });
    return {
      id: saved.id,
      message: `Zapisano subskrypcję na mecz ${matchId}. O wolnych miejscach poinformujemy.`,
    };
  }

  async findByMatchId(matchId: string) {
    return this.prisma.subscriber.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
