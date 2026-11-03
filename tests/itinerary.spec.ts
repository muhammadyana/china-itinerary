import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {days,highlights,places,photos,userPhotos} from '../src/itinerary';
import {mkdir,writeFile} from 'node:fs/promises';

const overnight=['Jiuzhaigou','Jiuzhaigou','Rilong','Danba','Xinduqiao','Xinduqiao','Litang','Riwa','Riwa','Shangri-La','Lijiang','Dali','Kunming',null];
const initialPhotoIds=new Set([
 ...highlights.map(highlight=>photos[highlight.photo||places[highlight.place].photo!].id),
 ...days[0].events.flatMap(event=>event.kind==='stop'&&places[event.place].photo?[photos[places[event.place].photo!].id]:[]),
]);
const isInitialPhoto=(url:string)=>{
 const match=new URL(url).pathname.match(/^\/photos\/(.+)-\d+\.webp$/);
 return Boolean(match&&initialPhotoIds.has(match[1]));
};
test('source invariants: 14 dates, 13 nights and conditional routes',async()=>{
 expect(days).toHaveLength(14);
 expect(days.map(d=>d.overnight?.name??null)).toEqual(overnight);
 expect(days.filter(d=>d.overnight)).toHaveLength(13);
 expect(days.map(d=>d.date)).toEqual(Array.from({length:14},(_,i)=>`2026-11-${String(i+8).padStart(2,'0')}`));
 const ids=days.flatMap(d=>d.events.filter(e=>e.kind==='stop').map(e=>e.place));
 expect(ids.every(id=>Boolean(places[id]))).toBe(true);
 expect(ids).not.toContain('panda-base'); expect(ids).not.toContain('nuorilang');
 expect(days[7].events.find(e=>e.kind==='stop'&&e.place==='sister-lakes')).toMatchObject({status:'Perlu konfirmasi'});
 expect(days[8].events.filter(e=>e.kind==='stop'&&['milk-lake','five-colour'].includes(e.place)).every(e=>e.status==='Jika jalur dibuka')).toBe(true);
 expect(days[13].events.find(e=>e.kind==='stop'&&e.place==='kmg')).toMatchObject({status:'Perlu konfirmasi'});
 expect(highlights.map(highlight=>[highlight.place,highlight.date,highlight.region])).toEqual([
  ['five-flower','2026-11-09','Sichuan'],['songzanlin','2026-11-18','Yunnan'],
  ['maobiliang','2026-11-10','Sichuan'],['dayan','2026-11-18','Yunnan'],
  ['tagong','2026-11-12','Sichuan'],['blue-moon','2026-11-19','Yunnan'],
  ['luorong','2026-11-16','Sichuan'],['erhai','2026-11-20','Yunnan'],
 ]);
 for(const highlight of highlights) {
  const day=days.find(day=>day.date===highlight.date);
  expect(day?.events.some(event=>event.kind==='stop'&&event.place===highlight.place),highlight.place).toBe(true);
  const place=places[highlight.place];const photo=photos[highlight.photo||place.photo!];
  expect(highlight.title.trim()).not.toBe('');expect(highlight.caption.trim()).not.toBe('');
  expect((highlight.alt||place.alt)?.trim()).toBeTruthy();
  expect(photo.width).toBeGreaterThan(0);expect(photo.height).toBeGreaterThan(0);
  expect(photo.author.trim()).not.toBe('');expect(photo.source).toMatch(/^https?:/);
 }
});

