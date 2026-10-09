'use client';
import {useRef,useState} from 'react';
import {mealQuestions,lessonRecap} from './meal-lesson';
export default function MealCheck({onReview}:{onReview:(stage:number)=>void}){
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [checked,setChecked]=useState(false),[saved,setSaved]=useState(false);
 const feedback=useRef<HTMLDivElement>(null);
 const complete=mealQuestions.every((_,i)=>answers[i]!==undefined);
 const correct=mealQuestions.filter((q,i)=>answers[i]===q.correct).length;
 function reset(){setAnswers({});setChecked(false);setSaved(false);document.querySelector<HTMLInputElement>('#meal-answer-0-0')?.focus()}
 function save(){const url=URL.createObjectURL(new Blob([lessonRecap(answers)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='entero-meal-study.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setSaved(true)}
 return <section className="meal-check" aria-labelledby="meal-check-title" id="meal-check" tabIndex={-1}>
  <div className="meal-check-intro"><span className="eyebrow">FROM WATCHING TO UNDERSTANDING</span><h2 id="meal-check-title">Explain the cascade.</h2><p>Follow the five stages above, then try these three questions. Review any stage and bring the sequence back in your own words.</p><button onClick={()=>onReview(0)}>Review the GLP-1 sequence ↗</button><small>Practice only. Answers stay in this page until you leave or restart.</small></div>
  <form onSubmit={e=>{e.preventDefault();if(!complete)return;setChecked(true);setSaved(false);requestAnimationFrame(()=>feedback.current?.focus())}}>
   {mealQuestions.map((q,i)=><fieldset key={q.prompt}><legend><span>0{i+1}</span>{q.prompt}</legend>{q.options.map((option,j)=><label key={option} htmlFor={`meal-answer-${i}-${j}`}><input id={`meal-answer-${i}-${j}`} type="radio" name={`meal-question-${i}`} required checked={answers[i]===j} onChange={()=>{setAnswers(a=>({...a,[i]:j}));setChecked(false);setSaved(false)}}/><span>{option}</span></label>)}{checked&&<div className="meal-answer"><strong>{answers[i]===q.correct?'Matches the model.':'Review this step.'}</strong><p>{q.explanation}</p><button type="button" onClick={()=>onReview(q.stage)}>Revisit stage {q.stage+1} ↗</button></div>}</fieldset>)}
   <div className="meal-check-actions"><button type="submit" disabled={!complete}>Check my answers</button><button type="button" onClick={reset}>Start again</button></div>
   <div ref={feedback} tabIndex={-1} className="meal-check-result" aria-live="polite">{checked&&<><h3>{correct===mealQuestions.length?'The sequence is in place.':'A few links to revisit.'}</h3><p>{correct} of 3 answers match this teaching model. {correct===3?'Try explaining the pathway aloud without looking.':'Use the explanations above, revisit a stage, then change your answers and check again.'}</p><button type="button" onClick={save}>Save my study recap ↓</button><p className="meal-save-note">{saved?'Recap download requested. It includes your answers, the full sequence and sources.':'The recap includes your answers and the source-linked teaching notes.'}</p></>}</div>
  </form>
 </section>
}
