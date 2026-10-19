import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const checks=[];
for(const fonts of ['normal','blocked']){
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 if(fonts==='blocked')await context.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/,route=>route.abort());
 const page=await context.newPage();await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});await page.getByRole('heading',{level:1}).waitFor();
 for(const width of [320,375,430,1440,320,375]){
  await page.setViewportSize({width,height:900});
  for(const phase of ['initial-layout','fonts-settled']){
   if(phase==='fonts-settled')await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const size=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth,headerRight:document.querySelector('.header-actions').getBoundingClientRect().right}));
   expect(size.content,JSON.stringify({fonts,phase,...size})).toBeLessThanOrEqual(width+1);
   expect(size.headerRight).toBeLessThanOrEqual(width+1);
   checks.push({fonts,phase,...size,passed:true});
  }
 }
 if(fonts==='blocked'){await page.setViewportSize({width:320,height:900});await page.screenshot({path:'docs/redesign/screenshots/fixed-320-fallback-font.png',fullPage:true});}
 await context.close();
}
await fs.writeFile('docs/redesign/mobile-fix-results.json',JSON.stringify({executedAt:new Date().toISOString(),checks},null,2));
console.log('PASS',checks.length,'resize/font-state layout measurements');await browser.close();
