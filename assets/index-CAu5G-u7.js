import{bB as j,j as e,bC as p,bD as f,a2 as b,bE as m,bF as o,Z as N,r as g,a0 as v,a1 as t,b as F}from"./index-DNrlKFdy.js";import{C as d}from"./index-CO9qiRjM.js";import"./EllipsisOutlined-pFSNP9Tk.js";const{TextArea:y}=b,w=({name:s,rules:a,label:i,required:x,showNumberOfCharacter:u,...r})=>{const{control:h}=j();return e.jsx(p,{label:i,required:x,renderField:()=>e.jsx(f,{control:h,name:s,rules:a,render:({field:n,fieldState:{error:l}})=>{var c;return e.jsxs("div",{children:[e.jsx(y,{...n,status:l?"error":"",...r}),e.jsxs("div",{className:"mt-0.5 flex items-center justify-between",children:[e.jsx("span",{className:"text-danger text-xs",children:l==null?void 0:l.message}),u&&e.jsxs("span",{className:"text-xs text-zinc-500",children:[((c=n.value)==null?void 0:c.length)||0,"/",r.maxLength??0]})]})]})}})})},C=()=>{const s=m(o),a=N(),{reset:i}=a;return g.useEffect(()=>{i({...s.student})},[s,i]),e.jsx(v,{...a,children:e.jsxs(d,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(t,{label:"Họ và tên",name:"fullName"}),e.jsx(t,{label:"Email",name:"email"}),e.jsx(t,{label:"Số điện thoại",name:"phoneNumber"}),e.jsx(t,{label:"Giới tính",name:"gender"}),e.jsx(t,{label:"Ngày sinh",name:"dateOfBirth"}),e.jsx("div",{className:"col-span-2",children:e.jsx(w,{label:"Ghi chú sinh viên",name:"note",rows:4})})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(F,{size:"middle",className:"mt-4",children:"Lưu thay đổi"})})]})})},L=()=>{var a;const{student:s}=m(o);return e.jsxs("div",{className:"grid grid-cols-[1fr_2fr] gap-4",children:[e.jsx(d,{children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"drop-shadow-primary flex size-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white drop-shadow",children:(a=s==null?void 0:s.fullName)==null?void 0:a.charAt(0)}),e.jsx("p",{className:"mt-4 text-center text-xl font-bold",children:s==null?void 0:s.fullName}),e.jsx("p",{children:s==null?void 0:s.email}),e.jsxs("div",{className:"mt-4 w-full",children:[e.jsx("p",{className:"text-base font-bold",children:"Giới thiệu:"}),e.jsx("p",{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium laborum possimus, ad eius similique exercitationem fugiat nesciunt. Est doloremque labore cumque iste eaque eveniet, repudiandae praesentium eos, ratione voluptates id."})]})]})}),e.jsx(C,{})]})};export{L as default};
