import{C as n}from"./index-C8JNOHQq.js";const a=async t=>{try{return console.log(t),(await n.post("/client",t)).data}catch(r){throw console.error("Error registering client info:",r),r}},c=async t=>{try{return(await n.get(`/client/${t}`)).data}catch(r){throw console.error("Error reading client info:",r),r}},i=async(t=1,r=10,e="")=>{try{return await n.get("/client",{params:{page:t,size:r,search_qry:e}})}catch(o){throw console.error("Error reading client infos:",o),o}},l=async(t="")=>{try{return await n.get("/client/search/",{params:{search_qry:t}})}catch(r){throw console.error("Error reading client infos:",r),r}},p=async(t,r)=>{try{return(await n.put(`/client/${t}`,r)).data}catch(e){throw console.error("Error updating client info:",e),e}},u=async(t,r)=>{try{return(await n.put(`/client/${t}/consultant_status/${r}`)).data}catch(e){throw console.error("Error updating client info:",e),e}};export{a,i as b,u as c,c as r,l as s,p as u};