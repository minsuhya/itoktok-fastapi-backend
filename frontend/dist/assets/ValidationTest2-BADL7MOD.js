import{_ as t}from"./DynamicForm-5gI6MiON.js";import{a as e,o,d as r,e as s,q as l}from"./index-C8JNOHQq.js";const n={class:"w-1/2 mx-auto rounded-lg border p-6 my-3 bg-white"},p={__name:"ValidationTest2",setup(i){const a={fields:[{label:"Your Name",name:"name",as:"input",rules:e().required()},{label:"Your Email",name:"email",as:"input",rules:e().email().required()},{label:"Your Password",name:"password",as:"input",type:"password",rules:e().min(8).required()},{label:"Favorite Drink",name:"drink",as:"select",children:[{tag:"option",value:"",text:"Select a drink"},{tag:"option",value:"coffee",text:"Coffeee"},{tag:"option",value:"tea",text:"Tea"},{tag:"option",value:"coke",text:"Coke"}]}]};return(m,u)=>(o(),r("main",null,[s("div",n,[l(t,{schema:a})])]))}};export{p as default};