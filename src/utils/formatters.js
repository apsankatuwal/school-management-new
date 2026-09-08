export const date=v=>v?new Date(v).toLocaleDateString():"—";
export const userName=v=>v?.firstName?`${v.firstName} ${v.lastName||""}`.trim():"—";
export const itemLabel=(v,fallback="—")=>v?.admissionNumber||v?.employeeId||v?.subjectName||v?.examName||v?.className||fallback;
export const human=k=>k.replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase());
