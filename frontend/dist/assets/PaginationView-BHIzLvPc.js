import{Z as g,o as d,d as l,e as t,j as h,t as i,F as v,A as _,M as P}from"./index-CE9o_E71.js";const p={class:"flex items-center flex-column flex-wrap md:flex-row justify-between p-4","aria-label":"Table navigation"},w={class:"text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"},N={class:"font-semibold text-gray-900 dark:text-white"},j={class:"font-semibold text-gray-900 dark:text-white"},C={class:"inline-flex -space-x-px rtl:space-x-reverse text-sm h-8"},B=["disabled"],I=t("a",{href:"#",class:"flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"},"Previous",-1),M=[I],V=["onClick"],F=["disabled"],S=t("a",{href:"#",class:"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"},"Next",-1),T=[S],D={__name:"PaginationView",props:{totalItems:Number,currentPage:Number,itemsPerPage:Number},emits:["page-changed"],setup(a,{emit:u}){const e=a,c=u,s=g(()=>Math.ceil(e.totalItems/e.itemsPerPage)),b=g(()=>(e.currentPage-1)*e.itemsPerPage+1),m=g(()=>Math.min(e.currentPage*e.itemsPerPage,e.totalItems)),x=g(()=>{const r=[];for(let o=1;o<=s.value;o++)r.push(o);return r}),y=r=>{c("page-changed",r)},k=()=>{e.currentPage<s.value&&c("page-changed",e.currentPage+1)},f=()=>{e.currentPage>1&&c("page-changed",e.currentPage-1)};return(r,o)=>(d(),l("nav",p,[t("span",w,[h("Showing "),t("span",N,i(b.value)+"-"+i(m.value),1),h(" of "),t("span",j,i(s.value),1)]),t("ul",C,[t("li",{onClick:f,disabled:a.currentPage===1},M,8,B),(d(!0),l(v,null,_(x.value,n=>(d(),l("li",{key:n,onClick:z=>y(n)},[t("a",{href:"#",class:P([n===a.currentPage?"bg-blue-700/20":"bg-white","flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"])},i(n),3)],8,V))),128)),t("li",{onClick:k,disabled:a.currentPage===s.value},T,8,F)])]))}};export{D as _};