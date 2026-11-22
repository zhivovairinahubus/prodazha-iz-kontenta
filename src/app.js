// Прототип «Продажа из контента»: 4 сценария + VK Академия. Без бэкенда, прогресс курсов в localStorage.
const app = document.getElementById('app');
const view = document.getElementById('view');
const layer = document.getElementById('layer');
let store;
try { store = JSON.parse(localStorage.getItem('vkacad') || 'null'); } catch (e) { store = null; }
if (!store || !store.done) store = { done: {}, passed: {} };
const save = () => { try { localStorage.setItem('vkacad', JSON.stringify(store)); } catch (e) {} };
const S = { step: 0, deliv: [true, true, false], pay: 0, checkout: false, promo: 0, goal: 0, budget: 3000, launched: false, filter: 'all', ans: {}, fin: {}, finChecked: {}, playing: '', weight: 450, size: 'M', chk: {} };

// ---------- иконки ----------
const I = {
  back: '<svg width="28" height="28" viewBox="0 0 28 28"><path d="M17.5 5.5 9 14l8.5 8.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg width="26" height="26" viewBox="0 0 28 28"><path d="M7 7l14 14M21 7 7 21" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  chev: '<svg width="8" height="13" viewBox="0 0 8 13"><path d="M1.5 1.5 6.5 6.5l-5 5" fill="none" stroke="#B8C1CC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  tick: (c = '#fff', s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  play: (c = '#0077FF', s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z" fill="${c}"/></svg>`,
  doc: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z" fill="#fff" stroke="#45678F" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M10 13h6M10 16.5h6" stroke="#45678F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  target: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#3A9A3A" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="#3A9A3A" stroke-width="2"/><circle cx="12" cy="12" r="1.5" fill="#3A9A3A"/></svg>',
  msg: '<svg width="26" height="26" viewBox="0 0 28 28"><path d="M14 4.5C8.2 4.5 3.8 8.4 3.8 13.2c0 2.6 1.3 4.9 3.4 6.5L6.4 24l4.6-2.4c.9.2 1.9.3 3 .3 5.8 0 10.2-3.9 10.2-8.7S19.8 4.5 14 4.5Z" fill="none" stroke="#0077FF" stroke-width="2.1" stroke-linejoin="round"/></svg>',
  cart: '<svg width="26" height="26" viewBox="0 0 28 28"><path d="M4 5h3l2.6 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.5L24 9H8.2" fill="none" stroke="#0077FF" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="23" r="1.7" fill="#0077FF"/><circle cx="20" cy="23" r="1.7" fill="#0077FF"/></svg>',
  shield: '<svg width="24" height="24" viewBox="0 0 28 28"><path d="M14 3.5 5 7v6.4c0 5.6 3.8 9.6 9 11.1 5.2-1.5 9-5.5 9-11.1V7l-9-3.5Z" fill="#0077FF"/><path d="M9.8 14.2l3 3 5.6-6" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  box: '<svg width="24" height="24" viewBox="0 0 28 28"><path d="M4.5 9 14 4.5 23.5 9v10L14 23.5 4.5 19V9Z M4.5 9 14 13.5 23.5 9 M14 13.5v10" fill="none" stroke="#0077FF" stroke-width="2" stroke-linejoin="round"/></svg>',
  star: '<svg width="15" height="15" viewBox="0 0 20 20"><path d="M10 1.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6L10 14.5l-5 2.7 1-5.6L1.9 7.7l5.6-.7L10 1.8Z" fill="#FFA000"/></svg>',
  heart: '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="#fff"/></svg>',
  comment: '<svg width="30" height="30" viewBox="0 0 28 28"><path d="M14 4.5C8.2 4.5 3.8 8.4 3.8 13.2c0 2.6 1.3 4.9 3.4 6.5L6.4 24l4.6-2.4c.9.2 1.9.3 3 .3 5.8 0 10.2-3.9 10.2-8.7S19.8 4.5 14 4.5Z" fill="#fff"/></svg>',
  share: '<svg width="30" height="30" viewBox="0 0 28 28"><path d="M14 4v13M8.5 9.5 14 4l5.5 5.5M6 15v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cap: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5L2 9Z" fill="#0077FF"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" fill="none" stroke="#0077FF" stroke-width="2"/></svg>'
};
const candle = (w) => `<svg width="${w}" height="${Math.round(w * 1.15)}" viewBox="0 0 200 230"><use href="#candle"/></svg>`;
const sb = (dark) => `<div class="sb${dark ? ' dark' : ''}"><span>9:41</span><span style="display:flex;gap:6px;align-items:center"><svg width="18" height="12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="26" height="12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2.5" y="2.5" width="16" height="7" rx="2" fill="currentColor"/></svg></span></div>`;
const nav = (t, sub, back, help) => `<div class="nav"><a class="nb blue" href="${back}" aria-label="Назад">${I.back}</a><div class="t">${t}${sub ? `<small>${sub}</small>` : ''}</div>${help ? `<button class="qb" data-help="${help}" aria-label="Обучение">?</button>` : '<span style="width:36px"></span>'}</div>`;
const q = (k) => `<span class="q" role="button" tabindex="0" data-tip="${k}" aria-label="Подсказка">?</span>`;
const nb = (s) => s.toLocaleString('ru-RU').replace(/ /g, ' ');

// ---------- обложки курсов ----------
const ILL = {
  ads: '<svg class="ill" width="150" height="120" viewBox="0 0 150 120"><rect x="22" y="14" width="74" height="96" rx="14" fill="rgba(255,255,255,.22)"/><rect x="30" y="24" width="58" height="62" rx="8" fill="rgba(255,255,255,.35)"/><path d="M52 44v22l18-11-18-11Z" fill="#fff"/><rect x="30" y="92" width="58" height="10" rx="5" fill="#fff"/><path d="M104 40l28-14v52l-28-14Z" fill="#fff"/><rect x="96" y="40" width="12" height="24" rx="3" fill="#fff"/></svg>',
  delivery: '<svg class="ill" width="150" height="120" viewBox="0 0 150 120"><path d="M20 50l34-16 34 16v38L54 104 20 88Z" fill="rgba(255,255,255,.3)"/><path d="M20 50l34 16 34-16M54 66v38" stroke="#fff" stroke-width="3" fill="none"/><rect x="92" y="62" width="34" height="26" rx="4" fill="#fff"/><path d="M126 70h10l8 10v8h-18Z" fill="#fff"/><circle cx="104" cy="92" r="6" fill="#2F5D46" stroke="#fff" stroke-width="3"/><circle cx="134" cy="92" r="6" fill="#2F5D46" stroke="#fff" stroke-width="3"/></svg>',
  card: '<svg class="ill" width="150" height="120" viewBox="0 0 150 120"><rect x="40" y="8" width="70" height="112" rx="12" fill="rgba(255,255,255,.3)"/><rect x="48" y="18" width="54" height="44" rx="6" fill="#fff"/><path d="M75 26c4 5 6 9 6 12 0 3.5-2.7 6-6 6s-6-2.5-6-6c0-3 2-7 6-12Z" fill="#FF9F6B"/><rect x="48" y="70" width="34" height="6" rx="3" fill="#fff"/><rect x="48" y="82" width="22" height="6" rx="3" fill="rgba(255,255,255,.7)"/><rect x="48" y="96" width="54" height="14" rx="7" fill="#fff"/><circle cx="124" cy="34" r="14" fill="#fff"/><path d="M118 34l4 4 8-8" stroke="#FF7A45" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  stats: '<svg class="ill" width="150" height="120" viewBox="0 0 150 120"><rect x="24" y="70" width="18" height="40" rx="4" fill="rgba(255,255,255,.45)"/><rect x="50" y="52" width="18" height="58" rx="4" fill="rgba(255,255,255,.65)"/><rect x="76" y="34" width="18" height="76" rx="4" fill="#fff"/><rect x="102" y="14" width="18" height="96" rx="4" fill="#fff"/><path d="M20 58 58 38l26 10 42-36" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  reviews: '<svg class="ill" width="150" height="120" viewBox="0 0 150 120"><path d="M34 22h86a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H66l-22 18V86H34a12 12 0 0 1-12-12V34a12 12 0 0 1 12-12Z" fill="rgba(255,255,255,.3)"/><g fill="#fff"><path d="M48 44l4 8 9 1-6.5 6 1.6 9-8.1-4.4-8.1 4.4 1.6-9L35 53l9-1Z"/><path d="M78 44l4 8 9 1-6.5 6 1.6 9-8.1-4.4-8.1 4.4 1.6-9L65 53l9-1Z"/><path d="M108 44l4 8 9 1-6.5 6 1.6 9-8.1-4.4-8.1 4.4 1.6-9L95 53l9-1Z"/></g></svg>'
};
const FMT_ICON = { video: I.play('#fff', 14), text: '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 5h14M5 10h14M5 15h9" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>', practice: '<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>' };
const cover = (c, h = 150) => `<div class="cover" style="height:${h}px;background:${c.bg}">${ILL[c.id]}<span class="fmt">${FMT_ICON[c.fmt]}${c.fmtL}</span><span class="cdur">${c.lessons.length} ${plural(c.lessons.length, 'урок', 'урока', 'уроков')} · ${c.min} мин</span></div>`;
function plural(n, a, b, c) { const m = n % 10, h = n % 100; if (m === 1 && h !== 11) return a; if (m >= 2 && m <= 4 && (h < 12 || h > 14)) return b; return c; }
const doneOf = (cid) => (store.done[cid] || []);
const progressOf = (cid) => Math.round(100 * doneOf(cid).length / COURSES[cid].lessons.length);

// ---------- «?» → шторка «Пройдите обучение» ----------
const HELP = { launch: 'delivery', weight: 'delivery', pay: 'delivery', product: 'card', guarantee: 'card', reviews: 'reviews', done: 'reviews', promote: 'ads', goal: 'ads', budget: 'ads', stats: 'stats' };
function openHelp(key) {
  const c = COURSES[HELP[key] || key];
  layer.innerHTML = `<div class="ov" data-act="closeSheet"></div><div class="sheet"><div class="grab"></div>
    <div class="hlbl">Пройдите обучение</div>
    <div style="margin-top:10px">${cover(c, 120)}</div>
    <h2 style="margin-top:14px">${c.title}</h2>
    <div class="gray" style="font-size:14px;margin-top:4px">${c.fmtL} · ${c.lessons.length} ${plural(c.lessons.length, 'урок', 'урока', 'уроков')} · ${c.min} минут · итоговый тест и сертификат</div>
    <p style="font-size:15px;line-height:1.4;margin-top:10px">${c.desc}</p>
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px"><a class="btn lg" href="#/academy?rec=${c.id}" data-act="closeSheet">Начать обучение</a><button class="btn sec" data-act="closeSheet">Не сейчас</button></div></div>`;
}
function closeSheet() { layer.innerHTML = ''; }
// ---------- подсказки «?» у полей: 1–2 фразы + ссылка на урок ----------
const TIPS = {
  wiz0: ['Шаг 1 из 4. Товары', 'Проверяем товары, которые VK собрал из ваших клипов и постов. Снимите лишнее и проверьте цену.', 'card', 0],
  wiz1: ['Шаг 2 из 4. Доставка', 'Выбираем, как покупатель получит заказ. Цену доставки VK посчитает сам по весу товара.', 'delivery', 0],
  wiz2: ['Шаг 3 из 4. Оплата', 'Подключаем оплату внутри VK: покупатель платит прямо в карточке, а не переводом в сообщениях.', 'delivery', 2],
  wiz3: ['Шаг 4 из 4. Готово', 'Товары, доставка и оплата подключены, карточки готовы к продаже. Следующий шаг — первая реклама.', 'ads', 0],
  fromposts: ['Товары из публикаций', 'Если к клипу или посту прикреплён товар, он сам попадает в Магазин с фото и ценой из публикации.', 'card', 0],
  pvz: ['Пункты выдачи', 'Почта России, СДЭК и Boxberry: вы сдаёте посылку в отделение, покупатель забирает рядом с домом. Тариф VK считает сам.', 'delivery', 0],
  self: ['Самовывоз', 'Покупатель забирает заказ у вас по адресу из настроек сообщества. Доставка для него бесплатная.', 'delivery', 0],
  courier: ['Своя курьерская доставка', 'Вы сами возите заказы по городу. Укажите зону и цену, покупатель увидит её в карточке.', 'delivery', 0],
  weight: ['Вес в упаковке', 'Указывайте вес вместе с коробкой: по нему VK считает доставку. Свеча 200 мл в упаковке — около 450 г.', 'delivery', 1],
  size: ['Габариты коробки', 'Длина, ширина и высота коробки в сантиметрах. Чем больше коробка, тем дороже доставка.', 'delivery', 1],
  shipview: ['Что увидит покупатель', 'Минимальную цену доставки и срок прямо в карточке, ещё до оформления заказа.', 'card', 1],
  vkpay: ['VK Pay', 'Платёжный сервис ВКонтакте: покупатель платит по СБП, картой или из VK Кошелька, не выходя из приложения.', 'delivery', 2],
  guarantee: ['Гарантия сделки', 'Деньги покупателя хранятся в VK и приходят продавцу после того, как заказ получен. Поэтому покупатель не боится платить.', 'delivery', 2],
  commission: ['Комиссия 5%', 'Берётся только с оплаченных заказов, всё включено: приём оплаты и гарантия. Нет заказов — нет комиссии.', 'delivery', 2],
  payout: ['Счёт для выплат', 'Расчётный счёт или карта, куда VK переводит деньги за полученные заказы.', 'delivery', 2],
  nextad: ['Первая реклама', 'Когда магазин готов, товар можно продвигать прямо из клипа. Курс покажет, как это сделать за 3 шага.', 'ads', 0],
  shipcalc: ['Доставка от 199 ₽', 'Минимальная цена доставки до пункта выдачи рядом с вами. Точную сумму покажем при оформлении.', 'delivery', 0],
  rating: ['Отзывы «купил в VK»', 'Их оставляют только те, кто оплатил и получил заказ в VK, поэтому им можно доверять.', 'reviews', 0],
  pickup: ['Пункт выдачи · 3–5 дней', 'Срок, за который посылка дойдёт до пункта выдачи. Адрес выберете при оформлении.', 'delivery', 0],
  total: ['Итого', 'Цена товара и доставки. Комиссию 5% платит продавец, для покупателя цена не меняется.', 'delivery', 2],
  status: ['Статусы заказа', 'Показывают, где сейчас заказ. Продавец и покупатель видят одни и те же статусы.', 'reviews', 0],
  release: ['Когда продавец получит деньги', 'Как только вы заберёте заказ. Если товар не пришёл, деньги вернутся вам.', 'delivery', 2],
  askreview: ['Отзыв после покупки', 'Через 1–2 дня после получения VK попросит оценить товар. Отзыв увидят другие покупатели.', 'reviews', 0],
  promo: ['Продвигать товар', 'Реклама товара прямо из клипа: объявление соберётся из публикации, нужно выбрать только цель и бюджет.', 'ads', 1],
  autoad: ['Объявление из клипа', 'VK взял видео, текст и карточку товара из этого клипа. Рисовать баннер и писать текст не нужно.', 'ads', 1],
  preview: ['Как увидят объявление', 'Так объявление появится в ленте и клипах у людей, похожих на ваших покупателей.', 'ads', 1],
  goal: ['Цель', '«Заказы в VK» показывает рекламу тем, кто вероятнее купит, и считает результат в заказах. «Охват» считает только показы.', 'ads', 0],
  audience: ['Аудитория', 'VK сам подбирает людей, похожих на тех, кто уже покупал такие товары. Настраивать интересы и возраст не нужно.', 'ads', 0],
  bid: ['Ставка', 'Цену за показ VK подбирает автоматически в пределах бюджета. Разбираться в аукционе не нужно.', 'ads', 2],
  budget: ['Бюджет', 'Сколько вы готовы потратить за 7 дней. Больше этой суммы не спишем, неизрасходованный остаток не тратится.', 'ads', 2],
  forecast: ['Прогноз результата', 'Сколько заказов ожидать при таком бюджете. Считаем по продажам похожих товаров в VK, это оценка, а не гарантия.', 'ads', 2],
  cpo: ['Цена заказа', 'Сколько рекламы приходится на один заказ: бюджет, делённый на число заказов. Сравните её с вашей наценкой.', 'stats', 2],
  reach: ['Показы', 'Сколько раз объявление увидят. При цели «Охват» заказы не считаются.', 'ads', 0],
  billing: ['Как списываются деньги', 'По мере показов и не больше бюджета. Остановить продвижение можно в любой момент.', 'ads', 2],
  results: ['Когда ждать результат', 'Первые показы — через несколько часов, заказы обычно приходят в первые 1–3 дня. Всё видно в статистике.', 'stats', 0],
  result: ['Результат продвижения', 'Сколько заказов оплачено после показа рекламы и сколько это стоило. Сравните с прогнозом.', 'stats', 0],
  revenue: ['Выручка', 'Сумма оплаченных заказов из рекламы: 6 свечей по 1 290 ₽, без учёта доставки.', 'stats', 2],
  funnel: ['Путь покупателя', 'Четыре шага от показа до оплаты. Где резкий провал, там и проблема: в публикации, карточке или оплате.', 'stats', 0],
  impr: ['Показы', 'Сколько раз клип и пост с рекламой увидели в ленте.', 'stats', 0],
  ctr: ['CTR', 'Доля тех, кто открыл карточку после показа: 212 из 18 400 ≈ 1,2%. Зависит от публикации: видео и первой строки текста.', 'stats', 0],
  cr: ['Конверсия в покупку', 'Доля открывших карточку, кто нажал «Купить в VK»: 11 из 212 ≈ 5%. Зависит от цены, доставки и фото.', 'card', 1],
  paid: ['Оплатили', 'Заказы, оплаченные через VK Pay. Только их считаем результатом рекламы.', 'stats', 0],
  bypost: ['Какая публикация продала', 'Заказы и цена заказа по каждому клипу и посту. Продвигайте те, что продают дешевле.', 'stats', 1],
  markup: ['Наценка', 'Сколько вы зарабатываете на одной продаже сверх себестоимости. Если цена заказа ниже наценки, реклама окупается.', 'stats', 2]
};
function openTip(el, key) {
  const t = TIPS[key]; if (!t) return;
  const [title, text, cid, li] = t, les = COURSES[cid].lessons[li];
  layer.innerHTML = `<div class="popov" data-act="closeSheet"></div><div class="pop" role="dialog" aria-label="${title}"><div class="pt">${title}</div><div class="px">${text}</div><a class="pl" href="#/course/${cid}/${li}">Подробнее в курсе: «${les.title}» →</a></div>`;
  const pop = layer.querySelector('.pop'), ar = app.getBoundingClientRect(), br = el.getBoundingClientRect();
  const w = Math.min(300, ar.width - 24); pop.style.width = w + 'px';
  let left = br.left - ar.left + br.width / 2 - w / 2; left = Math.max(12, Math.min(left, ar.width - w - 12));
  const h = pop.offsetHeight; let top = br.bottom - ar.top + 8;
  if (top + h > ar.height - 12) top = br.top - ar.top - h - 8;
  pop.style.left = left + 'px'; pop.style.top = Math.max(12, top) + 'px';
}
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; app.appendChild(d); setTimeout(() => d.remove(), 2200); }

