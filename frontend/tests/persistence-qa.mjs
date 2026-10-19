const QA_PASSWORD = crypto.randomUUID();
import {chromium,request,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const root='qa-reports/artifacts',fixture=`${root}/persistence-fixture.local.json`;
const api=await request.newContext({baseURL:'http://127.0.0.1:8080/api/'});const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();page.setDefaultTimeout(12000);
let data;
if(process.argv.includes('--verify'))data=JSON.parse(await fs.readFile(fixture,'utf8'));
else{
 const suffix=Date.now();const child=await(await api.post('auth/child/register',{data:{nickname:`QA Persist ${suffix}`,avatar:'robot',ageGroup:'11-13',pin:'2468'}})).json();
 const parent=await(await api.post('auth/register',{data:{username:`qapersist${suffix}`,email:`qapersist${suffix}@example.test`,password:QA_PASSWORD,role:'PARENT'}})).json();
 await api.post('parent/link-child',{headers:{Authorization:`Bearer ${parent.token}`},data:{playerCode:child.playerCode,pin:'2468'}});
 data={child,parent};
}
await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});await page.evaluate(u=>{localStorage.setItem('token',u.token);localStorage.setItem('user',JSON.stringify(u));},data.child);await page.reload({waitUntil:'domcontentloaded'});
await expect(page.getByRole('heading',{name:/Welcome back, Explorer/})).toBeVisible();
if(!process.argv.includes('--verify')){
 await page.getByRole('button',{name:'Explore games',exact:true}).click();await page.locator('.catalog-game-card').filter({has:page.getByRole('heading',{name:'Dream Designer',exact:true})}).getByRole('button').click();await page.locator('.difficulty-card').filter({has:page.getByText('Hard',{exact:true})}).click();
 const response=page.waitForResponse(r=>r.url().endsWith('/child/games/level-complete'));for(let i=0;i<4;i++)await page.locator('.game-shell button').filter({hasNotText:/Exit/}).first().click();data.completion=await(await response).json();await expect(page.getByRole('heading',{name:'Adventure complete',exact:true})).toBeVisible();
 await fs.writeFile(fixture,JSON.stringify(data));console.log('PREPARED',data.completion.recordId);
}else{
 const login=await api.post('auth/child/login',{data:{playerCode:data.child.playerCode,pin:'2468'}});expect(login.ok()).toBeTruthy();
 const activity=await(await api.get(`parent/children/${data.child.childId}/activity`,{headers:{Authorization:`Bearer ${data.parent.token}`}})).json();const record=activity.games.find(x=>x.id===data.completion.recordId);expect(record.gameType).toBe('dream_designer');expect(record.pointsEarned).toBe(40);
 const profile=await(await api.get('child/profile',{headers:{Authorization:`Bearer ${data.child.token}`}})).json();expect(profile.points).toBe(40);
 await page.evaluate(u=>{localStorage.setItem('token',u.token);localStorage.setItem('user',JSON.stringify(u));},data.parent);await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('.activity-chart')).toBeVisible();await expect(page.getByText('Dream Designer',{exact:true}).first()).toBeVisible();
 await page.screenshot({path:`${root}/persistence-after-restart.png`,fullPage:true});await fs.writeFile(`${root}/persistence-results.json`,JSON.stringify({executedAt:new Date().toISOString(),status:'PASS',recordId:record.id,points:profile.points,verified:['child login','stored session ID and XP','parent link','browser dashboard after actual backend restart']},null,2));console.log('PASS database records and browser sessions survived restart');
}
await browser.close();await api.dispose();
