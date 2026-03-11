require('dotenv').config();

const API_URL = 'https://bilety.laczynaspilka.pl/api/2/stadium/PLAL26/?mode=individual';
const INTERVAL_MS = 60 * 1000; // 1 minuta

const COOKIE = process.env.COOKIE ?? '_ga=GA1.1.72364010.1773045979; csrftoken=c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886; ticketing=l1z5g8ofq6iayavhbhse8imblcj4sd2w; captcha_cleared=true; _ga_TLR3M45HDE=GS2.1.s1773233520$o6$g0$t1773233520$j60$l0$h0; queue_user=90955bc8-19be-4618-b587-19c39d2e8a4a; permit_viewing=03fe8cbca001487235454569792bcdd6f10e5a750c1990b83ef57156';
const CSRF_TOKEN = process.env.CSRF_TOKEN ?? 'c4r0ZV6oxGEAC6RxnKwUMwDbizXzu886';

const JUSTSEND_BASE = 'https://justsend.io/api';
const JUSTSEND_APP_KEY = process.env.JUSTSEND_APP_KEY;
const NOTIFY_PHONES = (process.env.NOTIFY_PHONES ?? '')
  .split(',')
  .map((s) => s.trim().replace(/\s/g, ''))
  .filter(Boolean);

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

// Ostatni zapamiętany stan: sektor id -> liczba miejsc (tylko sektory z miejscami)
const lastNotifiedState = new Map();

/** Format daty dla JustSend: yyyy-MM-ddTHH:mm:ss+02:00 */
function formatSendDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const zh = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const zm = String(absOffset % 60).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}:${s}${sign}${zh}:${zm}`;
}

/**
 * Wysyłka SMS bulk przez JustSend API v3: POST /sender/bulk/send
 * Jedna wiadomość do wielu odbiorców (msisdn w formacie 48...).
 */
async function sendBulkSms(phones, message) {
  if (!JUSTSEND_APP_KEY) {
    console.warn('SMS pominięty – brak JUSTSEND_APP_KEY');
    return { ok: false, reason: 'no_api_key' };
  }
  if (phones.length === 0) return { ok: true };
  const url = `${JUSTSEND_BASE}/sender/bulk/send`;
  const body = {
    name: 'Laczynaspilka alert',
    bulkType: 'STANDARD',
    bulkVariant: 'ECO',
    sender: 'LACZYNASP',
    message,
    sendDate: formatSendDate(),
    groupIds: [],
    recipients: [phones[0]].map((p) => ({ msisdn: String(p).replace(/^\+/, '') })),
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Key': JUSTSEND_APP_KEY,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`JustSend SMS bulk błąd ${res.status}:`, data);
      return { ok: false, status: res.status, data };
    }
    return { ok: true, data };
  } catch (err) {
    console.error('JustSend SMS bulk wyjątek:', err.message);
    return { ok: false, err: err.message };
  }
}

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

    const currentState = new Map(withSeats.map(s => [s.id, { seats: s.available_seats, name: s.display_name ?? s.name, tribune: s.tribune_name ?? '?' }]));

    const changed = withSeats.filter(s => lastNotifiedState.get(s.id)?.seats !== s.available_seats);
    const totalSeats = withSeats.reduce((acc, s) => acc + (s.available_seats ?? 0), 0);

    if (changed.length > 0 && totalSeats > 1) {
      console.log(`\n[${ts}] Wolne miejsca (zmiana) – ${changed.length} sektorów, łącznie ${totalSeats} miejsc:`);
      changed.forEach(s => {
        console.log(`  - ${s.display_name ?? s.name} (${s.tribune_name ?? '?'}): ${s.available_seats} miejsc`);
      });
      const smsText = [
        'Laczynaspilka: wolne miejsca!',
        ...changed.slice(0, 5).map((s) => `${s.display_name ?? s.name}: ${s.available_seats}`),
        changed.length > 5 ? `+${changed.length - 5} sekt.` : '',
        'bilety.laczynaspilka.pl',
      ]
        .filter(Boolean)
        .join(' ');
      await sendBulkSms(NOTIFY_PHONES, smsText);
      console.log('');
    }

    lastNotifiedState.clear();
    currentState.forEach((v, k) => lastNotifiedState.set(k, v));

    if (withSeats.length === 0) {
      console.log(`[${ts}] Brak wolnych miejsc (sektorów: ${sectors.length})`);
    }
  } catch (err) {
    console.error(`[${ts}] Błąd:`, err.message);
  }
}

console.log('Start odpytywania co minutę:', API_URL);
if (JUSTSEND_APP_KEY && NOTIFY_PHONES.length > 0) {
  console.log('SMS JustSend włączone, numery:', NOTIFY_PHONES.join(', '));
} else if (NOTIFY_PHONES.length > 0) {
  console.log('Ustaw JUSTSEND_APP_KEY, aby włączyć wysyłkę SMS na:', NOTIFY_PHONES.join(', '));
}
console.log('');

check();
setInterval(check, INTERVAL_MS);