// ---------- главная ----------
function Home() {
  const card = (href, chip, t, tx) => `<a class="hc" href="${href}"><div style="flex:1"><span class="chip">${chip}</span><div class="tt">${t}</div><div class="tx">${tx}</div></div>${I.chev}</a>`;
  return `${sb()}<div class="body" style="background:#EBEDF0"><div class="sb" style="display:none"></div>
  <div class="hero"><div class="k">VK Case Champ 2026 · Команда 1</div><h1>Продажа из контента</h1><p>Кликабельный прототип четырёх сценариев и обучения для бизнес-сообществ во ВКонтакте</p></div>
  <div class="hcards">
    <div class="hyp"><div class="lb">Гипотеза команды</div><p>Бизнес с товарами пробует рекламу несколько раз и бросает: настройка сложная, инструкцию не найти, нужны спецзнания, заказов не видно.</p>
      <div class="bar"><a href="#/promote">Сложная настройка → реклама в 3 шага</a><a href="#/academy">Инструкцию не найти → «?» на экране</a><a href="#/academy">Нужны спецзнания → курсы</a><a href="#/stats">Заказов не видно → статистика</a></div></div>
    ${card('#/launch', 'Магазин за 10 минут', 'Запуск продаж за 10 минут', 'Витрина, доставка и оплата одним мастером. Сейчас доставку настроили 20% витрин, оплату — 5,4%')}
    ${card('#/product', 'Кнопка «Купить в VK» · Оплата с гарантией', 'Карточка «Купить в VK»', 'Цена с доставкой, оплата через VK Pay и гарантия сделки. Сейчас кнопку в карточке нажимают 3,1% открывших')}
    ${card('#/promote', 'Реклама в 3 шага', 'Продвигать товар из клипа', 'Реклама товара в 3 шага с прогнозом заказов, а не охвата. Сейчас 92% рекламодателей без заказов в VK')}
    ${card('#/stats', 'Статистика заказов', 'Статистика «публикация → заказ»', 'Видно, какой клип или пост привёл покупателя и сколько стоил заказ')}
    ${card('#/academy', 'Курс VK Академии', 'Обучение: «?» на каждом экране и 5 курсов', 'Видео, тексты и практика, тест после каждого урока, итоговый тест и сертификат')}
  </div>
  <div class="disc">Сообщество «Тёплый воск», цены, прогнозы и курсы — пример интерфейса. Цифры о текущем состоянии — датасет VK Case Champ 2026. На каждом экране кнопка «?» открывает обучение.</div></div>`;
}

