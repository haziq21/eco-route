import{S as t,i as s,s as e,j as a,k as n,e as o,t as r,m as l,n as c,c as i,a as d,g as m,d as h,b as f,o as u,f as p,E as v,x as g,u as x,v as $,L as E,h as I,Z as k}from"../chunks/vendor-ba6e0429.js";import{B as S}from"../chunks/Box-53f6f880.js";import{s as y}from"../chunks/_stores-027b8861.js";function D(t,s,e){const a=t.slice();return a[1]=s[e],a}function b(t){let s,e,a,n,l,c,u=t[1].modeIdentity+"",g=t[1].intermediateStops+"";return{c(){s=o("span"),e=r(u),n=r("\n\t\t\t\t\t\tfor "),l=r(g),c=r(" stops"),this.h()},l(t){s=i(t,"SPAN",{class:!0});var a=d(s);e=m(a,u),a.forEach(h),n=m(t,"\n\t\t\t\t\t\tfor "),l=m(t,g),c=m(t," stops"),this.h()},h(){f(s,"class",a="mode-label "+t[1].mode+" "+t[1].modeIdentity+" svelte-1d7xm77")},m(t,a){p(t,s,a),v(s,e),p(t,n,a),p(t,l,a),p(t,c,a)},p(t,n){1&n&&u!==(u=t[1].modeIdentity+"")&&I(e,u),1&n&&a!==(a="mode-label "+t[1].mode+" "+t[1].modeIdentity+" svelte-1d7xm77")&&f(s,"class",a),1&n&&g!==(g=t[1].intermediateStops+"")&&I(l,g)},d(t){t&&h(s),t&&h(n),t&&h(l),t&&h(c)}}}function A(t){let s,e,a,n=Math.round(t[1].distance)+"";return{c(){s=r("Walk for "),e=r(n),a=r(" metres")},l(t){s=m(t,"Walk for "),e=m(t,n),a=m(t," metres")},m(t,n){p(t,s,n),p(t,e,n),p(t,a,n)},p(t,s){1&s&&n!==(n=Math.round(t[1].distance)+"")&&I(e,n)},d(t){t&&h(s),t&&h(e),t&&h(a)}}}function N(t){let s,e,a,l,u,g,x,$,E,k,S=t[1].startLocation+"",y=Math.round(t[1].duration/60)+"";function D(t,s){return"walk"===t[1].mode?A:b}let N=D(t),P=N(t);return{c(){s=o("div"),e=o("span"),a=r(S),l=n(),u=o("div"),g=o("span"),P.c(),x=r("\n\t\t\t\t\t("),$=r(y),E=r(" min)"),this.h()},l(t){s=i(t,"DIV",{class:!0});var n=d(s);e=i(n,"SPAN",{class:!0});var o=d(e);a=m(o,S),o.forEach(h),n.forEach(h),l=c(t),u=i(t,"DIV",{class:!0});var r=d(u);g=i(r,"SPAN",{class:!0});var f=d(g);P.l(f),x=m(f,"\n\t\t\t\t\t("),$=m(f,y),E=m(f," min)"),f.forEach(h),r.forEach(h),this.h()},h(){f(e,"class","svelte-1d7xm77"),f(s,"class","place svelte-1d7xm77"),f(g,"class","transport-mode svelte-1d7xm77"),f(u,"class",k="segment "+t[1].mode+" "+t[1].modeIdentity+" svelte-1d7xm77")},m(t,n){p(t,s,n),v(s,e),v(e,a),p(t,l,n),p(t,u,n),v(u,g),P.m(g,null),v(g,x),v(g,$),v(g,E)},p(t,s){1&s&&S!==(S=t[1].startLocation+"")&&I(a,S),N===(N=D(t))&&P?P.p(t,s):(P.d(1),P=N(t),P&&(P.c(),P.m(g,x))),1&s&&y!==(y=Math.round(t[1].duration/60)+"")&&I($,y),1&s&&k!==(k="segment "+t[1].mode+" "+t[1].modeIdentity+" svelte-1d7xm77")&&f(u,"class",k)},d(t){t&&h(s),t&&h(l),t&&h(u),P.d()}}}function P(t){let s,e,a,l,u,g=t[0].segments,x=[];for(let n=0;n<g.length;n+=1)x[n]=N(D(t,g,n));return{c(){s=o("div");for(let t=0;t<x.length;t+=1)x[t].c();e=n(),a=o("div"),l=o("span"),u=r("Destination"),this.h()},l(t){s=i(t,"DIV",{class:!0});var n=d(s);for(let s=0;s<x.length;s+=1)x[s].l(n);e=c(n),a=i(n,"DIV",{class:!0});var o=d(a);l=i(o,"SPAN",{class:!0});var r=d(l);u=m(r,"Destination"),r.forEach(h),o.forEach(h),n.forEach(h),this.h()},h(){f(l,"class","place-name svelte-1d7xm77"),f(a,"class","place svelte-1d7xm77"),f(s,"class","timeline svelte-1d7xm77")},m(t,n){p(t,s,n);for(let e=0;e<x.length;e+=1)x[e].m(s,null);v(s,e),v(s,a),v(a,l),v(l,u)},p(t,a){if(1&a){let n;for(g=t[0].segments,n=0;n<g.length;n+=1){const o=D(t,g,n);x[n]?x[n].p(o,a):(x[n]=N(o),x[n].c(),x[n].m(s,e))}for(;n<x.length;n+=1)x[n].d(1);x.length=g.length}},d(t){t&&h(s),k(x,t)}}}function V(t){let s,e,E,I,k,y,D,b,A,N,V;return s=new S({props:{$$slots:{default:[P]},$$scope:{ctx:t}}}),{c(){a(s.$$.fragment),e=n(),E=o("div"),I=o("span"),k=r("notifications"),y=n(),D=o("span"),b=r("Wake me up "),A=o("br"),N=r(" on interchanges"),this.h()},l(t){l(s.$$.fragment,t),e=c(t),E=i(t,"DIV",{class:!0});var a=d(E);I=i(a,"SPAN",{class:!0});var n=d(I);k=m(n,"notifications"),n.forEach(h),y=c(a),D=i(a,"SPAN",{});var o=d(D);b=m(o,"Wake me up "),A=i(o,"BR",{}),N=m(o," on interchanges"),o.forEach(h),a.forEach(h),this.h()},h(){f(I,"class","material-icons-outlined svelte-1d7xm77"),f(E,"class","alarm-container svelte-1d7xm77")},m(t,a){u(s,t,a),p(t,e,a),p(t,E,a),v(E,I),v(I,k),v(E,y),v(E,D),v(D,b),v(D,A),v(D,N),V=!0},p(t,[e]){const a={};17&e&&(a.$$scope={dirty:e,ctx:t}),s.$set(a)},i(t){V||(g(s.$$.fragment,t),V=!0)},o(t){x(s.$$.fragment,t),V=!1},d(t){$(s,t),t&&h(e),t&&h(E)}}}function j(t,s,e){let a;return E(t,y,(t=>e(0,a=t))),[a]}class M extends t{constructor(t){super(),s(this,t,j,V,e,{})}}export{M as default};
