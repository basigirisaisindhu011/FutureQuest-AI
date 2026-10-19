const QA_PASSWORD = crypto.randomUUID();
import {chromium,request,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const out='qa-reports/artifacts/browser-profiles';await fs.mkdir(out,{recursive:true});
const api=await request.newContext({baseURL:'http://127.0.0.1:8080/api/'}),browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});page.setDefaultTimeout(12000);
const profiles={creative:['Dream Designer','Dream Designer'],technology:['Puzzle Laboratory','Puzzle Laboratory'],science:['Science Lab','Science Lab'],business:['Mini Entrepreneur','Mini Entrepreneur'],balanced:['Dream Designer','Puzzle Laboratory','Science Lab','Mini Entrepreneur'],limited:['Dream Designer']};
const results=[],snapshots=[];const suffix=Date.now();
const parent=await(await api.post('auth/register',{data:{username:`qaprofile${suffix}`,email:`qaprofile${suffix}@example.test`,password:QA_PASSWORD,role:'PARENT'}})).json();
const headers={Authorization:`Bearer ${parent.token}`};
for(const [name,games] of Object.entries(profiles)){
 try{
 const child=await(await api.post('auth/child/register',{data:{nickname:`QA Profile ${name} ${suffix}`,avatar:'leaf',ageGroup:'11-13',pin:'2468'}})).json();
 await api.post('parent/link-child',{headers,data:{playerCode:child.playerCode,pin:'2468'}});
 await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});
 await page.evaluate(u=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('token',u.token);},child);
 for(const game of games){
  await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Explore games',exact:true}).click();
  await page.locator('.catalog-game-card').filter({has:page.getByRole('heading',{name:game,exact:true})}).getByRole('button').click();
  await page.locator('.difficulty-card').filter({has:page.getByText('Easy',{exact:true})}).click();
  const completion=page.waitForResponse(r=>r.url().endsWith('/child/games/level-complete')&&r.request().method()==='POST');completion.catch(()=>{});
  for(let step=0;step<(game==='Puzzle Laboratory'?5:4);step++)await page.locator('.game-shell button').filter({hasNotText:/Exit|Reset|Back/}).first().click();
  expect((await completion).ok()).toBeTruthy();await expect(page.getByRole('heading',{name:'Adventure complete',exact:true})).toBeVisible();
 }
 const analysis=await(await api.get('child/analysis',{headers:{Authorization:`Bearer ${child.token}`}})).json();
 const insight=await(await api.get(`parent/children/${child.childId}/insights`,{headers})).json();
 const activity=await(await api.get(`parent/children/${child.childId}/activity`,{headers})).json();
 expect(activity.games.length).toBe(games.length);expect(analysis.totalGamesPlayed).toBe(games.length);expect(analysis.strengths).toEqual([]);
 const counts={};for(const record of activity.games)counts[record.gameCategory]=(counts[record.gameCategory]||0)+1;
 for(const domain of analysis.topInterests)expect(counts[domain]).toBeGreaterThan(0);
 expect(Object.values(insight.evidenceConfidence)).not.toContain('Strong Evidence');
 await page.screenshot({path:`${out}/${name}-result.png`,fullPage:true});
 snapshots.push({name,analysis,insight,records:activity.games.map(r=>({id:r.id,game:r.gameType,domain:r.gameCategory,score:r.score}))});
 results.push({name:`Browser-played ${name} profile`,expected:'Saved game history drives domain summary; no unmeasured strengths or confident same-day conclusion',actual:`${games.length} real UI completions; domains ${analysis.topInterests.join(', ')}`,status:'PASS'});
 }catch(e){results.push({name:`Browser-played ${name} profile`,expected:'Gameplay-supported profile',actual:e.message,status:'FAIL'});}
 console.log(results.at(-1).status,name);
 await fs.writeFile(`${out}/results.json`,JSON.stringify({executedAt:new Date().toISOString(),results,snapshots},null,2));
}
await browser.close();await api.dispose();console.log('RESULT',results.filter(x=>x.status==='PASS').length,'passed',results.filter(x=>x.status==='FAIL').length,'failed');