// ---------- Магазин за 10 минут: мастер запуска продаж ----------
const STEPS = ['Товары', 'Доставка', 'Оплата', 'Готово'];
function Launch() {
  const st = S.step;
  const head = `${sb()}${nav('Запуск продаж', 'Тёплый воск', st ? '#/launch' : '#/', 'launch')}
    <div class="steps">${STEPS.map((s, i) => `<div><i class="${i <= st ? 'on' : ''}"></i><span class="${i === st ? 'on' : ''}">${s}</span></div>`).join('')}</div>
    <div class="left">${st < 3 ? `Осталось ${3 - st} ${plural(3 - st, 'шаг', 'шага', 'шагов')} · около ${[10, 7, 4][st]} минут` : 'Готово к продажам'}${q('wiz' + st)}</div>`;
  let body = '', foot = '';
  if (st === 0) {
    const items = [['Свеча «Хвоя», 200 мл', '1 290 ₽'], ['Свеча «Лаванда», 200 мл', '1 290 ₽'], ['Набор «Три аромата»', '3 490 ₽']];
    body = `<div class="info"><b>12 товаров готовы.</b>${q('fromposts')} Карточки собраны из ваших публикаций с фото и ценой. Проверьте и снимите лишнее.</div>
      <div class="grp">${items.map(([n, p]) => `<div class="cell"><div class="thumb">${candle(34)}</div><div class="l">${n}<div class="sub">${p} · из клипа</div></div><div class="chk on">${I.tick()}</div></div>`).join('')}
      <div class="cell"><div class="l blue">Ещё 9 товаров</div>${I.chev}</div></div>
      <div class="note">Товары, прикреплённые к клипам и постам, попадают в Магазин сообщества автоматически.</div>`;
    foot = `<button class="btn lg" data-act="step" data-v="1">Далее: доставка</button>`;
  } else if (st === 1) {
    const ops = [['Пункты выдачи', 'Почта России, СДЭК, Boxberry. Тариф рассчитывается автоматически', true, 'pvz'], ['Самовывоз', 'Адрес из настроек: ул. Садовая, 14', false, 'self'], ['Своя курьерская доставка', 'Укажите зону и цену доставки по городу', false, 'courier']];
    body = `<div style="padding:16px 16px 0;background:#fff"><h2>Как покупатели получат заказ?</h2><div class="gray" style="font-size:14px;margin-top:4px;padding-bottom:14px">Выберите хотя бы один способ. Стоимость доставки покупатель увидит в карточке товара</div></div>
      <div class="grp">${ops.map(([t, s, r, k], i) => `<button class="cell" data-act="deliv" data-v="${i}"><div class="chk ${S.deliv[i] ? 'on' : ''}">${S.deliv[i] ? I.tick() : ''}</div><div class="l">${t}${q(k)}${r ? '<span class="rec">Рекомендуем</span>' : ''}<div class="sub">${s}</div></div></button>`).join('')}</div>
      <div class="gh">Посылка</div>
      <div class="grp" style="margin-top:4px"><div class="cell"><div class="l">Вес в упаковке${q('weight')}</div><div class="v" style="color:#000">450 г</div></div><div class="cell"><div class="l">Габариты коробки${q('size')}</div><div class="v" style="color:#000">10 × 10 × 12 см</div></div></div>
      <div class="info">Покупатель увидит${q('shipview')}: <b>доставка от 199 ₽ · 3–5 дней</b> в пункт выдачи рядом с домом.</div>`;
    foot = `<button class="btn lg" data-act="step" data-v="2">Далее: оплата</button>`;
  } else if (st === 2) {
    const pays = ['СБП', 'Карта', 'VK Кошелёк'];
    body = `<div style="padding:16px 16px 14px;background:#fff"><h2 style="display:flex;align-items:center">Принимайте оплату в VK ${q('vkpay')}</h2><div class="gray" style="font-size:14px;margin-top:4px">Покупатель платит через VK Pay, не выходя из ВКонтакте</div>
      <div style="display:flex;gap:6px;margin-top:12px">${pays.map(p => `<span class="pill">${p}</span>`).join('')}</div></div>
      <div class="grp"><div class="cell" style="align-items:flex-start;padding-top:4px">${'<div style="padding-top:12px">' + I.shield + '</div>'}<div class="l"><b>Гарантия сделки</b>${q('guarantee')}<div class="sub">Деньги приходят вам после того, как покупатель получил заказ. Покупатели спокойнее платят незнакомому продавцу</div></div></div>
      <div class="cell"><div class="l">Комиссия${q('commission')}</div><div class="v" style="color:#000">5% с оплаченного заказа</div></div>
      <div class="cell"><div class="l">Счёт для выплат${q('payout')}</div><div class="v">Указать ${I.chev}</div></div></div>
      <div class="note">В прототипе ничего не подключается и не списывается.</div>`;
    foot = `<button class="btn lg" data-act="step" data-v="3">Подключить оплату</button>`;
  } else {
    body = `<div style="background:#fff;padding-bottom:20px;text-align:center"><div class="donebig">${I.tick('#fff', 44)}</div><h2 style="margin-top:14px">Магазин готов к продажам</h2><div class="gray" style="font-size:14px;margin:6px 24px 0">Теперь в карточках есть цена с доставкой и кнопка «Купить в VK»</div></div>
      <div class="grp">${['12 товаров из публикаций', 'Доставка: пункты выдачи и самовывоз', 'Оплата VK Pay с гарантией сделки'].map(t => `<div class="cell"><div class="ok-dot">${I.tick('#fff', 14)}</div><div class="l">${t}</div></div>`).join('')}</div>
      <div class="grp"><a class="cell" href="#/academy?rec=ads"><div style="padding:10px 0">${I.cap}</div><div class="l"><b>Следующий шаг: первая реклама</b>${q('nextad')}<div class="sub">Курс «Реклама товара за 3 шага» · 12 минут</div></div>${I.chev}</a></div>`;
    foot = `<a class="btn lg" href="#/product">Посмотреть карточку товара</a><a class="btn sec" href="#/promote">Продвигать товар из клипа</a>`;
  }
  return `${head}<div class="body">${body}<div style="height:16px"></div></div><div class="foot">${foot}</div>`;
}

