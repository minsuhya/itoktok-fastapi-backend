import{o as c,d as u,e,z as Z,u as W,i as G,q as m,c as K,a as D,M as L,s as Q,N as P,O as R,J as H,n as r,p as A,g as n,A as x,f as X,v as ee,F as $,x as j,t as N,E as w,B as te,j as C,y as se}from"./index-B8DgOXJA.js";import{e as ae}from"./user-BJoIGgNa.js";import{s as le}from"./client-Nu66AEKO.js";import{r as oe,a as ne}from"./ChevronRightIcon-CesUXREF.js";function re(b,g){return c(),u("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{d:"M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"})])}function de(b,g){return c(),u("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z","clip-rule":"evenodd"})])}const ie=async b=>Z.post("/schedules",b),ce=async(b,g)=>Z.get(`/schedules/calendar/${b}/${g}`),ue={className:"w-full bg-neutral-50 shadow-lg rounded-lg p-6"},me={className:"border-b pb-2 mb-4"},he=e("h2",{class:"font-title font-bold"},"상담일정",-1),be=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18 18 6M6 6l12 12"})],-1),ge=[be],pe={class:"grid gap-4"},fe={class:"mb-4"},ve=e("label",{for:"client-search",class:"block text-sm font-medium text-gray-700"},"내담자를 선택하세요.",-1),xe={class:"relative mt-1"},_e={class:"absolute inset-y-0 right-0 flex items-center pr-3"},ye={key:0,class:"absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"},we=["onClick"],ke={key:1,class:"absolute mt-2 text-sm text-gray-500"},Ve={class:"grid grid-cols-1 gap-4"},Me={class:"mb-4"},De=e("label",{for:"password",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("상담사 "),e("span",{class:"text-red-500"},"*")],-1),$e={class:"grid grid-cols-2 gap-4"},Ce=e("label",{class:"block mb-1 text-gray-700"},[C("내담자 이름 "),e("span",{class:"text-red-500"},"*")],-1),Se=e("label",{class:"block mb-1 text-gray-700"},[C("내담자 휴대전화번호 "),e("span",{class:"text-red-500"},"*")],-1),Ie={class:"mb-4"},Ue=e("label",{for:"email",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("일정제목 "),e("span",{class:"text-red-500"},"*")],-1),Ne={class:"grid grid-cols-2 gap-4"},Fe={class:"mb-4"},Ye=e("label",{for:"start_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("일정시작일 "),e("span",{class:"text-red-500"},"*")],-1),je={class:"mb-4"},Te=e("label",{for:"finish_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("일정종료일 "),e("span",{class:"text-red-500"},"*")],-1),Be={class:"grid grid-cols-2 gap-4"},Ee={class:"mb-4"},qe=e("label",{for:"start_date",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("시작시간 "),e("span",{class:"text-red-500"},"*")],-1),Oe=["value"],He={class:"mb-4"},ze=e("label",{for:"finish_time",class:"block text-sm font-medium text-gray-700 dark:text-gray-300"},[C("종료시간 "),e("span",{class:"text-red-500"},"*")],-1),Ae=["value"],Je=e("label",{class:"block mb-1 text-gray-700"},"메모",-1),Ze=e("div",{class:"text-right text-gray-500 text-sm"},"0 / 100",-1),Le=e("button",{type:"submit",class:"bg-green-600 text-white rounded-md p-2 w-[80px]"}," 확인 ",-1),Pe={__name:"ScheduleFormSliding",props:{isVisible:Boolean,scheduleId:String,scheduleDate:String},emits:["close"],setup(b,{emit:g}){W();const q=G("showModal"),S=g,f=b,k=m(""),F=m([]),I=m([]),h=m({id:"",name:""}),T=async()=>{const a=k.value.toLowerCase();if(!a){I.value=[];return}try{const t=await le(a);F.value=t.data,I.value=F.value}catch(t){console.error("Error fetching clients:",t)}},v=async a=>{h.value=a,k.value=a.client_name,l.client_name=a.client_name,l.phone_number=a.phone_number,I.value=[];try{const t=await ae(a.consultant);h.value.consultant=t.username,h.value.consultant_name=t.full_name}catch(t){console.error("Error fetching clients:",t)}},V=m(null),B=m(null),E=m([]),M=m([]),O=()=>{const a=[];let t=new Date;for(t.setHours(9,0,0,0);t.getHours()<18;)a.push(o(t)),t.setMinutes(t.getMinutes()+10);return a},o=a=>{const t=a.getHours().toString().padStart(2,"0"),s=a.getMinutes().toString().padStart(2,"0");return`${t}:${s}`},d=()=>{if(!V.value)return;const[a,t]=V.value.split(":").map(Number),s=new Date;s.setHours(a,t,0,0);const z=[],J=new Date(s);J.setHours(s.getHours()+1);let Y=new Date(s);for(Y.setMinutes(Y.getMinutes()+10);Y<=J;)z.push(o(Y)),Y.setMinutes(Y.getMinutes()+10);M.value=z,B.value=M.value[0]},i=K({consultant_name:D().required("내담자를 선택해주세요."),client_name:D().required("내담자를 선택해주세요."),phone_number:D().required("휴대전화번호를 입력하세요."),title:D().required("일정제목을 입력해주세요."),start_date:D().required("일정시작일을 선택해주세요."),finish_date:D().required("일정종료일을 선택해주세요."),start_time:D().required("시작시간을 선택해주세요."),finish_time:D().required("종료시간을 선택해주세요.")}),l=L({id:"",teacher_username:"",client_id:"",title:"",start_date:f.scheduleDate,finish_date:f.scheduleDate,start_time:o(new Date),finish_time:o(new Date),memo:""}),p=()=>{S("close")},_=async()=>{if(!f.scheduleId){Object.keys(l).forEach(a=>{l[a]=""}),console.log("scheduleDate:",f.scheduleDate),l.start_date=f.scheduleDate,l.finish_date=f.scheduleDate;return}console.log("scheduleId",f.scheduleId);try{const a=await readSchedule(pros.scheduleId);console.log("scheduleInfo:",a),Object.assign(l,a)}catch(a){console.error("Error fetching user:",a)}},y=async()=>{try{await ie(l),q("상담일정 정보가 등록되었습니다.")}catch(a){q("상담일정 정보 등록 중 오류가 발생했습니다."),console.error("Error registering client data:",a)}};Q(()=>{_()}),P(()=>{E.value=O(),console.log(E.value)});const U=async a=>{console.log("submitting:",a),Object.assign(l,a),await y(),S("close")};return R(()=>f.scheduleDate,(a,t)=>{console.log("newScheduleDate:",a),l.start_date=a,l.finish_date=a}),(a,t)=>(c(),u($,null,[e("div",{onClick:p,class:H(["fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000",{"opacity-100 block":b.isVisible,"opacity-0 hidden":!b.isVisible}])},null,2),e("div",{class:H(["fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out",{"translate-x-full":!b.isVisible,"translate-x-0":b.isVisible}])},[e("div",ue,[e("div",me,[e("div",{class:"flex items-center justify-evenly mb-2"},[he,e("button",{class:"ml-auto",onClick:p},ge)]),r(n(te),{onSubmit:U,"validation-schema":n(i),"initial-values":l,class:"space-y-4 text-sm"},{default:A(()=>[r(n(x),{type:"hidden",name:"teacher_username",modelValue:h.value.consultant,"onUpdate:modelValue":t[0]||(t[0]=s=>h.value.consultant=s)},null,8,["modelValue"]),r(n(x),{type:"hidden",name:"client_id",modelValue:h.value.id,"onUpdate:modelValue":t[1]||(t[1]=s=>h.value.id=s)},null,8,["modelValue"]),e("div",pe,[e("div",fe,[ve,e("div",xe,[X(e("input",{"onUpdate:modelValue":t[2]||(t[2]=s=>k.value=s),onInput:T,type:"text",id:"client-search",placeholder:"내담자 검색...",class:"block w-full py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"},null,544),[[ee,k.value]]),e("div",_e,[r(n(de),{class:"h-5 w-5 text-gray-400","aria-hidden":"true"})]),e("div",null,[I.value.length>0?(c(),u("ul",ye,[(c(!0),u($,null,j(I.value,s=>(c(),u("li",{key:s.id,onClick:z=>v(s),class:"cursor-pointer px-3 py-2 hover:bg-indigo-600 hover:text-white"},N(s.client_name),9,we))),128))])):(c(),u("p",ke,"검색 결과가 없습니다."))])])])]),e("div",Ve,[e("div",Me,[De,r(n(x),{type:"text",name:"consultant_name",readonly:"",modelValue:h.value.consultant_name,"onUpdate:modelValue":t[3]||(t[3]=s=>h.value.consultant_name=s),class:"mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(w),{name:"consultant_name",class:"text-red-500 text-xs italic mt-2"})])]),e("div",$e,[e("div",null,[Ce,r(n(x),{name:"client_name",as:"input",type:"text",modelValue:l.client_name,"onUpdate:modelValue":t[4]||(t[4]=s=>l.client_name=s),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 이름을 입력하세요."},null,8,["modelValue"]),r(n(w),{name:"client_name",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[Se,r(n(x),{name:"phone_number",as:"input",type:"text",modelValue:l.phone_number,"onUpdate:modelValue":t[5]||(t[5]=s=>l.phone_number=s),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 휴대전화번호를 입력하세요."},null,8,["modelValue"]),r(n(w),{name:"phone_number",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[e("div",Ie,[Ue,r(n(x),{type:"text",name:"title",modelValue:l.title,"onUpdate:modelValue":t[6]||(t[6]=s=>l.title=s),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(w),{name:"title",class:"text-red-500 text-xs italic mt-2"})])]),e("div",Ne,[e("div",Fe,[Ye,r(n(x),{type:"date",name:"start_date",modelValue:l.start_date,"onUpdate:modelValue":t[7]||(t[7]=s=>l.start_date=s),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(w),{name:"start_date",class:"text-red-500 text-xs italic mt-2"})]),e("div",je,[Te,r(n(x),{type:"date",name:"finish_date",modelValue:l.finish_date,"onUpdate:modelValue":t[8]||(t[8]=s=>l.finish_date=s),class:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"},null,8,["modelValue"]),r(n(w),{name:"finish_date",class:"text-red-500 text-xs italic mt-2"})])]),e("div",Be,[e("div",Ee,[qe,r(n(x),{name:"start_time",id:"start_time",modelValue:V.value,"onUpdate:modelValue":t[9]||(t[9]=s=>V.value=s),as:"select",onChange:d,class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:A(()=>[(c(!0),u($,null,j(E.value,s=>(c(),u("option",{key:s,value:s},N(s),9,Oe))),128))]),_:1},8,["modelValue"]),r(n(w),{name:"start_time",class:"text-red-500 text-xs italic mt-2"})]),e("div",He,[ze,r(n(x),{name:"finish_time",id:"finish_time",modelValue:B.value,"onUpdate:modelValue":t[10]||(t[10]=s=>B.value=s),as:"select",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:A(()=>[(c(!0),u($,null,j(M.value,s=>(c(),u("option",{key:s,value:s},N(s),9,Ae))),128))]),_:1},8,["modelValue"]),r(n(w),{name:"finish_time",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[Je,r(n(x),{name:"memo",as:"textarea",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",rows:"3",modelValue:l.memo,"onUpdate:modelValue":t[11]||(t[11]=s=>l.memo=s),placeholder:"내담자의 상담정보를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다."},null,8,["modelValue"]),r(n(w),{name:"memo",class:"text-red-500 text-xs italic mt-2"}),Ze]),e("div",{class:"flex justify-between mt-4"},[e("button",{type:"button",onClick:p,class:"bg-gray-400 text-white rounded-md p-2 w-[80px]"}," 취소 "),Le])]),_:1},8,["validation-schema","initial-values"])])])],2)],64))}},We=e("section",null,[e("div",{class:"w-full sm:container"},[e("div",{class:"border-black border-l-[5px] pl-5"},[e("h2",{class:"text-dark mb-2 text-2xl font-semibold dark:text-white"},"Monthly Schedule")])])],-1),Ge={class:"max-w-full mx-auto p-4"},Ke={class:"flex justify-between items-center mb-4"},Qe={class:"flex items-center space-x-2"},Re={class:"text-xl font-semibold"},Xe={class:"flex space-x-2 text-sm font-semibold"},et=e("span",null,"Today",-1),tt=[et],st={class:"grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden text-sm"},at=se('<div class="bg-white py-2 text-center text-sm font-medium">Mon</div><div class="bg-white py-2 text-center text-sm font-medium">Tue</div><div class="bg-white py-2 text-center text-sm font-medium">Wed</div><div class="bg-white py-2 text-center text-sm font-medium">Thu</div><div class="bg-white py-2 text-center text-sm font-medium">Fri</div><div class="bg-white py-2 text-center text-sm font-medium">Sat</div><div class="bg-white py-2 text-center text-sm font-medium">Sun</div>',7),lt=["onClick"],ot=["onClick"],nt={class:"flex justify-between"},rt={class:"inline-block"},dt=e("span",{class:"ml-auto inline-block text-blue-700"},"02:00 PM",-1),it={class:"mt-4 flex items-center justify-center text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-0.5 bg-blue-400/20"},bt={__name:"MonthlyView",setup(b){const g=L({}),q=(o,d,i)=>{i.stopPropagation(),g[o]||(g[o]={}),g[o][d]=!g[o][d]},S=m(!1),f=m(""),k=m(""),F=()=>{S.value=!S.value,S.value||(f.value="",k.value="")};m("");const I=o=>{console.log("clickedDate:",o),k.value=o,F()},h=["January","February","March","April","May","June","July","August","September","October","November","December"],T=m([]),v=m({}),V=m(""),B=o=>{const d=o.getFullYear(),i=String(o.getMonth()+1).padStart(2,"0"),l=String(o.getDate()).padStart(2,"0");return`${d}-${i}-${l}`};V.value=B(new Date),console.log("today:",V.value);const E=(o,d)=>{const i=new Date(o,d,1),l=i.getFullYear(),p=i.getMonth()+1;let _=l,y=p-1;y===0&&(y=12,_-=1);let U=l,a=p+1;return a===13&&(a=1,U+=1),console.log("currentYear:",l,"currentMonth:",p),{currentDate:i,currentYear:l,currentMonth:p,currentMonthName:h[p-1],prevYear:_,prevMonth:y,prevMonthName:h[y-1],nextYear:U,nextMonth:a,nextMonthName:h[a-1]}},M=async(o,d)=>{o||(o=new Date().getFullYear()),d||(d=new Date().getMonth()+1);try{const i=await ce(o,d);T.value=i.data,O(o,d-1),console.log("schedule_data:",T.value)}catch(i){console.error("Error fetching monthly schedule data:",i)}},O=(o,d)=>{v.value=E(o,d)};return P(()=>{const o=new Date().getFullYear(),d=new Date().getMonth();O(o,d),M(v.value.currentYear,v.value.currentMonth)}),(o,d)=>(c(),u($,null,[We,e("div",Ge,[e("div",Ke,[e("div",Qe,[e("button",{class:"p-2 rounded-full font-semibold",onClick:d[0]||(d[0]=i=>M(v.value.prevYear,v.value.prevMonth))},[r(n(oe),{class:"w-6 h-6"})]),e("h2",Re,N(v.value.currentMonthName)+" "+N(v.value.currentYear),1),e("button",{class:"p-2 rounded-full font-semibold",onClick:d[1]||(d[1]=i=>M(v.value.nextYear,v.value.nextMonth))},[r(n(ne),{class:"w-6 h-6"})])]),e("div",Xe,[e("button",{class:"px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center",onClick:d[2]||(d[2]=i=>M())},tt),e("button",{class:"px-4 py-2 bg-blue-500 text-white rounded-md",onClick:F},"상담 등록")])]),e("div",st,[at,(c(!0),u($,null,j(T.value,(i,l)=>(c(),u("div",{class:"bg-white h-32 p-2",key:l,onClick:p=>I(l)},[e("span",{class:H({"block text-sm bg-sky-500 text-white ring rounded-full font-semibold w-5 text-center":l===V.value})},N(l.split("-")[2]),3),(c(),u($,null,j(["홍길동","파이썬"],(p,_)=>{var y,U;return e("p",{class:H(["flex-row text-xs text-blue-600 border border-blue-700/10 rounded-md m-1 p-1 bg-blue-400/20 *:scale-100 [& *]:scale-100",{"transform transition duration-500 ease-in-out overflow-hidden":!0,"scale-100 h-6":!((y=g[l])!=null&&y[_]),"scale-150 h-auto":(U=g[l])==null?void 0:U[_]}]),key:_,onClick:a=>q(l,_,a)},[(c(!0),u($,null,j([...new Array(l+1).keys()],a=>(c(),u("div",nt,[e("span",rt,N(p),1),dt]))),256))],10,ot)}),64)),e("div",it,[r(n(re),{class:"w-4 h-4"})])],8,lt))),128))]),r(Pe,{isVisible:S.value,scheduleId:f.value,scheduleDate:k.value,onClose:F},null,8,["isVisible","scheduleId","scheduleDate"])])],64))}};export{bt as default};