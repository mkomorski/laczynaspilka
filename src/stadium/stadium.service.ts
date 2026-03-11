import { Injectable } from '@nestjs/common';

const BASE_URL = 'https://bilety.laczynaspilka.pl/api/2/stadium';
const COOKIE = process.env.COOKIE ?? '_ga=GA1.1.72364010.1773045979; csrftoken=c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886; ticketing=l1z5g8ofq6iayavhbhse8imblcj4sd2w; captcha_cleared=true; _ga_TLR3M45HDE=GS2.1.s1773233520$o6$g0$t1773233520$j60$l0$h0; queue_user=90955bc8-19be-4618-b587-19c39d2e8a4a; permit_viewing=03fe8cbca001487235454569792bcdd6f10e5a750c1990b83ef57156';
const CSRF_TOKEN = process.env.CSRF_TOKEN ?? 'c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886';

export interface SectorWithSeats {
  name: string;
  displayName: string;
  tribuneName: string;
  availableSeats: number;
}

function getHeaders(matchId: string) {
  return {
    Accept: 'application/json',
    'Accept-Language': 'pl-PL',
    Cookie: COOKIE,
    Referer: `https://bilety.laczynaspilka.pl/order/${matchId}/second-step`,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    'X-CSRFToken': CSRF_TOKEN,
    'X-Requested-With': 'XMLHttpRequest',
  };
}

@Injectable()
export class StadiumService {
  async getSectorsWithSeats(matchId: string): Promise<SectorWithSeats[]> {
    const url = `${BASE_URL}/${matchId}/?mode=individual`;
    const res = await fetch(url, { headers: getHeaders(matchId) });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = (await res.json()) as { sectors?: Array<{ name: string; display_name?: string; tribune_name?: string; available_seats?: number }> };
    const sectors = data.sectors ?? [];
    return sectors
      .filter((s) => (s.available_seats ?? 0) > 0)
      .map((s) => ({
        name: s.name,
        displayName: s.display_name ?? s.name,
        tribuneName: s.tribune_name ?? '?',
        availableSeats: s.available_seats ?? 0,
      }));
  }
}