// ---------- Кнопка «Купить в VK» + Оплата с гарантией: карточка и оплата ----------
function Product() {
  const pays = ['СБП', 'Карта', 'VK Кошелёк'];
  let sheet = '';
  if (S.checkout) sheet = `<div class="ov" data-act="checkout" data-v="0"></div><div class="sheet"><div class="grab"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><h2>Оформление заказа</h2><button class="nb gray" data-act="checkout" data-v="0" aria-label="Закрыть">${I.close}</button></div>
    <div style="display:flex;gap:12px;align-items:center;margin-top:10px"><div class="thumb">${candle(34)}</div><div style="flex:1"><b>Свеча «Хвоя», 200 мл</b><div class="sub">Тёплый воск · 1 шт.</div></div><b>1 290 ₽</b></div>
    <div class="gh" style="padding-left:0">Доставка${q('pvz')}</div>
    <div style="display:flex;gap:10px;align-items:center">${I.box}<div style="flex:1;font-size:15px">Пункт выдачи СДЭК, ул. Ленина, 8<div class="sub">3–5 дней</div></div><b>199 ₽</b></div>
    <div class="gh" style="padding-left:0">Оплата VK Pay${q('vkpay')}</div>
    <div style="display:flex;gap:6px">${pays.map((p, i) => `<button class="pill ${S.pay === i ? 'on' : ''}" data-act="pay" data-v="${i}">${p}</button>`).join('')}</div>
    <div style="display:flex;gap:10px;align-items:flex-start;margin-top:14px;background:#F5F9FF;border-radius:12px;padding:10px 12px">${I.shield}<div style="font-size:13.5px;line-height:1.35"><b>Гарантия сделки</b>${q('guarantee')}<br>Продавец получит деньги после того, как вы заберёте заказ</div></div>
    <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:17px"><b style="display:flex;align-items:center">Итого${q('total')}</b><b>1 489 ₽</b></div>
    <a class="btn lg" style="margin-top:12px" href="#/done">Оплатить 1 489 ₽</a></div>`;
  return `${sb()}${nav('Товар', 'Тёплый воск', '#/', 'product')}<div class="body" style="background:#fff">
    <div class="prod-img">${candle(200)}<div class="dots"><i></i><i></i><i></i><i></i></div></div>
    <div style="padding:14px 16px 0"><div style="display:flex;align-items:baseline;gap:8px"><span class="price">1 290 ₽</span><span class="gray" style="font-size:14px">+ доставка от 199 ₽${q('shipcalc')}</span></div>
      <div style="font-size:17px;margin-top:4px">Свеча из соевого воска «Хвоя», 200 мл</div>
      <div style="display:flex;gap:4px;align-items:center;margin-top:6px;font-size:14px">${I.star}<b>4,9</b><span class="gray">· 37 отзывов «купил в VK»</span>${q('rating')}</div></div>
    <div class="grp" style="margin:12px 16px 0;background:#F5F9FF"><div class="cell" style="padding:0 12px">${I.shield}<div class="l" style="font-size:14px"><b>Гарантия сделки VK.</b>${q('guarantee')} Продавец получит деньги, когда вы заберёте заказ</div></div></div>
    <div class="grp" style="margin:8px 16px 0;background:#F5F6F8"><div class="cell" style="padding:0 12px">${I.box}<div class="l" style="font-size:14px">Пункт выдачи · 3–5 дней${q('pickup')}</div><div class="v" style="color:#000;font-weight:600">199 ₽</div></div></div>
    <div class="gh">Описание</div><div style="padding:0 16px;font-size:15px;line-height:1.4">Ручная работа, хлопковый фитиль, время горения около 40 часов. Аромат хвои и кедра.</div>
    <div style="height:20px"></div></div>
    <div class="foot" style="flex-direction:row;align-items:center"><button class="ib" data-act="toast" data-v="Откроется чат с продавцом">${I.msg}</button><button class="ib" data-act="toast" data-v="Товар добавлен в корзину">${I.cart}</button><button class="btn lg" style="flex:1;flex-direction:column;gap:0;line-height:1.15" data-act="checkout" data-v="1">Купить в VK<span style="font-size:12px;font-weight:500;opacity:.85">1 489 ₽ с доставкой</span></button></div>${sheet}`;
}
function Done() {
  const st = [['Оплачен через VK Pay', true], ['Передан в доставку', false], ['В пункте выдачи', false], ['Получен — деньги уйдут продавцу', false]];
  return `${sb()}${nav('Заказ № 4821', 'Тёплый воск', '#/product', 'done')}<div class="body">
    <div style="background:#fff;padding-bottom:18px;text-align:center"><div class="donebig">${I.tick('#fff', 44)}</div><h2 style="margin-top:14px">Заказ оплачен</h2><div class="gray" style="font-size:14px;margin:6px 28px 0">1 489 ₽ · продавец получит деньги после того, как вы заберёте заказ</div></div>
    <div class="gh">Статус${q('status')}</div><div class="grp" style="margin-top:4px">${st.map(([t, d], i) => `<div class="cell">${d ? `<div class="ok-dot">${I.tick('#fff', 14)}</div>` : '<div class="num-dot"></div>'}<div class="l ${d ? '' : 'gray'}">${t}${i === 3 ? q('release') : ''}</div></div>`).join('')}</div>
    <div class="note">После получения мы попросим оставить отзыв «купил в VK» ${q('askreview')}</div></div>
    <div class="foot"><a class="btn lg" href="#/">На главную</a><a class="btn sec" href="#/product">Вернуться к товару</a></div>`;
}

