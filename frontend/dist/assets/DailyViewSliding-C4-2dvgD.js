import{o as i,d,e,C as A,u as X,y as w,c as ee,a as D,N as P,z as te,O as G,R as F,m as Z,q as r,x as q,g as n,D as b,f as se,v as le,F as V,A as M,t as f,E as k,G as ae,h as S,k as J,Z as oe,S as ne,M as re,w as W}from"./index-DRfNb0Qr.js";import{s as ie}from"./client-_9q7Vsbu.js";function yt(o,h){return i(),d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z","clip-rule":"evenodd"})])}function kt(o,h){return i(),d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z","clip-rule":"evenodd"})])}function de(o,h){return i(),d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{d:"m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"}),e("path",{d:"M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"})])}function Vt(o,h){return i(),d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{d:"M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"})])}function ce(o,h){return i(),d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z","clip-rule":"evenodd"})])}const ue=async o=>A.post("/schedules",o),me=async o=>A.get(`/schedules/${o}`),he=async(o,h)=>A.put(`/schedules/${o}`,h),$t=async(o,h)=>A.get(`/schedules/calendar/${o}/${h}`),Dt=async(o,h,p)=>A.get(`/schedules/calendar/${o}/${h}/${p}`),ge=async(o,h,p)=>A.get(`/schedules/calendar/daily/${o}/${h}/${p}`),fe={className:"w-full bg-neutral-50 shadow-lg rounded-lg p-6"},_e={className:"border-b pb-2 mb-4"},be=e("h2",{class:"font-title font-bold"},"상담일정",-1),pe=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18 18 6M6 6l12 12"})],-1),xe=[pe],ve={class:"grid gap-4"},we={class:"mb-4"},ye=e("label",{for:"client-search",class:"block text-sm font-medium text-gray-700"},"내담자를 선택하세요.",-1),ke={class:"relative mt-1"},Ve={class:"absolute inset-y-0 right-0 flex items-center pr-3"},$e={key:0,class:"absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"},De=["onClick"],Se={key:1,class:"absolute mt-2 text-sm text-gray-500"},Ce={class:"grid grid-cols-1 gap-4"},Me={class:"mb-4"},Te=e("label",{for:"password",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("상담사 "),e("span",{class:"text-red-500"},"*")],-1),Ue=e("option",{value:""},"상담사를 선택하세요.",-1),je=["value"],Ae={class:"grid grid-cols-2 gap-4"},Be=e("label",{class:"block mb-1 text-gray-700"},[S("내담자 이름 "),e("span",{class:"text-red-500"},"*")],-1),Ee=e("label",{class:"block mb-1 text-gray-700"},[S("내담자 휴대전화번호 "),e("span",{class:"text-red-500"},"*")],-1),He={class:"mb-4"},Ie=e("label",{for:"email",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("일정제목 "),e("span",{class:"text-red-500"},"*")],-1),Ne={class:"grid grid-cols-2 gap-4"},Oe={class:"mb-4"},ze=e("label",{for:"start_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("일정시작일 "),e("span",{class:"text-red-500"},"*")],-1),qe={class:"mb-4"},Fe=e("label",{for:"finish_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("일정종료일 "),e("span",{class:"text-red-500"},"*")],-1),Ze={class:"grid grid-cols-2 gap-4"},Le={class:"mb-4"},Ye=e("label",{for:"start_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("시작시간 "),e("span",{class:"text-red-500"},"*")],-1),Re=["value"],We={class:"mb-4"},Pe=e("label",{for:"finish_time",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[S("종료시간 "),e("span",{class:"text-red-500"},"*")],-1),Ge=["value"],Je=e("label",{class:"block mb-1 text-gray-700"},"메모",-1),Ke=e("div",{class:"text-right text-gray-500 text-sm"},"0 / 100",-1),Qe=e("button",{type:"submit",class:"bg-green-600 text-white rounded-md p-2 w-[80px]"}," 확인 ",-1),St={__name:"ScheduleFormSliding",props:{isVisible:Boolean,scheduleId:String,scheduleDate:String,scheduleTime:String},emits:["close"],setup(o,{emit:h}){X();const p=J("showModal"),B=h,u=o,x=w(""),E=w([]),C=w([]),L=w({}),H=w([]),I=async()=>{const a=x.value.toLowerCase();if(!a){C.value=[];return}try{const s=await ie(a);E.value=s.data,C.value=E.value}catch(s){console.error("Error fetching clients:",s)}},N=async a=>{L.value=a,x.value=a.client_name,t.client_name=a.client_name,t.phone_number=a.phone_number,C.value=[];try{const s=await oe(a.consultant);t.teacher_username=s.username,t.consultant=s.username,t.consultant_name=s.full_name}catch(s){console.error("Error fetching clients:",s)}},c=w(null),g=w(null),_=w([]),v=w([]),Y=()=>{const a=[];let s=new Date;for(s.setHours(9,0,0,0);s.getHours()<18;)a.push(O(s)),s.setMinutes(s.getMinutes()+10);return a},O=a=>{const s=a.getHours().toString().padStart(2,"0"),l=a.getMinutes().toString().padStart(2,"0");return`${s}:${l}`};function m(a){return a<10?`0${a}:00`:`${a}:00`}const $=()=>{if(!t.start_time)return;const[a,s]=t.start_time.split(":").map(Number),l=new Date;l.setHours(a,s,0,0);const U=[],y=new Date(l);y.setHours(l.getHours()+1);let j=new Date(l);for(j.setMinutes(j.getMinutes()+10);j<=y;)U.push(O(j)),j.setMinutes(j.getMinutes()+10);v.value=U,t.finish_time=v.value[0]},z=ee({consultant_name:D().required("내담자를 선택해주세요."),client_name:D().required("내담자를 선택해주세요."),phone_number:D().required("휴대전화번호를 입력하세요."),title:D().required("일정제목을 입력해주세요."),start_date:D().required("일정시작일을 선택해주세요."),finish_date:D().required("일정종료일을 선택해주세요."),start_time:D().required("시작시간을 선택해주세요."),finish_time:D().required("종료시간을 선택해주세요.")}),t=P({id:"",teacher_username:"",consultant_name:"",client_id:"",client_name:"",title:"",start_date:u.scheduleDate,finish_date:u.scheduleDate,start_time:m(u.scheduleTime),finish_time:m(u.scheduleTime),memo:"",teacher:{}}),T=()=>{B("close")},R=async()=>{var a,s,l,U;if(!u.scheduleId){Object.keys(t).forEach(y=>{t[y]=""}),console.log("scheduleDate:",u.scheduleDate),t.start_date=u.scheduleDate,t.finish_date=u.scheduleDate;return}console.log("scheduleId",u.scheduleId);try{const y=await me(u.scheduleId);console.log("scheduleInfo:",y),Object.assign(t,y),t.client_name=(a=t.clientinfo)==null?void 0:a.client_name,t.phone_number=(s=t.clientinfo)==null?void 0:s.phone_number,t.consultant=(l=t.teacher)==null?void 0:l.username,t.consultant_name=(U=t.teacher)==null?void 0:U.full_name,c.value=t.start_time,$(),g.value=t.finish_time}catch(y){console.error("Error fetching user:",y)}},K=async()=>{try{const a=await ne();console.log("teacherList:",a),H.value=a.map(s=>({value:s.username,text:s.full_name}))}catch(a){console.error("Error fetching client:",a)}};te(()=>{R(),K()}),G(()=>{_.value=Y(),console.log(_.value)});const Q=async a=>{console.log("submitting:",a),Object.assign(t,a);try{t.id?(await he(t.id,t),p("상담일정 정보가 수정되었습니다.")):(await ue(t),p("상담일정 정보가 등록되었습니다."))}catch(s){p("상담일정 정보 저장 중 오류가 발생했습니다."),console.error("Error registering schedule data:",s)}B("close")};return F(()=>u.scheduleId,(a,s)=>{a!==s&&R()}),F(()=>u.scheduleDate,(a,s)=>{console.log("newScheduleDate:",a),t.start_date=a,t.finish_date=a}),F(()=>u.scheduleTime,(a,s)=>{console.log("newScheduleTime:",m(a)),t.start_time=m(a),$()}),(a,s)=>(i(),d(V,null,[e("div",Z({onClick:T},a.$attrs,{class:["fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000 z-49",{"opacity-100 block":o.isVisible,"opacity-0 hidden":!o.isVisible}]}),null,16),e("div",Z(a.$attrs,{class:["fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out",{"translate-x-full":!o.isVisible,"translate-x-0":o.isVisible}]}),[e("div",fe,[e("div",_e,[e("div",{class:"flex items-center justify-evenly mb-2"},[be,e("button",{class:"ml-auto",onClick:T},xe)]),r(n(ae),{onSubmit:Q,"validation-schema":n(z),"initial-values":t,class:"space-y-4 text-sm"},{default:q(()=>[r(n(b),{type:"hidden",name:"id",modelValue:t.id,"onUpdate:modelValue":s[0]||(s[0]=l=>t.id=l)},null,8,["modelValue"]),r(n(b),{type:"hidden",name:"teacher_username",modelValue:t.teacher_username,"onUpdate:modelValue":s[1]||(s[1]=l=>t.teacher_username=l)},null,8,["modelValue"]),r(n(b),{type:"hidden",name:"client_id",modelValue:t.client_id,"onUpdate:modelValue":s[2]||(s[2]=l=>t.client_id=l)},null,8,["modelValue"]),e("div",ve,[e("div",we,[ye,e("div",ke,[se(e("input",{"onUpdate:modelValue":s[3]||(s[3]=l=>x.value=l),onInput:I,type:"text",id:"client-search",placeholder:"내담자 검색...",class:"block w-full py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"},null,544),[[le,x.value]]),e("div",Ve,[r(n(ce),{class:"h-5 w-5 text-gray-400","aria-hidden":"true"})]),e("div",null,[C.value.length>0?(i(),d("ul",$e,[(i(!0),d(V,null,M(C.value,l=>(i(),d("li",{key:l.id,onClick:U=>N(l),class:"cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"},f(l.client_name),9,De))),128))])):(i(),d("p",Se,"검색 결과가 없습니다."))])])])]),e("div",Ce,[e("div",Me,[Te,r(n(b),{name:"consultant",modelValue:t.consultant,"onUpdate:modelValue":s[4]||(s[4]=l=>t.consultant=l),as:"select",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:q(()=>[Ue,(i(!0),d(V,null,M(H.value,l=>(i(),d("option",{key:l.value,value:l.value},f(l.text),9,je))),128))]),_:1},8,["modelValue"]),r(n(k),{name:"consultant_options",class:"text-red-500 text-xs italic mt-2"})])]),e("div",Ae,[e("div",null,[Be,r(n(b),{name:"client_name",as:"input",type:"text",modelValue:t.client_name,"onUpdate:modelValue":s[5]||(s[5]=l=>t.client_name=l),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 이름을 입력하세요."},null,8,["modelValue"]),r(n(k),{name:"client_name",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[Ee,r(n(b),{name:"phone_number",as:"input",type:"text",modelValue:t.phone_number,"onUpdate:modelValue":s[6]||(s[6]=l=>t.phone_number=l),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 휴대전화번호를 입력하세요."},null,8,["modelValue"]),r(n(k),{name:"phone_number",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[e("div",He,[Ie,r(n(b),{type:"text",name:"title",modelValue:t.title,"onUpdate:modelValue":s[7]||(s[7]=l=>t.title=l),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(k),{name:"title",class:"text-red-500 text-xs italic mt-2"})])]),e("div",Ne,[e("div",Oe,[ze,r(n(b),{type:"date",name:"start_date",modelValue:t.start_date,"onUpdate:modelValue":s[8]||(s[8]=l=>t.start_date=l),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(k),{name:"start_date",class:"text-red-500 text-xs italic mt-2"})]),e("div",qe,[Fe,r(n(b),{type:"date",name:"finish_date",modelValue:t.finish_date,"onUpdate:modelValue":s[9]||(s[9]=l=>t.finish_date=l),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(k),{name:"finish_date",class:"text-red-500 text-xs italic mt-2"})])]),e("div",Ze,[e("div",Le,[Ye,r(n(b),{name:"start_time",id:"start_time",modelValue:t.start_time,"onUpdate:modelValue":s[10]||(s[10]=l=>t.start_time=l),as:"select",onChange:$,class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:q(()=>[(i(!0),d(V,null,M(_.value,l=>(i(),d("option",{key:l,value:l},f(l),9,Re))),128))]),_:1},8,["modelValue"]),r(n(k),{name:"start_time",class:"text-red-500 text-xs italic mt-2"})]),e("div",We,[Pe,r(n(b),{name:"finish_time",id:"finish_time",modelValue:t.finish_time,"onUpdate:modelValue":s[11]||(s[11]=l=>t.finish_time=l),as:"select",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:q(()=>[(i(!0),d(V,null,M(v.value,l=>(i(),d("option",{key:l,value:l},f(l),9,Ge))),128))]),_:1},8,["modelValue"]),r(n(k),{name:"finish_time",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[Je,r(n(b),{name:"memo",as:"textarea",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",rows:"3",modelValue:t.memo,"onUpdate:modelValue":s[12]||(s[12]=l=>t.memo=l),placeholder:"내담자의 상담정보를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다."},null,8,["modelValue"]),r(n(k),{name:"memo",class:"text-red-500 text-xs italic mt-2"}),Ke]),e("div",{class:"flex justify-between mt-4"},[e("button",{type:"button",onClick:T,class:"bg-gray-400 text-white rounded-md p-2 w-[80px]"}," 취소 "),Qe])]),_:1},8,["validation-schema","initial-values"])])])],16)],64))}},Xe={className:"w-full bg-neutral-50 shadow-lg rounded-lg p-6"},et={className:"border-b pb-2 mb-4"},tt=e("h2",{class:"font-title font-bold"},"상담일정",-1),st=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18 18 6M6 6l12 12"})],-1),lt=[st],at={class:"text-lg font-semibold text-gray-500 flex items-center justify-center"},ot={class:"grid grid-cols-1 gap-y-6"},nt={class:"w-12 text-xs font-semibold"},rt={class:"w-full"},it=["onClick"],dt={class:"flex justify-between items-center px-1 h-full w-full"},ct={class:"inline-block font-semibold"},ut={class:"ml-auto inline-block"},mt={class:"flex justify-between items-center px-1 h-full w-full"},ht=e("span",{class:"inline-block"},"상담사",-1),gt={class:"ml-auto inline-block"},ft={class:"flex justify-between items-center px-1 h-full w-full"},_t=e("span",{class:"inline-block"},"상담시간",-1),bt={class:"ml-auto inline-block font-semibold"},pt={class:"flex justify-center items-center px-1 h-full w-full"},xt=["onClick"],Ct={__name:"DailyViewSliding",props:{isDailyViewSlidingVisible:Boolean,scheduleDate:String,scheduleTime:String},emits:["close","clickCalendarSchedule"],setup(o,{emit:h}){J("showModal");const p=o,B=h,u=w([]),x=P({}),E=(c,g,_)=>{_.stopPropagation(),x[c]||(x[c]={}),x[c][g]=!x[c][g]},C=(c,g)=>{B("clickCalendarSchedule",c,g)};function L(c){const g=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],_=new Date(c);return g[_.getDay()]}const H=c=>{const g=c>=12?"PM":"AM";return`${c%12||12} ${g}`},I=()=>{B("close")},N=async()=>{if(!p.scheduleDate)return;const[c,g,_]=p.scheduleDate.split("-");try{const v=await ge(c,g,_);u.value=v.data,console.log("daily sliding schedule_data:",u.value)}catch(v){console.error("Error fetching monthly schedule data:",v)}};return G(()=>{N()}),F(()=>p.scheduleDate,(c,g)=>{c!==g&&N()}),(c,g)=>(i(),d(V,null,[e("div",Z({onClick:I,class:"fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000 z-39"},c.$attrs,{class:{"opacity-100 block":o.isDailyViewSlidingVisible,"opacity-0 hidden":!o.isDailyViewSlidingVisible}}),null,16),e("div",Z({class:"fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-40 transition-transform duration-1000 ease-in-out"},c.$attrs,{class:{"translate-x-full":!o.isDailyViewSlidingVisible,"translate-x-0":o.isDailyViewSlidingVisible}}),[e("div",Xe,[e("div",et,[e("div",{class:"flex items-center justify-evenly mb-2"},[tt,e("button",{class:"ml-auto",onClick:I},lt)]),e("div",null,[e("div",at,[e("span",null,f(o.scheduleDate)+"("+f(L(o.scheduleDate))+")",1)])]),e("div",ot,[(i(!0),d(V,null,M(u.value,(_,v)=>(i(),d("div",{key:v,class:"flex text-gray-500 border-b min-h-10 h-auto flex items-center pl-2 divide-x divide-gray-300 w-full"},[e("div",nt,f(H(v)),1),e("div",rt,[(i(!0),d(V,null,M(_,(Y,O)=>(i(),d("div",{key:O,class:"flex-row items-center justify-between w-full"},[(i(!0),d(V,null,M(Y,(m,$)=>{var z,t;return i(),d("div",{class:re(["flex-row text-xs text-blue-600 border border-blue-700/40 rounded-md m-1 space-y-1 w-full",["transform transition duration-500 ease-in-out overflow-hidden",(z=x[m.schedule_time])!=null&&z[$]?"scale-105 h-auto min-h-6 w-full pt-1":"scale-100 h-6",(t=x[m.schedule_time])!=null&&t[$]?"bg-white/100":m.teacher_usercolor]]),key:$,onClick:W(T=>E(m.schedule_time,$,T),["stop"])},[e("div",dt,[e("span",ct,f(m.schedule_time),1),e("span",ut,"["+f(m.client_name)+"] "+f(m.teacher_expertise),1)]),e("div",mt,[ht,e("span",gt,f(m.teacher_fullname),1)]),e("div",ft,[_t,e("span",bt,f(m.start_time)+" ~ "+f(m.finish_time),1)]),e("div",pt,[e("button",{class:"text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20",onClick:W(T=>C(m.schedule_id,m.schedule_date),["stop"])},[r(n(de),{class:"w-4 h-4"})],8,xt)])],10,it)}),128))]))),128))])]))),128))])])])],16)],64))}};export{St as _,Ct as a,kt as b,de as c,Vt as d,$t as e,Dt as g,yt as r};