for(const width of [360,390,1440]) {
 test(`${width}px: two taps, all dates, history, photos, focus, no overflow`,async({page})=>{
  await mkdir('artifacts',{recursive:true});
  await page.setViewportSize({width,height:width<600?844:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const requests:string[]=[];page.on('request',r=>{if(r.resourceType()==='image')requests.push(r.url());});
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('h1')).toHaveText('Musim Gugur di China');
  await expect(page.locator('.home-arrival .arrival-stay')).toContainText('Menginap di Jiuzhaigou');
  if(width<600) {const sleep=await page.locator('.home-arrival .arrival-stay').boundingBox();const dock=await page.locator('.mobile-daybar').boundingBox();expect(sleep!.y+sleep!.height).toBeLessThan(dock!.y);}
  await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:false});
  expect(requests.filter(url=>url.includes('/photos/')).every(isInitialPhoto)).toBe(true);
  await expect(page.locator('.highlight-card[data-highlight]')).toHaveCount(8);
  for(const region of ['Sichuan','Yunnan']) {
   const group=page.locator(`.region-highlights[data-region="${region}"]`);
   await expect(group.locator('h3')).toContainText(region);
   await expect(group.locator('.highlight-card')).toHaveCount(4);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  if(width===1440) {
   for(const img of await page.locator('.highlight-card img').all()) {
    await img.scrollIntoViewIfNeeded();
    expect(await img.evaluate(async el=>{const image=el as HTMLImageElement;await image.decode();return image.naturalWidth;})).toBeGreaterThan(0);
   }
   await page.locator('.trip-highlights').screenshot({path:'artifacts/highlights-1440.png'});
  }
  const trigger=page.getByRole('button',{name:'Pilih hari',exact:true});
  await trigger.click();
  await expect(page.locator('#day-picker')).toBeVisible();
  await expect(page.locator('#picker-days [data-date]')).toHaveCount(14);
  await page.screenshot({path:`artifacts/picker-${width}.png`});
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await trigger.click();
  const nov20=page.locator('#picker-days [data-date="2026-11-20"]');
  await expect(nov20).toBeInViewport();await nov20.click();
  await expect(page).toHaveURL(/#2026-11-20$/);
  await expect(page.locator('#day-heading')).toHaveText('Danau Erhai & Kota Tua Dali');
  await expect(page.locator('.sleep-summary')).toContainText('Menginap di Kunming');
  await expect(page.locator('.sleep-summary')).toBeInViewport();
  await page.screenshot({path:`artifacts/nov20-viewport-${width}.png`});
  await page.screenshot({path:`artifacts/nov20-${width}.png`,fullPage:true});
  await page.reload();await expect(page.locator('#day-heading')).toContainText('Erhai');
  await page.goBack();await expect(page.locator('#day-heading')).toHaveText(days[0].title);
  for(const [i,day] of days.entries()) {
   await page.evaluate(date=>{location.hash=date;},day.date);
   await expect(page.locator('#day-heading')).toHaveText(day.title);
   if(overnight[i])await expect(page.locator('.sleep-summary')).toContainText(`Menginap di ${overnight[i]}`);
   else await expect(page.locator('.sleep-summary')).toContainText('Pulang ke Jakarta');
   const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   expect(metrics.scroll,day.date).toBeLessThanOrEqual(metrics.width);
   expect(await page.locator('#day-view [data-action="photo"]').count()).toBeGreaterThan(0);
  }
  await page.evaluate(()=>{location.hash='2026-11-20';});await expect(page.locator('#day-heading')).toContainText('Erhai');
  const photo=page.locator('#day-view [data-action="photo"]').first();await photo.click();
  await expect(page.locator('#photo-title')).toHaveText('Danau Erhai');
  await expect(page.locator('#photo-dialog img')).toHaveJSProperty('complete',true);
  await expect(page.locator('#photo-dialog .photo-credit')).toContainText(photos[places.erhai.photo!].author);
  await page.keyboard.press('Escape');await expect(photo).toBeFocused();
  const tooSmall=await page.locator('button,a,summary').evaluateAll(nodes=>nodes.filter(el=>{
   const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&!el.closest('dialog:not([open])')&&(r.width<44||r.height<44);
  }).map(el=>({text:el.textContent?.trim(),rect:el.getBoundingClientRect().toJSON()})));
  expect(tooSmall).toEqual([]);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await writeFile(`artifacts/axe-${width}.json`,JSON.stringify(axe.violations,null,2));
  expect(axe.violations).toEqual([]);expect(errors).toEqual([]);
 });
}
test('homepage highlights: slider controls, native swipe scroll, matching days and history',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const slides=page.locator('.hero-slide');
 const activeSlide=page.locator('.hero-slide.is-active');
 await expect(slides).toHaveCount(8);
 for(const [index,highlight] of highlights.entries()) {
  await expect(slides.nth(index).locator('figcaption')).toContainText(highlight.title);
  await expect(slides.nth(index).locator('figcaption')).toContainText(highlight.region);
 }
 await expect(page.locator('#hero-counter')).toHaveText('1 / 8');
 await expect(activeSlide.locator('figcaption')).toContainText(highlights[0].title);
 await page.locator('[data-action="hero-next"]').click();
 await expect(page.locator('#hero-counter')).toHaveText('2 / 8');
 await expect(activeSlide.locator('figcaption')).toContainText(highlights[1].title);
 await page.locator('[data-action="hero-previous"]').click();
 await expect(page.locator('#hero-counter')).toHaveText('1 / 8');
 await page.locator('.hero-track').evaluate(el=>el.scrollTo({left:2*el.clientWidth,behavior:'instant'}));
 await expect(page.locator('#hero-counter')).toHaveText('3 / 8');
 await expect(activeSlide.locator('figcaption')).toContainText(highlights[2].title);
 await expect(activeSlide).not.toHaveAttribute('inert','');
 await expect(slides.first()).toHaveAttribute('inert','');
 await activeSlide.locator('img').evaluate(el=>(el as HTMLImageElement).decode());
 const cards=page.locator('.highlight-card[data-highlight]');
 await expect(cards).toHaveCount(8);
 const arrival=await page.locator('.home-arrival').boundingBox();
 const firstCard=await cards.first().boundingBox();
 const lastCard=await cards.last().boundingBox();
 const daySummary=await page.locator('#day-view .sleep-summary').boundingBox();
 expect(arrival!.y+arrival!.height).toBeLessThanOrEqual(firstCard!.y);
 expect(lastCard!.y+lastCard!.height).toBeLessThanOrEqual(daySummary!.y);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(axe.violations).toEqual([]);
 for(const highlight of highlights) {
  const place=places[highlight.place];const photo=photos[highlight.photo||place.photo!];
  const card=page.locator(`a.highlight-card[data-highlight="${highlight.place}"]`);
  await expect(card).toHaveAttribute('href',`#${highlight.date}`);
  await expect(card).toContainText(highlight.title);
  await expect(card).toContainText(highlight.caption);
  const img=card.locator('img');
  await expect(img).toHaveAttribute('alt',highlight.alt||place.alt!);
  const src=await img.getAttribute('src');
  expect(photo.sizes.map(width=>`/photos/${photo.id}-${width}.webp`)).toContain(new URL(src!,page.url()).pathname);
  await img.scrollIntoViewIfNeeded();
  expect(await img.evaluate(async el=>{const image=el as HTMLImageElement;await image.decode();return image.naturalWidth;})).toBeGreaterThan(0);
  await card.click();
  await expect(page).toHaveURL(new RegExp(`#${highlight.date}$`));
  const day=days.find(day=>day.date===highlight.date)!;
  await expect(page.locator('#day-heading')).toHaveText(day.title);
  await expect(page.locator('#day-heading')).toBeFocused();
  await expect(page.locator('#day-view')).toContainText(place.name);
  await expect(page.locator('#day-view .sleep-summary')).toContainText(`Menginap di ${day.overnight!.name}`);
  await expect(page.locator('#day-view .sleep-summary')).toBeInViewport();
  await page.goBack();
  await expect(page).not.toHaveURL(/#2026-/);
  await expect(page.locator('#day-heading')).toHaveText(days[0].title);
 }
});
test('homepage regions: province groups and keyboard navigation to a Yunnan day',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const expectedPlaces={Sichuan:['five-flower','maobiliang','tagong','luorong'],Yunnan:['songzanlin','dayan','blue-moon','erhai']};
 for(const [region,placeIds] of Object.entries(expectedPlaces)) {
  const group=page.locator(`.region-highlights[data-region="${region}"]`);
  await expect(group.locator('h3')).toContainText(region);
  await expect(group.locator('.highlight-card')).toHaveCount(4);
  expect(await group.locator('.highlight-card').evaluateAll(cards=>cards.map(card=>card.getAttribute('data-highlight')))).toEqual(placeIds);
 }
 const regionButton=page.locator('[data-action="region"][data-region="Yunnan"]');
 await regionButton.focus();await page.keyboard.press('Enter');
 const heading=page.locator('.region-highlights[data-region="Yunnan"] h3');
 await expect(heading).toBeFocused();await expect(heading).toBeInViewport();
 const lijiang=page.locator('.region-highlights[data-region="Yunnan"] [data-highlight="dayan"]');
 await expect(lijiang).toContainText('Kota Tua Lijiang');
 await lijiang.focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#2026-11-18$/);
 await expect(page.locator('#day-heading')).toHaveText(days[10].title);
 await expect(page.locator('#day-heading')).toBeFocused();
 await expect(page.locator('.sleep-summary')).toContainText('Menginap di Lijiang');
 await expect(page.locator('.sleep-summary')).toBeInViewport();
});
test('production on mobile network: does not fetch unopened galleries',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});
 const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular3g'});
 const responseBytes:{url:string;bytes:number}[]=[];
 const imageUrls:string[]=[];page.on('request',r=>{if(r.resourceType()==='image')imageUrls.push(r.url());});
 const start=Date.now();await page.goto('/',{waitUntil:'networkidle'});
 await expect(page.locator('h1')).toBeVisible();
 const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({url:r.name,bytes:(r as PerformanceResourceTiming).transferSize})));
 responseBytes.push(...loaded);
 expect(imageUrls.every(isInitialPhoto)).toBe(true);
 const uniquePhotoIds=new Set(imageUrls.map(url=>new URL(url).pathname.match(/^\/photos\/(.+)-\d+\.webp$/)?.[1]));
 expect(uniquePhotoIds.size).toBeLessThanOrEqual(11);
 expect(imageUrls.filter(url=>url.includes('user-autumn-'))).toEqual([]);
 await writeFile('artifacts/network.json',JSON.stringify({profile:'1.6 Mbps down, 750 Kbps up, 150 ms latency; cold cache',elapsedMs:Date.now()-start,images:imageUrls,resources:responseBytes},null,2));
 await page.getByRole('button',{name:'Pilih hari',exact:true}).click();
 await page.locator('#picker-days [data-date="2026-11-20"]').click();
 await expect(page.locator('.sleep-summary')).toContainText('Kunming');
});
test('copy succeeds and clipboard-denied fallback remains usable',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/#2026-11-20');
 await page.locator('#day-view [data-place="erhai"][data-action="copy-place"]').click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('洱海');
 await page.getByRole('button',{name:'Salin tautan hari ini'}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('#2026-11-20');
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true});});
 await page.locator('#day-view [data-place="caicun"][data-action="copy-place"]').click();
 await expect(page.locator('#copy-dialog')).toBeVisible();
 await expect(page.locator('#manual-copy')).toHaveValue('才村码头');
 await page.keyboard.press('Escape');
 await expect(page.locator('#day-view [data-place="caicun"][data-action="copy-place"]')).toBeFocused();
 const photo=page.locator('#day-view [data-action="photo"]').first();
 await photo.click();
 await page.locator('#photo-dialog [data-action="copy-place"]').click();
 await expect(page.locator('#manual-copy')).toHaveValue('洱海');
 await expect(page.locator('#manual-copy')).toBeFocused();
 await expect(page.locator('#photo-dialog')).not.toBeVisible();
 await expect(page.locator('html')).toHaveClass(/dialog-open/);
 await page.keyboard.press('Escape');
 await expect(photo).toBeFocused();
 await expect(page.locator('html')).not.toHaveClass(/dialog-open/);
});
test('server-rendered first day and PDF survive disabled JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/');
 await expect(page.locator('#day-heading')).toHaveText(days[0].title);
 await expect(page.locator('.sleep-summary')).toContainText('Jiuzhaigou');
 await expect(page.locator('.no-script')).toContainText('seluruh 14 hari');
 const pdf=await page.request.get('http://127.0.0.1:4173/China-Ganzi-Yunnan-8-21Nov-2026-Itinerary.pdf');
 expect(pdf.ok()).toBe(true);expect(pdf.headers()['content-type']).toContain('pdf');await context.close();
});
test('every photo source exists with explicit responsive dimensions and attribution',async({request})=>{
 for(const photo of [...Object.values(photos),...Object.values(userPhotos)]) {
  if ('author' in photo) {expect(photo.author.length).toBeGreaterThan(0);expect(photo.licenseUrl).toMatch(/^https?:/);} else {expect(photo.credit.length).toBeGreaterThan(0);}
  for(const width of photo.sizes) {
   const response=await request.get(`/photos/${photo.id}-${width}.webp`);
   expect(response.ok(),photo.id).toBe(true);expect(response.headers()['content-type']).toContain('webp');
  }
 }
});

