import{u as O,i as q,q as g,c as T,a as i,M as A,s as z,O as D,o as _,d as h,e,J as B,t as f,n as l,p as U,g as o,A as d,F as M,x as L,E as c,B as K,j as C,f as E,v as Q,P as J,C as P,Q as Z}from"./index-DGgoadmK.js";import{r as G,u as H,a as R,b as N,c as W}from"./client-BADynipv.js";import{_ as X}from"./PaginationView-CqAF-qj3.js";import{b as Y}from"./user-DP4TU0cU.js";import{r as ee}from"./CheckIcon-DNhz0V4T.js";const te={className:"w-full bg-neutral-50 shadow-lg rounded-lg p-6"},se={className:"border-b pb-2 mb-4"},ae={class:"flex items-center justify-evenly mb-2"},le={class:"font-title font-bold"},oe=e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"size-6"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18 18 6M6 6l12 12"})],-1),ne=[oe],re=e("label",{class:"block mb-1 text-gray-700"},[C("상담사 "),e("span",{class:"text-red-500"},"*")],-1),de=e("option",{value:""},"상담사를 선택하세요.",-1),ie=["value"],ce={class:"grid grid-cols-2 gap-4"},ue=e("label",{class:"block mb-1 text-gray-700"},[C("내담자 이름 "),e("span",{class:"text-red-500"},"*")],-1),me=e("label",{class:"block mb-1 text-gray-700"},[C("내담자 휴대전화번호 "),e("span",{class:"text-red-500"},"*")],-1),be=e("label",{class:"block mb-1 text-gray-700"},"관련 태그 입력",-1),pe=e("label",{class:"block mb-1 text-gray-700"},"메모(주소소 문제)",-1),ge=e("div",{class:"text-right text-gray-500 text-sm"},"0 / 100",-1),_e={class:"grid grid-cols-2 gap-4"},he=e("label",{class:"block mb-1 text-gray-700"},"생년월일",-1),xe=e("label",{class:"block mb-1 text-gray-700"},"성별",-1),ve=e("option",{value:""},"성별을 선택하세요.",-1),ye=e("option",{value:"M"},"남성",-1),fe=e("option",{value:"F"},"여성",-1),we=e("label",{class:"block mb-1 text-gray-700"},"이메일 주소",-1),ke=e("label",{class:"block mb-1 text-gray-700"},"주소",-1),Ve={class:"grid grid-cols-2 gap-4"},Ce=e("label",{class:"block mb-1 text-gray-700"},[C("상담 신청 경로 "),e("span",{class:"text-red-500"},"*")],-1),$e=e("option",{value:""},"상담 신청 경로를 선택하세요.",-1),Ie=e("option",{value:"1"},"가족/지인추천",-1),Ue=e("option",{value:"2"},"병원/상담센터를 통해",-1),Me=e("option",{value:"3"},"PC/모바일광고",-1),Se=e("option",{value:"4"},"카페/커뮤니티",-1),je=e("button",{type:"submit",class:"bg-green-600 text-white rounded-md p-2 w-[80px]"}," 확인 ",-1),Fe={__name:"ClientFormSliding",props:{isVisible:Boolean,clientId:String},emits:["close"],setup(x,{emit:$}){const m=O(),b=x,w=q("showModal"),v=$,y=g([]),V=T({consultant:i().required("상담사를 선택하세요."),client_name:i().required("내담자 이름을 입력하세요."),phone_number:i().required("내담자 휴대전화번호를 입력하세요."),tags:i(),memo:i().max(100,"최대 100자까지 입력할 수 있습니다."),birth_date:i(),gendar:i(),email_address:i().email("올바른 이메일 주소를 입력하세요."),address_region:i(),address_city:i(),family_members:i(),consultation_path:i().required("상담 신청 경로를 선택하세요."),center_username:i()}),s=A({id:"",consultant:"",consultant_status:"1",client_name:"",phone_number:"",tags:"",memo:"",birth_date:"",gender:"",email_address:"",address_region:"",address_city:"",family_members:"",consultation_path:"",center_username:m.user.center_username}),p=()=>{v("close")},k=async()=>{if(!b.clientId){Object.keys(s).forEach(n=>{s[n]=""});return}console.log("props.clientId: ",b.clientId);try{const n=await G(b.clientId);console.log("clientInfo:",n),Object.assign(s,n)}catch(n){console.error("Error fetching client:",n)}},S=async()=>{try{const n=await Y();console.log("teacherList:",n),y.value=n.map(a=>({value:a.username,text:a.full_name}))}catch(n){console.error("Error fetching client:",n)}};z(()=>{k(),S(),console.log("userStore.user.center_username: ",m.user.center_username)});const j=async n=>{console.log("submitting:",n),Object.assign(s,n),s.id?(await H(s.id,s),w("내담자 정보가 수정되었습니다.")):(await R(),w("내담자 정보가 등록되었습니다.")),v("close")};return D(()=>b.clientId,(n,a)=>{n!==a&&n&&k()}),(n,a)=>(_(),h(M,null,[e("div",{onClick:p,class:B(["fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000",{"opacity-100 block":x.isVisible,"opacity-0 hidden":!x.isVisible}])},null,2),e("div",{class:B(["fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-auto z-50 transition-transform duration-1000 ease-in-out",{"translate-x-full":!x.isVisible,"translate-x-0":x.isVisible}])},[e("div",te,[e("div",se,[e("div",ae,[e("h2",le,"내담자 등록 "+f(x.clientId),1),e("button",{class:"ml-auto",onClick:p},ne)]),l(o(K),{onSubmit:j,"validation-schema":o(V),"initial-values":s,class:"space-y-4 text-sm"},{default:U(()=>[l(o(d),{name:"id",as:"input",type:"hidden",modelValue:s.id,"onUpdate:modelValue":a[0]||(a[0]=t=>s.id=t)},null,8,["modelValue"]),l(o(d),{name:"family_members",as:"input",type:"hidden"}),l(o(d),{name:"center_username",as:"input",type:"hidden"}),e("div",null,[re,l(o(d),{name:"consultant",modelValue:s.consultant,"onUpdate:modelValue":a[1]||(a[1]=t=>s.consultant=t),as:"select",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:U(()=>[de,(_(!0),h(M,null,L(y.value,t=>(_(),h("option",{key:t.value,value:t.value},f(t.text),9,ie))),128))]),_:1},8,["modelValue"]),l(o(c),{name:"consultant_options",class:"text-red-500 text-xs italic mt-2"})]),e("div",ce,[e("div",null,[ue,l(o(d),{name:"client_name",as:"input",type:"text",modelValue:s.client_name,"onUpdate:modelValue":a[2]||(a[2]=t=>s.client_name=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 이름을 입력하세요."},null,8,["modelValue"]),l(o(c),{name:"client_name",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[me,l(o(d),{name:"phone_number",as:"input",type:"text",modelValue:s.phone_number,"onUpdate:modelValue":a[3]||(a[3]=t=>s.phone_number=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"내담자 휴대전화번호를 입력하세요."},null,8,["modelValue"]),l(o(c),{name:"phone_number",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[be,l(o(d),{name:"tags",as:"input",type:"text",modelValue:s.tags,"onUpdate:modelValue":a[4]||(a[4]=t=>s.tags=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},null,8,["modelValue"]),l(o(c),{name:"tags",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[pe,l(o(d),{name:"memo",as:"textarea",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",rows:"3",modelValue:s.memo,"onUpdate:modelValue":a[5]||(a[5]=t=>s.memo=t),placeholder:"내담자의 주소 문제를 메모해보세요. 최대 100자 까지 입력하실 수 있습니다."},null,8,["modelValue"]),l(o(c),{name:"memo",class:"text-red-500 text-xs italic mt-2"}),ge]),e("div",_e,[e("div",null,[he,l(o(d),{name:"birth_date",as:"input",type:"date",modelValue:s.birth_date,"onUpdate:modelValue":a[6]||(a[6]=t=>s.birth_date=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2",placeholder:"2000.01.01"},null,8,["modelValue"]),l(o(c),{name:"birth_date",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[xe,l(o(d),{modelValue:s.gender,"onUpdate:modelValue":a[7]||(a[7]=t=>s.gender=t),name:"gender",as:"select",class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:U(()=>[ve,ye,fe]),_:1},8,["modelValue"]),l(o(c),{name:"gender",class:"text-red-500 text-xs italic mt-2"})])]),e("div",null,[we,l(o(d),{name:"email_address",as:"input",type:"email",modelValue:s.email_address,"onUpdate:modelValue":a[8]||(a[8]=t=>s.email_address=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},null,8,["modelValue"]),l(o(c),{name:"email_address",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[ke,e("div",Ve,[l(o(d),{name:"address_region",as:"input",modelValue:s.address_region,"onUpdate:modelValue":a[9]||(a[9]=t=>s.address_region=t),class:"bg-neutral-50 border border-gray-300 rounded-md p-2"},null,8,["modelValue"]),l(o(d),{name:"address_city",as:"input",modelValue:s.address_city,"onUpdate:modelValue":a[10]||(a[10]=t=>s.address_city=t),class:"bg-neutral-50 border border-gray-300 rounded-md p-2"},null,8,["modelValue"])]),l(o(c),{name:"address_region",class:"text-red-500 text-xs italic mt-2"}),l(o(c),{name:"address_city",class:"text-red-500 text-xs italic mt-2"})]),e("div",null,[Ce,l(o(d),{name:"consultation_path",as:"select",modelValue:s.consultation_path,"onUpdate:modelValue":a[11]||(a[11]=t=>s.consultation_path=t),class:"w-full bg-neutral-50 border border-gray-300 rounded-md p-2"},{default:U(()=>[$e,Ie,Ue,Me,Se]),_:1},8,["modelValue"]),l(o(c),{name:"consultation_path",class:"text-red-500 text-xs italic mt-2"})]),e("div",{class:"flex justify-between mt-4"},[e("button",{type:"button",onClick:p,class:"bg-gray-400 text-white rounded-md p-2 w-[80px]"}," 취소 "),je])]),_:1},8,["validation-schema","initial-values"])])])],2)],64))}},Be=e("section",null,[e("div",{class:"w-full sm:container"},[e("div",{class:"border-black border-l-[5px] pl-5"},[e("h2",{class:"text-dark mb-2 text-2xl font-semibold dark:text-white"},"내담자 관리")])])],-1),Ee={class:"lg:flex lg:items-center lg:justify-between mb-2"},Pe={class:"min-w-0 flex-1"},Ne={class:"relative"},qe=e("div",{class:"absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"},[e("svg",{class:"w-4 h-4 text-gray-500 dark:text-gray-400","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 20 20"},[e("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"})])],-1),ze={class:"mt-5 flex lg:ml-4 lg:mt-0"},Le={class:"sm:ml-3"},Oe={class:"relative overflow-x-auto shadow-md sm:rounded-lg"},Te={class:"w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"},Ae=e("thead",{class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},[e("tr",null,[e("th",{scope:"col",class:"px-6 py-3"},"내담자명"),e("th",{scope:"col",class:"px-6 py-3"},"내담자 휴대전화"),e("th",{scope:"col",class:"px-6 py-3"},"내담자 이메일"),e("th",{scope:"col",class:"px-6 py-3"},"상담사"),e("th",{scope:"col",class:"px-6 py-3"},"상담상태"),e("th",{scope:"col",class:"px-6 py-3"},"Action")])],-1),De={scope:"row",class:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},Ke={class:"px-6 py-4"},Qe={class:"px-6 py-4"},Je={class:"px-6 py-4"},Ze={key:0,class:"flex items-center"},Ge={key:1,class:"flex items-center"},He=["onClick"],Re={class:"px-6 py-4"},We=["onUpdate:modelValue","onChange"],Xe=e("option",{value:"1"},"상담진행",-1),Ye=e("option",{value:"2"},"상담보류",-1),et=e("option",{value:"3"},"상담종결",-1),tt=[Xe,Ye,et],st={class:"px-6 py-4"},at={class:"flex items-center space-x-2"},lt=["onClick"],ct={__name:"ClientList",setup(x){const $=q("showModal"),m=g(1),b=g(10),w=g(0),v=g(!1),y=g(""),V=g(""),s=g([]),p=()=>{v.value=!v.value,v.value||(y.value="",k(m.value))},k=async t=>{const u=await N(t);s.value=u.items,m.value=u.page,b.value=u.size,w.value=u.total,console.log("clients:",s.value)},S=async()=>{try{const t=await N(1,10,V.value);s.value=t.items,m.value=t.page,b.value=t.size,w.value=t.total}catch(t){console.error("Error fetching clients:",t)}},j=t=>{k(t),m.value=t},n=async t=>{console.log("client:",t);try{await W(t.id,t.consultant_status),$("상담상태 정보가 수정되었습니다.")}catch(u){$("상담상태 정보 등록 중 오류가 발생했습니다."),console.error("Error registering client data:",u)}},a=(t="")=>{t?y.value=String(t):y.value="",p()};return z(k),(t,u)=>(_(),h(M,null,[Be,e("div",Ee,[e("div",Pe,[e("div",Ne,[qe,E(e("input",{type:"text",id:"table-search-users",name:"search-text","onUpdate:modelValue":u[0]||(u[0]=r=>V.value=r),class:"block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",placeholder:"내담자 검색",onKeyup:J(S,["enter"])},null,544),[[Q,V.value]])])]),e("div",ze,[e("span",Le,[e("button",{type:"button",onClick:p,class:"inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"},[l(o(ee),{class:"-ml-0.5 mr-1.5 h-5 w-5","aria-hidden":"true"}),C(" 내담자 등록 ")])])])]),e("div",Oe,[e("table",Te,[Ae,e("tbody",null,[(_(!0),h(M,null,L(s.value,r=>{var F;return _(),h("tr",{key:r.id,class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"},[e("th",De,f(r.client_name),1),e("td",Ke,f(r.phone_number),1),e("td",Qe,f(r.email_address),1),e("td",Je,[r.consultant?(_(),h("div",Ze,f((F=r.consultant_info)==null?void 0:F.full_name)+"("+f(r.consultant)+") ",1)):P("",!0),r.consultant?P("",!0):(_(),h("div",Ge,[e("button",{class:"text-blue-600 dark:text-blue-500 hover:underline font-semibold border py-1 px-3 rounded-lg bg-blue-100 dark:bg-blue-800 dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:hover:border-blue-700",onClick:I=>p(r.id)}," 상담자배정 ",8,He)]))]),e("td",Re,[E(e("select",{class:"w-24 h-9 bg-gray-100 border border-gray-300 rounded-md px-2 text-sm","onUpdate:modelValue":I=>r.consultant_status=I,onChange:I=>n(r)},tt,40,We),[[Z,r.consultant_status]])]),e("td",st,[e("div",at,[e("a",{href:"#",onClick:I=>a(r.id),class:"font-medium text-blue-600 dark:text-blue-500 hover:underline"},"내담자정보",8,lt)])])])}),128))])]),l(X,{"total-items":w.value,"current-page":m.value,"items-per-page":b.value,onPageChanged:j},null,8,["total-items","current-page","items-per-page"]),l(Fe,{isVisible:v.value,clientId:y.value,onClose:p},null,8,["isVisible","clientId"])])],64))}};export{ct as default};