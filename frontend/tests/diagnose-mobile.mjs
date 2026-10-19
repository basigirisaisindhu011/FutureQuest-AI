import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
await page.goto('http://127.0.0.1:5173/');
await page.evaluate(()=>document.fonts.ready);
await page.getByRole('button',{name:'See all 24 games',exact:true}).click();
await page.locator('#faq summary').first().click();
const measurements=[];
for(let run=0;run<3;run++){
 await page.setViewportSize({width:1440,height:900});await page.setViewportSize({width:320,height:900});
 for(const phase of ['immediate','settled']){
  if(phase==='settled')await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  measurements.push(await page.evaluate(({run,phase})=>({run,phase,width:innerWidth,content:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.right>innerWidth+2||r.left < -2);}).slice(0,10).map(el=>({tag:el.tagName,cls:el.className?.baseVal||el.className,text:el.textContent?.slice(0,70)}))}),{run,phase}));
 }
}
await page.screenshot({path:'docs/redesign/screenshots/browser-recheck-320.png',fullPage:true});
await fs.writeFile('docs/redesign/mobile-recheck.json',JSON.stringify({executedAt:new Date().toISOString(),measurements},null,2));
console.log(JSON.stringify(measurements,null,2));await browser.close();
