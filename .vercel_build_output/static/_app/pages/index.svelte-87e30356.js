import{S as r,i as t,s as a,e as s,t as n,k as e,c as o,a as l,g as c,d as i,n as u,b as f,f as h,E as p,h as v,N as m,r as d,u as $,w as g,x as b,Y as k,j as y,l as N,m as S,o as x,v as E,K as j,A,Z as P,P as w,Q as z,O as B,a0 as C,a1 as H}from"../chunks/vendor-d0016f91.js";import{B as W}from"../chunks/Box-c7b3cfc0.js";import{S as _}from"../chunks/Searchbar-328d4ac3.js";import{o as T,d as D,c as I}from"../chunks/_stores-e4befa5b.js";import"../chunks/navigation-51f4a605.js";import"../chunks/singletons-12a22614.js";import"../chunks/stores-e132606c.js";function K(r){let t,a,d,$,g,b,k,y,N,S,x,E,j,A=r[0].minutesToArrival+"",P=r[0].occupancy+"",w=r[0].type+"";return{c(){t=s("span"),a=s("span"),d=n(A),$=e(),g=s("span"),b=n("min"),k=e(),y=s("span"),N=s("span"),S=n(P),x=e(),E=s("span"),j=n(w),this.h()},l(r){t=o(r,"SPAN",{class:!0});var s=l(t);a=o(s,"SPAN",{class:!0});var n=l(a);d=c(n,A),n.forEach(i),$=u(s),g=o(s,"SPAN",{class:!0});var e=l(g);b=c(e,"min"),e.forEach(i),k=u(s),y=o(s,"SPAN",{class:!0});var f=l(y);N=o(f,"SPAN",{});var h=l(N);S=c(h,P),h.forEach(i),x=u(f),E=o(f,"SPAN",{});var p=l(E);j=c(p,w),p.forEach(i),f.forEach(i),s.forEach(i),this.h()},h(){f(a,"class","number svelte-1jgri6a"),f(g,"class","time-unit svelte-1jgri6a"),f(y,"class","icons svelte-1jgri6a"),f(t,"class","info svelte-1jgri6a")},m(r,s){h(r,t,s),p(t,a),p(a,d),p(t,$),p(t,g),p(g,b),p(t,k),p(t,y),p(y,N),p(N,S),p(y,x),p(y,E),p(E,j)},p(r,[t]){1&t&&A!==(A=r[0].minutesToArrival+"")&&v(d,A),1&t&&P!==(P=r[0].occupancy+"")&&v(S,P),1&t&&w!==(w=r[0].type+"")&&v(j,w)},i:m,o:m,d(r){r&&i(t)}}}function O(r,t,a){let{arrival:s}=t;return r.$$set=r=>{"arrival"in r&&a(0,s=r.arrival)},[s]}class Q extends r{constructor(r){super(),t(this,r,O,K,a,{arrival:0})}}function V(r,t,a){const s=r.slice();return s[1]=t[a],s}function Y(r){let t,a;return{c(){t=s("span"),a=n("No arrivals available"),this.h()},l(r){t=o(r,"SPAN",{class:!0});var s=l(t);a=c(s,"No arrivals available"),s.forEach(i),this.h()},h(){f(t,"class","error-message svelte-19zboyn")},m(r,s){h(r,t,s),p(t,a)},p:m,i:m,o:m,d(r){r&&i(t)}}}function Z(r){let t,a,v,m,k,j,A,P,w;t=new Q({props:{arrival:r[1].arrivals[0]}});const z=[F,q],B=[];function C(r,t){return r[1].arrivals[1]?0:1}return j=C(r),A=B[j]=z[j](r),{c(){y(t.$$.fragment),a=e(),v=s("span"),m=n("➤"),k=e(),A.c(),P=N(),this.h()},l(r){S(t.$$.fragment,r),a=u(r),v=o(r,"SPAN",{class:!0});var s=l(v);m=c(s,"➤"),s.forEach(i),k=u(r),A.l(r),P=N(),this.h()},h(){f(v,"class","separator svelte-19zboyn")},m(r,s){x(t,r,s),h(r,a,s),h(r,v,s),p(v,m),h(r,k,s),B[j].m(r,s),h(r,P,s),w=!0},p(r,a){const s={};1&a&&(s.arrival=r[1].arrivals[0]),t.$set(s);let n=j;j=C(r),j===n?B[j].p(r,a):(d(),$(B[n],1,1,(()=>{B[n]=null})),g(),A=B[j],A?A.p(r,a):(A=B[j]=z[j](r),A.c()),b(A,1),A.m(P.parentNode,P))},i(r){w||(b(t.$$.fragment,r),b(A),w=!0)},o(r){$(t.$$.fragment,r),$(A),w=!1},d(r){E(t,r),r&&i(a),r&&i(v),r&&i(k),B[j].d(r),r&&i(P)}}}function q(r){let t;return{c(){t=n("NA")},l(r){t=c(r,"NA")},m(r,a){h(r,t,a)},p:m,i:m,o:m,d(r){r&&i(t)}}}function F(r){let t,a;return t=new Q({props:{arrival:r[1].arrivals[1]}}),{c(){y(t.$$.fragment)},l(r){S(t.$$.fragment,r)},m(r,s){x(t,r,s),a=!0},p(r,a){const s={};1&a&&(s.arrival=r[1].arrivals[1]),t.$set(s)},i(r){a||(b(t.$$.fragment,r),a=!0)},o(r){$(t.$$.fragment,r),a=!1},d(r){E(t,r)}}}function G(r){let t,a,m,k,y,N,S,x,E,j=r[1].number+"";const A=[Z,Y],P=[];function w(r,t){return r[1].arrivals[0]?0:1}return N=w(r),S=P[N]=A[N](r),{c(){t=s("h3"),a=n(j),m=e(),k=s("span"),y=e(),S.c(),x=e(),this.h()},l(r){t=o(r,"H3",{class:!0});var s=l(t);a=c(s,j),s.forEach(i),m=u(r),k=o(r,"SPAN",{class:!0}),l(k).forEach(i),y=u(r),S.l(r),x=u(r),this.h()},h(){f(t,"class","bus-number svelte-19zboyn"),f(k,"class","spacing svelte-19zboyn")},m(r,s){h(r,t,s),p(t,a),h(r,m,s),h(r,k,s),h(r,y,s),P[N].m(r,s),h(r,x,s),E=!0},p(r,t){(!E||1&t)&&j!==(j=r[1].number+"")&&v(a,j);let s=N;N=w(r),N===s?P[N].p(r,t):(d(),$(P[s],1,1,(()=>{P[s]=null})),g(),S=P[N],S?S.p(r,t):(S=P[N]=A[N](r),S.c()),b(S,1),S.m(x.parentNode,x))},i(r){E||(b(S),E=!0)},o(r){$(S),E=!1},d(r){r&&i(t),r&&i(m),r&&i(k),r&&i(y),P[N].d(r),r&&i(x)}}}function J(r){let t,a,m,y,N,S=r[0].busStopCode+"",x=r[0].services,E=[];for(let s=0;s<x.length;s+=1)E[s]=G(V(r,x,s));const j=r=>$(E[r],1,1,(()=>{E[r]=null}));return{c(){t=s("h3"),a=n(S),m=e(),y=s("div");for(let r=0;r<E.length;r+=1)E[r].c();this.h()},l(r){t=o(r,"H3",{});var s=l(t);a=c(s,S),s.forEach(i),m=u(r),y=o(r,"DIV",{class:!0});var n=l(y);for(let t=0;t<E.length;t+=1)E[t].l(n);n.forEach(i),this.h()},h(){f(y,"class","bus-stop svelte-19zboyn")},m(r,s){h(r,t,s),p(t,a),h(r,m,s),h(r,y,s);for(let t=0;t<E.length;t+=1)E[t].m(y,null);N=!0},p(r,[t]){if((!N||1&t)&&S!==(S=r[0].busStopCode+"")&&v(a,S),1&t){let a;for(x=r[0].services,a=0;a<x.length;a+=1){const s=V(r,x,a);E[a]?(E[a].p(s,t),b(E[a],1)):(E[a]=G(s),E[a].c(),b(E[a],1),E[a].m(y,null))}for(d(),a=x.length;a<E.length;a+=1)j(a);g()}},i(r){if(!N){for(let r=0;r<x.length;r+=1)b(E[r]);N=!0}},o(r){E=E.filter(Boolean);for(let t=0;t<E.length;t+=1)$(E[t]);N=!1},d(r){r&&i(t),r&&i(m),r&&i(y),k(E,r)}}}function L(r,t,a){let{arrivals:s}=t;return r.$$set=r=>{"arrivals"in r&&a(0,s=r.arrivals)},[s]}class M extends r{constructor(r){super(),t(this,r,L,J,a,{arrivals:0})}}function R(r){let t;return{c(){t=n("text")},l(r){t=c(r,"text")},m(r,a){h(r,t,a)},p:m,i:m,o:m,d(r){r&&i(t)}}}function U(r){let t,a,s={ctx:r,current:null,token:null,hasCatch:!0,pending:tr,then:rr,catch:X,value:8,error:9,blocks:[,,,]};return C(r[1](),s),{c(){t=N(),s.block.c()},l(r){t=N(),s.block.l(r)},m(r,n){h(r,t,n),s.block.m(r,s.anchor=n),s.mount=()=>t.parentNode,s.anchor=t,a=!0},p(t,a){H(s,r=t,a)},i(r){a||(b(s.block),a=!0)},o(r){for(let t=0;t<3;t+=1){const r=s.blocks[t];$(r)}a=!1},d(r){r&&i(t),s.block.d(r),s.token=null,s=null}}}function X(r){let t,a,e,u=r[9].message+"";return{c(){t=s("p"),a=n("error: "),e=n(u)},l(r){t=o(r,"P",{});var s=l(t);a=c(s,"error: "),e=c(s,u),s.forEach(i)},m(r,s){h(r,t,s),p(t,a),p(t,e)},p:m,i:m,o:m,d(r){r&&i(t)}}}function rr(r){let t,a;return t=new M({props:{arrivals:r[8].data}}),{c(){y(t.$$.fragment)},l(r){S(t.$$.fragment,r)},m(r,s){x(t,r,s),a=!0},p:m,i(r){a||(b(t.$$.fragment,r),a=!0)},o(r){$(t.$$.fragment,r),a=!1},d(r){E(t,r)}}}function tr(r){let t,a;return{c(){t=s("p"),a=n("loading...")},l(r){t=o(r,"P",{});var s=l(t);a=c(s,"loading..."),s.forEach(i)},m(r,s){h(r,t,s),p(t,a)},p:m,i:m,o:m,d(r){r&&i(t)}}}function ar(r){let t,a,f,v,m,k,j,A,P,C;function H(t){r[3](t)}let W={placeholder:"Search for a bus number or stop"};void 0!==r[0]&&(W.text=r[0]),v=new _({props:W}),w.push((()=>z(v,"text",H)));const T=[U,R],D=[];function I(r,t){return r[0]?1:0}return j=I(r),A=D[j]=T[j](r),{c(){t=s("h1"),a=n("Bus arrivals"),f=e(),y(v.$$.fragment),k=e(),A.c(),P=N()},l(r){t=o(r,"H1",{});var s=l(t);a=c(s,"Bus arrivals"),s.forEach(i),f=u(r),S(v.$$.fragment,r),k=u(r),A.l(r),P=N()},m(r,s){h(r,t,s),p(t,a),h(r,f,s),x(v,r,s),h(r,k,s),D[j].m(r,s),h(r,P,s),C=!0},p(r,t){const a={};!m&&1&t&&(m=!0,a.text=r[0],B((()=>m=!1))),v.$set(a);let s=j;j=I(r),j===s?D[j].p(r,t):(d(),$(D[s],1,1,(()=>{D[s]=null})),g(),A=D[j],A?A.p(r,t):(A=D[j]=T[j](r),A.c()),b(A,1),A.m(P.parentNode,P))},i(r){C||(b(v.$$.fragment,r),b(A),C=!0)},o(r){$(v.$$.fragment,r),$(A),C=!1},d(r){r&&i(t),r&&i(f),E(v,r),r&&i(k),D[j].d(r),r&&i(P)}}}function sr(r){let t,a;return t=new W({props:{$$slots:{default:[ar]},$$scope:{ctx:r}}}),{c(){y(t.$$.fragment)},l(r){S(t.$$.fragment,r)},m(r,s){x(t,r,s),a=!0},p(r,[a]){const s={};1025&a&&(s.$$scope={dirty:a,ctx:r}),t.$set(s)},i(r){a||(b(t.$$.fragment,r),a=!0)},o(r){$(t.$$.fragment,r),a=!1},d(r){E(t,r)}}}function nr(r,t,a){let s,n,e;j(r,I,(r=>a(2,s=r))),j(r,T,(r=>a(4,n=r))),j(r,D,(r=>a(5,e=r)));var o=this&&this.__awaiter||function(r,t,a,s){return new(a||(a=Promise))((function(n,e){function o(r){try{c(s.next(r))}catch(t){e(t)}}function l(r){try{c(s.throw(r))}catch(t){e(t)}}function c(r){var t;r.done?n(r.value):(t=r.value,t instanceof a?t:new a((function(r){r(t)}))).then(o,l)}c((s=s.apply(r,t||[])).next())}))};let l;return A((()=>o(void 0,void 0,void 0,(function*(){try{const r=yield navigator.serviceWorker.register("/sw.js");console.log("ServiceWorker registration successful with scope: ",r.scope)}catch(r){console.log("ServiceWorker registration failed: ",r)}})))),P(D,e={name:"",address:"",longitude:null,latitude:null},e),r.$$.update=()=>{4&r.$$.dirty&&P(T,n=s,n)},[l,function(){return o(this,void 0,void 0,(function*(){const r=yield fetch("/api/bus-arrivals");return yield r.json()}))},s,function(r){l=r,a(0,l)}]}class er extends r{constructor(r){super(),t(this,r,nr,sr,a,{})}}export{er as default};