// ---------- Реклама в 3 шага: продвигать товар из клипа ----------
function fc(b) { const lo = Math.max(1, Math.round(b / 750)), hi = Math.max(lo + 1, Math.round(b / 430)); return { lo, hi }; }
function Promote() {
  const { lo, hi } = fc(S.budget);
  let sheet = '';
  if (S.promo === 1) sheet = `<div class="sheet" style="max-height:none"><div class="grab"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:19px;font-weight:700;display:flex;align-items:center">Продвигать товар${q('promo')}</div><span class="gray" style="font-size:13px;font-weight:600">Шаг 1 из 3</span></div>
    <div style="margin-top:12px;display:flex;gap:12px;align-items:center;background:#F5F9FF;border-radius:12px;padding:10px"><div class="thumb">${candle(34)}</div><div style="flex:1;font-size:14px"><b>Свеча «Хвоя» · 1 290 ₽</b><div class="gray" style="font-size:13px">Объявление собрано из этого клипа${q('autoad')}</div></div>${I.tick('#4BB34B', 22)}</div>
    <div class="gh" style="padding-left:0">Как увидят объявление${q('preview')}</div>
    <div style="border-radius:12px;background:#1E2E25;color:#fff;padding:12px;font-size:13.5px;display:flex;gap:10px;align-items:center"><div style="width:44px;height:58px;border-radius:8px;background:#3B5A47;display:flex;align-items:center;justify-content:center">${candle(30)}</div><div style="flex:1">Варим свечи вручную: Хвоя и кедр, 40 часов горения<div style="opacity:.7;margin-top:2px">Реклама · Тёплый воск</div></div></div>
    <button class="btn lg" style="margin-top:14px" data-act="promo" data-v="2">Далее: цель и бюджет</button></div>`;
  if (S.promo === 2) sheet = `<div class="sheet" style="max-height:none"><div class="grab"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:19px;font-weight:700">Продвигать товар</div><span class="gray" style="font-size:13px;font-weight:600">Шаг 2 из 3</span></div>
    <div class="gh" style="padding-left:0">Цель ${q('goal')}</div>
    <div class="seg"><button class="${S.goal === 0 ? 'on' : ''}" data-act="goal" data-v="0">Заказы в VK</button><button class="${S.goal === 1 ? 'on' : ''}" data-act="goal" data-v="1">Охват</button></div>
    <div class="grp" style="margin:12px 0 0;background:#F5F6F8"><div class="cell"><div class="l">Аудитория${q('audience')}</div><div class="v">Похожие на покупателей</div></div><div class="cell"><div class="l">Ставка${q('bid')}</div><div class="v">Автоматически</div></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:15px;margin-top:16px"><b style="display:flex;align-items:center">Бюджет ${q('budget')}</b><span><b class="bud">${nb(S.budget)} ₽</b> <span class="gray">за 7 дней</span></span></div>
    <input type="range" min="1000" max="10000" step="500" value="${S.budget}" data-inp="budget" aria-label="Бюджет">
    <div class="gray" style="display:flex;justify-content:space-between;font-size:12px"><span>1 000 ₽</span><span>10 000 ₽</span></div>
    ${S.goal === 0 ? `<div class="fc"><div class="a">Прогноз результата${q('forecast')}</div><div class="b"><span class="fco">${lo}–${hi}</span> заказов</div><div class="c">≈ 430–750 ₽ за заказ${q('cpo')} · по продажам похожих товаров в VK</div></div>` : `<div class="fc" style="background:#F2F3F5;color:#000"><div class="a">Прогноз результата${q('reach')}</div><div class="b">≈ ${nb(S.budget * 6)} показов</div><div class="c gray">Заказы при цели «Охват» не считаются</div></div>`}
    <button class="btn lg" style="margin-top:14px" data-act="promo" data-v="3">Далее: запуск</button></div>`;
  if (S.promo === 3) sheet = `<div class="sheet" style="max-height:none"><div class="grab"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:19px;font-weight:700">Проверьте и запустите</div><span class="gray" style="font-size:13px;font-weight:600">Шаг 3 из 3</span></div>
    <div class="grp" style="margin:12px 0 0;background:#F5F6F8">${[['Товар', 'Свеча «Хвоя»', 'autoad'], ['Цель', S.goal ? 'Охват' : 'Заказы в VK', 'goal'], ['Бюджет', nb(S.budget) + ' ₽ за 7 дней', 'billing'], ['Прогноз', S.goal ? '≈ ' + nb(S.budget * 6) + ' показов' : `${lo}–${hi} заказов`, 'forecast']].map(([a, b, k]) => `<div class="cell"><div class="l gray">${a}${q(k)}</div><div class="v" style="color:#000;font-weight:600">${b}</div></div>`).join('')}</div>
    <div class="note" style="padding:10px 4px 0">Заказы появятся в статистике «публикация → заказ». В прототипе деньги не списываются.</div>
    <button class="btn lg" style="margin-top:14px" data-act="launch">Запустить за ${nb(S.budget)} ₽</button></div>`;
  if (S.launched) sheet = `<div class="sheet" style="max-height:none;text-align:center"><div class="grab"></div><div class="donebig" style="margin-top:10px">${I.tick('#fff', 44)}</div><h2 style="margin-top:14px">Продвижение запущено</h2><div class="gray" style="font-size:14px;margin:6px 10px 0">Первые результаты — через несколько часов. Заказы будут видны по каждой публикации${q('results')}</div>
    <a class="btn lg" style="margin-top:16px" href="#/stats">Смотреть статистику</a><button class="btn sec" style="margin-top:8px" data-act="unlaunch">Вернуться к клипу</button></div>`;
  const ov = (S.promo || S.launched) ? `<div class="ov" style="z-index:5" data-act="promo" data-v="0"></div>` : '';
  return `<div class="view" style="background:#111"><div class="clip"></div>
    <div style="position:relative;z-index:2">${sb(true)}<div class="nav" style="background:transparent;box-shadow:none;color:#fff"><a class="nb" href="#/" aria-label="Назад" style="color:#fff">${I.back}</a><div class="t" style="color:#fff">Тёплый воск<small style="color:rgba(255,255,255,.75)">Клип</small></div><button class="qb dark" data-help="promote" aria-label="Обучение">?</button></div></div>
    <div style="position:absolute;top:150px;left:0;right:0;display:flex;justify-content:center;opacity:.95">${candle(190)}</div>
    <div class="side"><div>${I.heart}214</div><div>${I.comment}18</div><div>${I.share}</div></div>
    <div style="position:absolute;left:14px;right:70px;bottom:160px;color:#fff;font-size:14px;line-height:1.35"><b>Тёплый воск</b><br>Варим свечи вручную: Хвоя и кедр, 40 часов горения</div>
    <div style="position:absolute;left:12px;right:12px;bottom:28px;display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;gap:10px;align-items:center;background:rgba(255,255,255,.95);border-radius:12px;padding:8px"><div class="thumb" style="width:40px;height:40px">${candle(26)}</div><div style="flex:1;font-size:14px"><b>Свеча «Хвоя»</b><div class="gray" style="font-size:13px">1 290 ₽ · купить в VK</div></div><a href="#/product" class="pill" style="background:#0077FF;color:#fff">Купить</a></div>
      <button class="btn lg" data-act="promo" data-v="1">Продвигать товар${q('promo')}</button></div>
    ${ov}${sheet}</div>`;
}

