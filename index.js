const API_URL = 'https://bilety.laczynaspilka.pl/api/2/stadium/PLAL26/?mode=individual';
const INTERVAL_MS = 60 * 1000; // 1 minuta

const COOKIE = process.env.COOKIE ?? '_ga=GA1.1.72364010.1773045979; csrftoken=c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886; ticketing=l1z5g8ofq6iayavhbhse8imblcj4sd2w; captcha_cleared=true; _ga_TLR3M45HDE=GS2.1.s1773233520$o6$g0$t1773233520$j60$l0$h0; queue_user=90955bc8-19be-4618-b587-19c39d2e8a4a; permit_viewing=03fe8cbca001487235454569792bcdd6f10e5a750c1990b83ef57156';
const CSRF_TOKEN = process.env.CSRF_TOKEN ?? 'c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886';

const getHeaders = () => ({
  'Accept': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'pl-PL',
  'Connection': 'keep-alive',
  'Cookie': COOKIE,
  'Host': 'bilety.laczynaspilka.pl',
  'Referer': 'https://bilety.laczynaspilka.pl/order/PLAL26/second-step',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  'X-CSRFToken': CSRF_TOKEN,
  'X-Requested-With': 'XMLHttpRequest',
  'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
});

async function check() {
  const ts = new Date().toISOString();
  try {
    const res = await fetch(API_URL, { headers: getHeaders() });
    if (!res.ok) {
      console.error(`[${ts}] HTTP ${res.status}`);
      return;
    }
    const data = await res.json();
    const sectors = data.sectors ?? [];
    const withSeats = sectors.filter(s => (s.available_seats ?? 0) > 0);

    if (withSeats.length > 0) {
      console.log(`\n[${ts}] Wolne miejsca w ${withSeats.length} sektorach:`);
      withSeats.forEach(s => {
        console.log(`  - ${s.display_name ?? s.name} (${s.tribune_name ?? '?'}): ${s.available_seats} miejsc`);
      });
      console.log('');
    } else {
      console.log(`[${ts}] Brak wolnych miejsc (sektorów: ${sectors.length})`);
    }
  } catch (err) {
    console.error(`[${ts}] Błąd:`, err.message);
  }
}

console.log('Start odpytywania co minutę:', API_URL);
console.log('');

check();
setInterval(check, INTERVAL_MS);
