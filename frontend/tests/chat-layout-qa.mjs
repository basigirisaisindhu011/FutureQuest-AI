import { chromium, request, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(12000);
const api=await request.newContext({baseURL:'http://127.0.0.1:8080/api/'});const out=fileURLToPath(new URL('../../docs/redesign/',import.meta.url));const errors=[];page.on('pageerror',error=>errors.push(error.message));
const child=await(await api.post('auth/child/register',{data:{nickname:'Curious Explorer',avatar:'palette',ageGroup:'11-13',pin:'2468'}})).json();
await page.goto('http://127.0.0.1:5173/');await page.evaluate(user=>{localStorage.setItem('user',JSON.stringify(user));localStorage.setItem('token',user.token);},child);await page.reload();await page.getByRole('heading',{name:/Welcome back, Explorer/}).waitFor();
await page.getByRole('button',{name:'Explore games',exact:true}).click();await page.locator('.catalog-game-card').filter({has:page.getByRole('heading',{name:'Dream Designer',exact:true})}).getByRole('button').click();await page.locator('.difficulty-card').filter({has:page.getByText('Hard',{exact:true})}).click();
for(const name of ['Ocean blue','Reading nook','Stars','Soft light'])await page.getByRole('button',{name:new RegExp(name)}).click();await page.getByRole('heading',{name:'Adventure complete',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:/Welcome back, Explorer/}).waitFor();
const checks=[];
for(const width of [1440,375]){
 await page.setViewportSize({width,height:width===375?812:1000});
 expect(await page.locator('.chat-widget').evaluate(el=>getComputedStyle(el).position)).toBe('static');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(a11y.violations).toEqual([]);
 await page.screenshot({path:out+`screenshots/after-child-${width===375?'mobile':'desktop'}.png`,fullPage:true});
 await page.getByRole('button',{name:'Ask Questy',exact:true}).click();expect(await page.locator('.chat-widget').evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
 await page.getByLabel('Message to Questy').fill('coding');await page.getByRole('button',{name:'Send message'}).click();await expect(page.locator('.chat-message').last()).toContainText('Software');
 await page.getByRole('button',{name:'Close Questy chat'}).click();checks.push({name:`Non-obstructing launcher, live chat, accessibility and screenshot ${width}px`,status:'PASS'});
}
expect(errors).toEqual([]);await fs.writeFile(out+'chat-layout-results.json',JSON.stringify({executedAt:new Date().toISOString(),checks,runtimeErrors:errors},null,2));console.log('PASS',checks.length,'chat layout checks');await browser.close();await api.dispose();