// ---------- Статистика заказов ----------
function Stats() {
  const rows = [['Показы клипа и поста', '18 400', 100, 'impr', ''], ['Открыли карточку товара', '212', 46, 'ctr', 'CTR 1,2% от показов'], ['Нажали «Купить в VK»', '11', 18, 'cr', '5,2% от открывших карточку'], ['Оплатили заказ', '6', 10, 'paid', '55% от нажавших «Купить»']];
  return `${sb()}${nav('Публикация → заказ', 'Свеча «Хвоя» · 7 дней', '#/', 'stats')}<div class="body" style="background:#fff">
    <div class="fc" style="margin:12px 16px 0"><div class="a">Результат продвижения${q('result')}</div><div style="display:flex;align-items:baseline;gap:10px"><div class="b">6 заказов</div><div style="font-size:14px;opacity:.9">прогноз был 4–7${q('forecast')}</div></div><div class="c">500 ₽ за заказ${q('cpo')} · потрачено 3 000 ₽ · выручка 7 740 ₽${q('revenue')}</div></div>
    <div class="gh">Путь покупателя${q('funnel')}</div><div class="funnel" style="padding:0 16px">${rows.map(([a, b, w, k, sub], i) => `<div class="r"><span>${a}${q(k)}${sub ? `<span class="sub" style="display:block">${sub}</span>` : ''}</span><b class="${i === 3 ? 'green' : ''}">${b}</b></div><div class="b" style="width:${w}%;${i === 3 ? 'background:#4BB34B' : `opacity:${1 - i * .15}`}"></div>`).join('')}</div>
    <div class="gh">Какая публикация продала${q('bypost')}</div>
    <div class="grp" style="background:#F5F6F8">${[['Клип «Как мы варим свечи»', '4 заказа · 430 ₽'], ['Пост «Новая коллекция»', '2 заказа · 640 ₽']].map(([a, b]) => `<div class="cell"><div class="l">${a}</div><div class="v" style="color:#000;font-weight:600">${b}</div></div>`).join('')}</div>
    <div class="info">Совет: цена заказа из клипа ниже вашей наценки${q('markup')} — продлите продвижение клипа.</div><div style="height:16px"></div></div>
    <div class="foot"><a class="btn lg" href="#/promote">Продвигать клип ещё 7 дней</a></div>`;
}

// ---------- VK Академия: каталог ----------
function Academy(qs) {
  const rec = qs.get('rec');
  const F = [['all', 'Все'], ['video', 'Видео'], ['text', 'Тексты'], ['practice', 'Практика']];
  let ids = ORDER.filter(id => S.filter === 'all' || COURSES[id].fmt === S.filter);
  if (rec && ids.includes(rec)) ids = [rec, ...ids.filter(i => i !== rec)];
  const cc = (id) => { const c = COURSES[id], p = progressOf(id), passed = store.passed[id];
    return `<a class="cc" href="#/course/${id}">${cover(c)}<div class="tt">${c.title}</div><div class="tx">${c.desc}</div>
      ${p && !passed ? `<div class="prog"><i style="width:${p}%"></i></div>` : ''}
      <div class="mt"><span>${c.fmtL} · ${c.lessons.length} ${plural(c.lessons.length, 'урок', 'урока', 'уроков')} · тест и сертификат</span>${passed ? '<b class="green">Пройден ✓</b>' : p ? `<b class="blue">${p}%</b>` : '<b class="blue">Начать</b>'}</div>
      ${id === rec ? '<div class="mt" style="margin-top:0"><span class="chip" style="color:#9A5B00;background:#FFF4E0">Рекомендуем для этого экрана</span></div>' : ''}</a>`; };
  return `${sb()}${nav('VK Академия', 'Обучение для бизнеса', '#/', '')}<div class="body">
    ${rec ? `<div class="recb">Подобрали курс к экрану, на котором вы нажали «?». Остальные курсы — ниже.</div>` : ''}
    <div class="filters">${F.map(([k, t]) => `<button class="${S.filter === k ? 'on' : ''}" data-act="filter" data-v="${k}">${t}</button>`).join('')}</div>
    ${ids.map(cc).join('')}<div class="disc">Курсы VK Академии — пример интерфейса. Прогресс сохраняется на этом устройстве.</div></div>`;
}

// ---------- страница курса ----------
function Course(cid) {
  const c = COURSES[cid]; if (!c) return Academy(new URLSearchParams());
  const d = doneOf(cid), all = d.length === c.lessons.length, passed = store.passed[cid];
  const thumb = (l) => `<div class="lth ${l.type}">${l.type === 'video' ? I.play('#fff', 22) : l.type === 'text' ? I.doc : I.target}<span class="d">${l.dur}</span></div>`;
  const next = c.lessons.findIndex((_, i) => !d.includes(i));
  const lessonRows = c.lessons.map((l, i) => `<a class="ls" href="#/course/${cid}/${i}">${thumb(l)}<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600">${i + 1}. ${l.title}</div><div class="sub">${l.desc}</div><div class="sub" style="color:#0077FF;font-weight:600">${l.type === 'video' ? 'Видео' : l.type === 'text' ? 'Текст' : 'Практика'} · тест ${l.quiz.length} ${plural(l.quiz.length, 'вопрос', 'вопроса', 'вопросов')}</div></div>${d.includes(i) ? `<div class="ok-dot">${I.tick('#fff', 14)}</div>` : `<div class="num-dot">${i + 1}</div>`}</a>`).join('');
  const finalRow = `<a class="ls ${all ? '' : 'dis'}" href="${all ? `#/course/${cid}/final` : `#/course/${cid}`}" ${all ? '' : 'data-act="toast" data-v="Итоговый тест откроется после всех уроков"'} style="${all ? '' : 'opacity:.55'}"><div class="lth" style="background:#FFF4E0">${'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4 6.8 19.2l1-5.9L3.5 9.2l5.9-.8Z" fill="#FFA000"/></svg>'}</div><div style="flex:1"><div style="font-size:15px;font-weight:600">Итоговый тест и сертификат</div><div class="sub">${c.final.length} вопроса · ${all ? 'доступен' : 'откроется после всех уроков'}</div></div>${passed ? `<div class="ok-dot">${I.tick('#fff', 14)}</div>` : ''}</a>`;
  const foot = passed ? `<a class="btn lg" href="${c.apply.href}">Применить: ${c.apply.label}</a><a class="btn sec" href="#/course/${cid}/cert">Сертификат</a>`
    : all ? `<a class="btn lg" href="#/course/${cid}/final">Пройти итоговый тест</a>`
    : `<a class="btn lg" href="#/course/${cid}/${next}">${d.length ? 'Продолжить: урок ' + (next + 1) : 'Начать обучение'}</a>`;
  return `${sb()}${nav(c.fmtL, 'VK Академия', '#/academy', '')}<div class="body">
    <div style="background:#fff;padding:12px 12px 16px">${cover(c, 170)}<h2 style="margin:14px 4px 0">${c.title}</h2>
      <div class="gray" style="font-size:14px;margin:4px 4px 0">${c.fmtL} · ${c.lessons.length} ${plural(c.lessons.length, 'урок', 'урока', 'уроков')} · ${c.min} минут</div>
      <p style="font-size:15px;line-height:1.4;margin:10px 4px 0">${c.desc}</p>
      ${d.length ? `<div class="prog" style="margin:12px 4px 0"><i style="width:${progressOf(cid)}%"></i></div><div class="sub" style="margin:4px 4px 0">Пройдено ${d.length} из ${c.lessons.length}</div>` : ''}</div>
    <div class="gh">Чему научитесь</div><div class="grp" style="margin-top:4px;padding:4px 0 10px">${c.learn.map(t => `<div style="display:flex;gap:8px;padding:6px 16px 0;font-size:15px">${I.tick('#4BB34B', 18)}<span>${t}</span></div>`).join('')}</div>
    <div class="gh">Уроки</div><div class="grp" style="margin-top:4px">${lessonRows}${finalRow}</div><div style="height:16px"></div></div>
    <div class="foot">${foot}</div>`;
}

