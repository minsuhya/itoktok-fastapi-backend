import{z as s}from"./index-CE53uhnG.js";function t(r){return s.post("/auth/login",r,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}const c=async r=>{try{return(await s.get(`/signup/check-username?username=${r}`)).data}catch(e){throw console.error("Error reading user:",e),e}},u=async r=>{try{return r.center_username||(r.center_username=r.username),(await s.post("/signup",r)).data}catch(e){throw console.error("Error reading user:",e),e}},p=async()=>{try{return(await s.get("/users/me")).data}catch(r){throw console.error("Error reading user:",r),r}},i=async r=>{try{return(await s.get(`/users/${r}`)).data}catch(e){throw console.error("Error reading user:",e),e}},d=async r=>{try{return(await s.get(`/users/username/${r}`)).data}catch(e){throw console.error("Error reading user:",e),e}},h=async(r=1,e=10,o="")=>{try{return await s.get("/users",{params:{page:r,size:e,search_qry:o}})}catch(n){throw console.error("Error reading users:",n),n}},g=async()=>{try{return(await s.get("/users/teachers")).data}catch(r){throw console.error("Error reading users:",r),r}},w=async(r,e)=>{try{return(await s.put(`/users/${r}`,e)).data}catch(o){throw console.error("Error updating user:",o),o}};export{i as a,g as b,c,h as d,d as e,t as l,p as r,u as s,w as u};