test('user gallery: on-demand images, photo source, focus and contained horizontal scroll',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const images:string[]=[];page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});
 await page.goto('/');
 const firstHeroPhoto=photos[highlights[0].photo||places[highlights[0].place].photo!];
 await expect(page.locator('.hero-slide img').first()).toHaveAttribute('src',new RegExp(`${firstHeroPhoto.id}-\\d+\\.webp$`));
 expect(images.filter(url=>url.includes('user-autumn-'))).toEqual([]);
 await page.getByRole('button',{name:'Galeri',exact:true}).click();
 await expect(page.locator('#user-gallery')).toHaveAttribute('open','');
 await expect(page.locator('#gallery-heading')).toBeFocused();
 await expect(page.locator('.gallery-photo')).toHaveCount(12);
 await page.locator('.gallery-photo img').first().evaluate(img=>(img as HTMLImageElement).decode());
 await page.screenshot({path:'artifacts/autumn-gallery-390.png'});
 const bipeng=page.locator('.gallery-photo[data-photo="user-autumn-08"]');
 await bipeng.click();
 await expect(page.locator('#photo-title')).toHaveText('Bipenggou');
 await expect(page.locator('#photo-content')).toContainText('di luar rute 14 hari');
 await expect(page.locator('#photo-content')).toContainText('kapongbeer');
 await expect(page.locator('#photo-content')).toContainText('Tanggal pengambilan tidak dicantumkan');
 await page.keyboard.press('Escape');await expect(bipeng).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 expect(await page.locator('.gallery-track').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
});