// ---------- урок ----------
function quiz(key, qs) {
  return qs.map((x, i) => { const k = `${key}-${i}`, sel = S.ans[k];
    return `<div class="qq"><div class="qt">${i + 1}. ${x.q}</div>${x.o.map((o, j) => { const on = sel === j, cls = on ? (j === x.a ? 'ok' : 'bad') : '';
      return `<button class="opt ${cls}" data-act="ans" data-k="${k}" data-v="${j}"><span class="radio ${on ? 'on' : ''}" style="${on ? (j === x.a ? 'border-color:#4BB34B' : 'border-color:#E64646') : ''}"></span><span style="flex:1">${o}${on ? `<span class="fb">${j === x.a ? 'Верно!' : 'Попробуйте ещё раз'}</span>` : ''}</span></button>`; }).join('')}</div>`; }).join('');
}
const allOk = (key, qs) => qs.every((x, i) => S.ans[`${key}-${i}`] === x.a);
function widget(l) {
  if (l.widget === 'budget') { const { lo, hi } = fc(S.budget); return `<div class="wd"><div class="h">Практика · попробуйте сами</div>
    <div style="display:flex;justify-content:space-between;font-size:15px;margin-top:10px"><b>Бюджет на 7 дней</b><b class="bud">${nb(S.budget)} ₽</b></div>
    <input type="range" min="1000" max="10000" step="500" value="${S.budget}" data-inp="budget" aria-label="Бюджет">
    <div class="fc"><div class="a">Прогноз</div><div class="b"><span class="fco">${lo}–${hi}</span> заказов</div><div class="c">≈ 430–750 ₽ за заказ · по продажам похожих товаров</div></div></div>`; }
  if (l.widget === 'weight') return `<div class="wd"><div class="h">Практика · посчитайте доставку</div>
    <div class="inp"><input type="number" min="50" max="20000" step="50" value="${S.weight}" data-inp="weight" aria-label="Вес, г"><select data-inp="size" aria-label="Размер коробки">${[['S', 'Коробка S до 15 см'], ['M', 'Коробка M до 25 см'], ['L', 'Коробка L до 40 см']].map(([k, t]) => `<option value="${k}" ${S.size === k ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <div class="sub" style="margin-top:4px">Вес в граммах, вместе с упаковкой</div><div id="ship">${ship()}</div></div>`;
  if (l.widget === 'check') { const k = l.title, ch = S.chk[k] || [], n = ch.filter(Boolean).length;
    return `<div class="wd"><div class="h">Практика · чек-лист</div>${l.items.map((t, i) => `<button class="cell" style="padding:0;min-height:44px" data-act="chk" data-k="${k}" data-v="${i}"><div class="chk ${ch[i] ? 'on' : ''}">${ch[i] ? I.tick() : ''}</div><div class="l" style="font-size:15px">${t}</div></button>`).join('')}
    <div class="info" style="margin:10px 0 0">${n === l.items.length ? 'Всё готово — отлично!' : `Отмечено ${n} из ${l.items.length}. Неотмеченное — ваш план на сегодня`}</div></div>`; }
  return '';
}
function ship() {
  const extra = Math.max(0, Math.ceil((S.weight || 0) / 500) - 1), sz = { S: 0, M: 30, L: 70 }[S.size];
  const t = [['Почта России', 180, 40, '5–7 дней'], ['СДЭК', 199, 45, '3–5 дней'], ['Boxberry', 189, 42, '4–6 дней']];
  return `<div class="grp" style="margin:10px 0 0;background:#F5F6F8">${t.map(([n, b, k, d]) => `<div class="cell"><div class="l">${n}<div class="sub">${d}</div></div><div class="v" style="color:#000;font-weight:700">${b + k * extra + sz} ₽</div></div>`).join('')}</div><div class="sub" style="margin-top:6px">Пример расчёта, тарифы условные. Покупатель увидит минимальную цену в карточке.</div>`;
}
function Lesson(cid, li) {
  const c = COURSES[cid], l = c && c.lessons[li]; if (!l) return Course(cid);
  const key = `${cid}-${li}`, ok = allOk(key, l.quiz), last = li === c.lessons.length - 1, n = c.lessons.length;
  let content = '';
  if (l.type === 'video') { const pl = S.playing === key;
    content = `<div class="vid" data-act="play" data-k="${key}" style="cursor:pointer;background:${c.bg}"><span class="tag">Видеоурок ${li + 1}</span>${pl ? `<div style="text-align:center;font-weight:700"><div style="font-size:14px;opacity:.9">Идёт воспроизведение</div><div style="font-size:13px;opacity:.8;margin-top:4px">Субтитры: ${l.points[0].slice(0, 46)}…</div></div><div class="pb"><i></i></div>` : `<div class="pl">${I.play('#0077FF', 30)}</div>`}<span class="tm">${pl ? '00:00 / ' : ''}${l.dur}</span></div>
      <div class="sub" style="margin-top:6px">В прототипе видео — превью. Конспект урока ниже.</div>
      <div class="gh" style="padding-left:0">Конспект</div><ul class="pts">${l.points.map(p => `<li>${p}</li>`).join('')}</ul>`;
  } else {
    const paras = l.body || l.points || [];
    content = `<div class="art">${paras.map(p => `<p>${p}</p>`).join('')}</div>${l.example ? `<div class="ex"><b>Пример.</b> ${l.example}</div>` : ''}${l.type === 'practice' && l.points ? `<ul class="pts">${l.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}${widget(l)}`;
  }
  const nextHref = last ? `#/course/${cid}/final` : `#/course/${cid}/${li + 1}`;
  return `${sb()}${nav(`Урок ${li + 1} из ${n}`, c.title, `#/course/${cid}`, '')}
    <div class="steps" style="padding-bottom:10px">${c.lessons.map((_, i) => `<div><i class="${i <= li ? 'on' : ''}"></i></div>`).join('')}</div>
    <div class="body" style="background:#fff"><div style="padding:14px 16px 0"><span class="chip">${l.type === 'video' ? 'Видео' : l.type === 'text' ? 'Текст' : 'Практика'} · ${l.dur}</span><h2 style="margin-top:8px">${l.title}</h2><div class="gray" style="font-size:14.5px;margin-top:4px">${l.desc}</div>
    <div style="margin-top:14px">${content}</div>
    <div style="margin-top:22px;padding-top:14px;border-top:1px solid #E1E3E6"><div class="hlbl">Проверьте себя · ${l.quiz.length} ${plural(l.quiz.length, 'вопрос', 'вопроса', 'вопросов')}</div>${quiz(key, l.quiz)}</div><div style="height:20px"></div></div></div>
    <div class="foot"><a class="btn lg ${ok ? '' : 'dis'}" href="${nextHref}">${last ? 'К итоговому тесту' : 'Следующий урок'}</a>${ok ? '' : '<div class="sub" style="text-align:center;margin-top:0">Ответьте верно на все вопросы, чтобы продолжить</div>'}</div>`;
}

// ---------- итоговый тест и сертификат ----------
function Final(cid) {
  const c = COURSES[cid]; if (!c) return Academy(new URLSearchParams());
  const f = S.fin[cid] || {}, checked = S.finChecked[cid];
  const score = c.final.filter((x, i) => f[i] === x.a).length, need = c.final.length - 1;
  const qs = c.final.map((x, i) => `<div class="qq"><div class="qt">${i + 1}. ${x.q}</div>${x.o.map((o, j) => { const on = f[i] === j, cls = checked && on ? (j === x.a ? 'ok' : 'bad') : '';
    return `<button class="opt ${cls}" data-act="fin" data-k="${cid}" data-i="${i}" data-v="${j}"><span class="radio ${on ? 'on' : ''}"></span><span style="flex:1">${o}${checked && on ? `<span class="fb">${j === x.a ? 'Верно' : 'Неверно'}</span>` : ''}</span></button>`; }).join('')}</div>`).join('');
  const answered = Object.keys(f).length === c.final.length;
  const res = checked ? (score >= need ? `<div class="info" style="margin:16px 0 0;background:#ECF8EE;color:#2E7D32"><b>${score} из ${c.final.length}.</b> Тест пройден!</div>` : `<div class="info" style="margin:16px 0 0;background:#FFF2F2;color:#C62828"><b>${score} из ${c.final.length}.</b> Нужно не меньше ${need}. Исправьте ответы и проверьте ещё раз.</div>`) : '';
  const foot = checked && score >= need ? `<a class="btn lg" href="#/course/${cid}/cert">Получить сертификат</a>` : `<button class="btn lg ${answered ? '' : 'dis'}" data-act="check" data-k="${cid}">Проверить ответы</button>`;
  return `${sb()}${nav('Итоговый тест', c.title, `#/course/${cid}`, '')}<div class="body" style="background:#fff"><div style="padding:14px 16px 0">
    <h2>Итоговый тест</h2><div class="gray" style="font-size:14.5px;margin-top:4px">${c.final.length} вопроса по всему курсу. Для сертификата — не меньше ${need} верных ответов</div>${qs}${res}<div style="height:20px"></div></div></div><div class="foot">${foot}</div>`;
}
function Cert(cid) {
  const c = COURSES[cid]; if (!c || !store.passed[cid]) return Course(cid);
  const no = 'VKA-' + (2611 + ORDER.indexOf(cid) * 137) + '-' + (482 + c.min);
  return `${sb()}${nav('Сертификат', c.title, `#/course/${cid}`, '')}<div class="body">
    <div class="cert"><div class="seal">VK</div><div class="hlbl" style="margin-top:12px">Сертификат VK Академии</div>
      <div class="gray" style="font-size:14px;margin-top:10px">подтверждает, что сообщество</div><div style="font-size:20px;font-weight:800;margin-top:4px">«Тёплый воск»</div>
      <div class="gray" style="font-size:14px;margin-top:10px">прошло курс</div><div style="font-size:18px;font-weight:700;margin-top:4px;line-height:1.25">${c.title}</div>
      <div style="display:flex;justify-content:space-between;margin-top:18px;font-size:12.5px;color:#818C99"><span>22.11.2026</span><span>№ ${no}</span></div></div>
    <div class="info" style="margin:14px 12px 0">Значок «Обучено в VK Академии» появится в профиле сообщества. Теперь примените знания на деле.</div><div style="height:16px"></div></div>
    <div class="foot"><a class="btn lg" href="${c.apply.href}">Применить: ${c.apply.label}</a><a class="btn sec" href="#/academy">Все курсы</a></div>`;
}

// ---------- маршрутизация ----------
function parse() { const h = location.hash.slice(1) || '/'; const [p, qs] = h.split('?'); return { parts: p.split('/').filter(Boolean), qs: new URLSearchParams(qs || '') }; }
function render(keep) {
  const body0 = view.querySelector('.body'), st = keep && body0 ? body0.scrollTop : 0;
  const { parts, qs } = parse(); const [a, b, c] = parts;
  if (!keep) { closeSheet(); }
  let html;
  if (!a) html = Home();
  else if (a === 'launch') html = Launch();
  else if (a === 'product') html = Product();
  else if (a === 'done') html = Done();
  else if (a === 'promote') html = Promote();
  else if (a === 'stats') html = Stats();
  else if (a === 'academy') html = Academy(qs);
  else if (a === 'course' && c === 'final') html = Final(b);
  else if (a === 'course' && c === 'cert') html = Cert(b);
  else if (a === 'course' && c !== undefined) html = Lesson(b, +c);
  else if (a === 'course') html = Course(b);
  else html = Home();
  if (a === 'promote') { view.innerHTML = html.replace(/^<div class="view"[^>]*>/, '').replace(/<\/div>$/, ''); view.style.background = '#111'; }
  else { view.innerHTML = html; view.style.background = ''; }
  const body1 = view.querySelector('.body'); if (body1) body1.scrollTop = st;
}
let lastPath = '';
window.addEventListener('hashchange', () => { const p = parse().parts.join('/'); const same = p === lastPath; lastPath = p; if (!same) { S.checkout = false; if (!p.startsWith('promote')) { S.promo = 0; S.launched = false; } } render(false); });

const ACT = {
  closeSheet: () => closeSheet(),
  step: (el) => { S.step = +el.dataset.v; render(); },
  deliv: (el) => { const i = +el.dataset.v; S.deliv[i] = !S.deliv[i]; render(true); },
  checkout: (el) => { S.checkout = el.dataset.v === '1'; render(true); },
  pay: (el) => { S.pay = +el.dataset.v; render(true); },
  toast: (el) => toast(el.dataset.v),
  promo: (el) => { S.promo = +el.dataset.v; if (!S.promo) S.launched = false; render(true); },
  goal: (el) => { S.goal = +el.dataset.v; render(true); },
  launch: () => { S.promo = 0; S.launched = true; render(true); },
  unlaunch: () => { S.launched = false; render(true); },
  filter: (el) => { S.filter = el.dataset.v; render(true); },
  play: (el) => { S.playing = S.playing === el.dataset.k ? '' : el.dataset.k; render(true); },
  chk: (el) => { const k = el.dataset.k, i = +el.dataset.v; S.chk[k] = S.chk[k] || []; S.chk[k][i] = !S.chk[k][i]; render(true); },
  ans: (el) => { S.ans[el.dataset.k] = +el.dataset.v; const [cid, li] = el.dataset.k.split('-'); const l = COURSES[cid].lessons[+li];
    if (allOk(`${cid}-${li}`, l.quiz)) { store.done[cid] = store.done[cid] || []; if (!store.done[cid].includes(+li)) { store.done[cid].push(+li); save(); } }
    render(true); },
  fin: (el) => { const k = el.dataset.k; S.fin[k] = S.fin[k] || {}; S.fin[k][+el.dataset.i] = +el.dataset.v; S.finChecked[k] = false; render(true); },
  check: (el) => { const k = el.dataset.k, c = COURSES[k], f = S.fin[k] || {}; S.finChecked[k] = true; const score = c.final.filter((x, i) => f[i] === x.a).length;
    if (score >= c.final.length - 1) { store.passed[k] = true; save(); } render(true); }
};
document.addEventListener('click', (e) => {
  const tp = e.target.closest('[data-tip]'); if (tp) { e.preventDefault(); e.stopPropagation(); openTip(tp, tp.dataset.tip); return; }
  const h = e.target.closest('[data-help]'); if (h) { e.preventDefault(); openHelp(h.dataset.help); return; }
  const a = e.target.closest('[data-act]'); if (a && ACT[a.dataset.act]) { if (a.tagName !== 'A' || a.dataset.act !== 'closeSheet') e.preventDefault(); ACT[a.dataset.act](a); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.tip) { e.preventDefault(); openTip(e.target, e.target.dataset.tip); }
});
document.addEventListener('input', (e) => {
  const k = e.target.dataset.inp; if (!k) return;
  if (k === 'budget') { S.budget = +e.target.value; const { lo, hi } = fc(S.budget); document.querySelectorAll('.bud').forEach(x => x.textContent = nb(S.budget) + ' ₽'); document.querySelectorAll('.fco').forEach(x => x.textContent = `${lo}–${hi}`); }
  if (k === 'weight') { S.weight = +e.target.value; const s = document.getElementById('ship'); if (s) s.innerHTML = ship(); }
  if (k === 'size') { S.size = e.target.value; const s = document.getElementById('ship'); if (s) s.innerHTML = ship(); }
});
lastPath = parse().parts.join('/');
render(false);
