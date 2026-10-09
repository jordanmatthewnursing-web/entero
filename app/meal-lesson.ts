export const glpJourney=[
 {title:'A meal reaches the gut',body:'Digested nutrients enter the intestinal lumen. This view follows one representative GLP-1-producing L cell; a meal also activates many other pathways.'},
 {title:'The L cell senses nutrients',body:'L cells can respond through several nutrient-sensing routes. The highlighted surface contact is one route, not a universal receptor or a complete account of GLP-1 release.'},
 {title:'GLP-1 leaves the cell',body:'After activation, secretory granules release GLP-1 from the basal side of the L cell into the surrounding tissue.'},
 {title:'The signal travels',body:'GLP-1 can act through circulation and local neural routes. This animated path shows a functional connection, not a measured travel time or concentration.'},
 {title:'A target responds',body:'At pancreatic islets, GLP-1 helps amplify insulin secretion when glucose is elevated. The target response is illustrative, not a patient-specific prediction.'}
];

export const mealQuestions = [
 {prompt:'What starts the pathway shown here?', options:['Digested nutrients reach the intestinal lumen.','The animation clock reaches a fixed time after eating.','The pancreas releases GLP-1 into the gut.'],correct:0,stage:0,explanation:glpJourney[0].body},
 {prompt:'Which sequence matches the teaching model?',options:['Target response → nutrient sensing → hormone release','Nutrient sensing → hormone release → target response','Hormone release → nutrient sensing → meal arrival'],correct:1,stage:2,explanation:'The model follows a luminal cue, cell sensing, basal release, signal transport and a target response.'},
 {prompt:'What can the moving signal tell you?',options:['Your hormone concentration after a particular meal.','The exact time a signal takes to reach a target.','A functional connection; timing and response size are illustrative.'],correct:2,stage:3,explanation:glpJourney[3].body}
];
export function lessonRecap(answers:Record<number,number>){
 return ['ENTERO / AFTER A MEAL','Study recap · representative GLP-1 pathway','',...glpJourney.flatMap((s,i)=>[`${i+1}. ${s.title}`,s.body,'']),'SELF-CHECK',...mealQuestions.flatMap((q,i)=>[q.prompt,`Your answer: ${q.options[answers[i]]??'Not answered'}`,`Teaching answer: ${q.options[q.correct]}`,q.explanation,'']),'This is a practice exercise, not an assessment of clinical competence. The model does not predict personal hormone levels, treatment response or timing.','Sources:','https://pubmed.ncbi.nlm.nih.gov/35629924/','https://pubmed.ncbi.nlm.nih.gov/26571400/','Model and limitations: https://entero.jordanmatthew.me/'].join('\n');
}
