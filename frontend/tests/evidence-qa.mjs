const QA_PASSWORD = crypto.randomUUID();
import { request, expect } from '@playwright/test';
import fs from 'node:fs/promises';
const api = await request.newContext({baseURL:'http://127.0.0.1:8080/api/'});
const results=[]; const suffix=Date.now();
async function test(name,expected,fn){try{const actual=await fn();results.push({name,expected,actual,status:'PASS'});}catch(e){results.push({name,expected,actual:e.message,status:'FAIL'});}console.log(results.at(-1).status,name);}
async function child(name){return (await api.post('auth/child/register',{data:{nickname:`QA ${name} ${suffix}`,avatar:'star',ageGroup:'11-13',pin:'2468'}})).json();}
async function parent(name){return (await api.post('auth/register',{data:{username:`qa${name}${suffix}`,email:`qa${name}${suffix}@example.test`,password:QA_PASSWORD,role:'PARENT'}})).json();}
const p=await parent('evidence'); const headers={Authorization:`Bearer ${p.token}`};
const profiles={creative:['dream_designer'],technology:['puzzle_lab'],science:['science_lab'],business:['mini_entrepreneur'],balanced:['dream_designer','puzzle_lab','science_lab','mini_entrepreneur'],limited:[]};
const snapshots=[];
for(const [name,games] of Object.entries(profiles)){
 const c=await child(name), h={Authorization:`Bearer ${c.token}`};
 await api.post('parent/link-child',{headers,data:{playerCode:c.playerCode,pin:'2468'}});
 for(const gameId of games) for(let n=0;n<3;n++) await api.post('child/games/level-complete',{headers:h,data:{gameId,gameName:gameId,gameCategory:({dream_designer:'Creativity & Design',puzzle_lab:'Technology & Logic',science_lab:'Science & Research',mini_entrepreneur:'Business & Leadership'})[gameId],level:n===0?'HARD':'EASY',...(gameId==='puzzle_lab'?{accuracy:40}:{})}});
 const insight=await(await api.get(`parent/children/${c.childId}/insights`,{headers})).json();
 const analysis=await(await api.get('child/analysis',{headers:h})).json();
 snapshots.push({name,childId:c.childId,insight,analysis});
 await test(`${name}: limited evidence confidence`,'Three same-day repeats must not be strong longitudinal evidence',async()=>{expect(Object.values(insight.evidenceConfidence)).not.toContain('Strong Evidence');return insight.evidenceConfidence;});
 await test(`${name}: no fabricated strengths`,'Unmeasured vocabulary/logic strengths absent',async()=>{expect(analysis.strengths).toEqual([]);return analysis.strengths;});
 if(games.length) await test(`${name}: highest difficulty`,'HARD remains highest after EASY',async()=>{const levels=Object.entries(insight.levelIndicators).filter(([cat])=>insight.playCounts[cat]>0);for(const [,label]of levels)expect(label).toContain('Highest Tried: HARD');return levels;});
 if(name==='technology') await test('Repeated equal task scores do not inflate skill','Mean stays 40',async()=>{expect(insight.skillScores['Technology & Logic']).toBe(40);return insight.skillScores['Technology & Logic'];});
 if(name==='limited') await test('No-history skill abstains','All skill scores unknown',async()=>{expect(Object.values(insight.skillScores).every(x=>x==null)).toBeTruthy();return insight.skillScores;});
}
const c=await child('boundary'), h={Authorization:`Bearer ${c.token}`};
await test('Unknown parent cannot read child','403',async()=>{const r=await api.get(`parent/children/${c.childId}/activity`,{headers});expect(r.status()).toBe(403);return r.status();});
await test('Code alone cannot grant unrelated parent access','Link denied without child verification',async()=>{const r=await api.post('parent/link-child',{headers,data:{playerCode:c.playerCode}});expect(r.ok()).toBeFalsy();return r.status();});
await test('Invalid PIN cannot link child','Link denied for wrong PIN',async()=>{const other=await parent('wrongpin');const r=await api.post('parent/link-child',{headers:{Authorization:`Bearer ${other.token}`},data:{playerCode:c.playerCode,pin:'9999'}});expect(r.ok()).toBeFalsy();return r.status();});
await test('Public lookup does not disclose player codes','No playerCode in public search',async()=>{const r=await api.get('auth/players?name=QA');const data=await r.json();expect(data.some(x=>x.playerCode)).toBe(false);return {status:r.status(),count:data.length};});
await test('Feedback cannot reward nonexistent activity','400 or 404',async()=>{const r=await api.post('feedback',{headers:h,data:{activityType:'game',activityId:999999,rating:5,comment:'Loved it'}});expect([400,404]).toContain(r.status());return r.status();});
await test('Duplicate completion is idempotent','Same record ID and only one reward',async()=>{const payload={gameId:'dream_designer',gameCategory:'Creativity & Design',level:'EASY',sessionId:crypto.randomUUID()};const first=await(await api.post('child/games/level-complete',{headers:h,data:payload})).json();const second=await(await api.post('child/games/level-complete',{headers:h,data:payload})).json();expect(second.recordId).toBe(first.recordId);return{first,second};});
await test('Concurrent duplicate completion is idempotent','Three concurrent retries return one record',async()=>{const payload={gameId:'dream_designer',gameCategory:'Creativity & Design',level:'EASY',sessionId:crypto.randomUUID()};const responses=await Promise.all(Array.from({length:3},()=>api.post('child/games/level-complete',{headers:h,data:payload})));for(const r of responses)expect(r.status()).toBe(200);const data=await Promise.all(responses.map(r=>r.json()));expect(new Set(data.map(x=>x.recordId)).size).toBe(1);return data.map(x=>x.recordId);});
const ownRecord=await(await api.post('child/games/level-complete',{headers:h,data:{gameId:'dream_designer',level:'EASY',sessionId:crypto.randomUUID()}})).json();
await test('Foreign game feedback is rejected','400 without reward',async()=>{const other=await child('foreignfeedback');const r=await api.post('feedback',{headers:{Authorization:`Bearer ${other.token}`},data:{activityType:'game',activityId:ownRecord.recordId,rating:5}});expect(r.status()).toBe(400);return r.status();});
await test('Repeated feedback rewards only once','Same feedback ID and exactly 10 additional XP',async()=>{const before=await(await api.get('child/profile',{headers:h})).json();const payload={activityType:'game',activityId:ownRecord.recordId,rating:5};const first=await(await api.post('feedback',{headers:h,data:payload})).json();const second=await(await api.post('feedback',{headers:h,data:payload})).json();const after=await(await api.get('child/profile',{headers:h})).json();expect(second.id).toBe(first.id);expect(after.points-before.points).toBe(10);return {feedbackId:first.id,additionalXP:after.points-before.points};});
await test('Invalid child login PIN','401',async()=>{const r=await api.post('auth/child/login',{data:{playerCode:c.playerCode,pin:'9999'}});expect(r.status()).toBe(401);return r.status();});
await test('Invalid child player code','401',async()=>{const r=await api.post('auth/child/login',{data:{playerCode:'CQ0000',pin:'2468'}});expect(r.status()).toBe(401);return r.status();});
await fs.mkdir('qa-reports/artifacts',{recursive:true});
await fs.writeFile(process.env.QA_EVIDENCE_OUTPUT||'qa-reports/artifacts/evidence-baseline.json',JSON.stringify({executedAt:new Date().toISOString(),results,profiles:snapshots,method:'Controlled synthetic histories posted through real HTTP; not browser-played histories'},null,2));
await api.dispose(); console.log('RESULT',results.filter(x=>x.status==='PASS').length,'passed',results.filter(x=>x.status==='FAIL').length,'failed');
