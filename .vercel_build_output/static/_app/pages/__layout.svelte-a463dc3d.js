import{S as t,i as e,s as n,D as s,e as a,t as r,k as o,c as l,a as c,g as i,d as u,n as h,b as m,f as p,E as f,h as $,F as d,G as g,H as v,x as E,u as x,I as b,J as w,w as S,K as k,r as q,L as y,M as A,j as N,m as P,o as j,v as D,N as _,O as I,P as L,Q as V}from"../chunks/vendor-d0016f91.js";import{S as H}from"../chunks/Searchbar-328d4ac3.js";import{R as G}from"../chunks/RouteTimeline-dd8b7935.js";import{p as M}from"../chunks/stores-e132606c.js";import{o as T,d as R,s as W}from"../chunks/_stores-e4befa5b.js";import"../chunks/navigation-51f4a605.js";import"../chunks/singletons-12a22614.js";function F(t){let e,n,b,w,S,k;const q=t[3].default,y=s(q,t,t[2],null);return{c(){e=a("a"),n=a("span"),b=r(t[0]),w=o(),S=a("span"),y&&y.c(),this.h()},l(s){e=l(s,"A",{class:!0,href:!0});var a=c(e);n=l(a,"SPAN",{class:!0});var r=c(n);b=i(r,t[0]),r.forEach(u),w=h(a),S=l(a,"SPAN",{class:!0});var o=c(S);y&&y.l(o),o.forEach(u),a.forEach(u),this.h()},h(){m(n,"class","material-icons svelte-14co5tg"),m(S,"class","slot"),m(e,"class","chip svelte-14co5tg"),m(e,"href",t[1])},m(t,s){p(t,e,s),f(e,n),f(n,b),f(e,w),f(e,S),y&&y.m(S,null),k=!0},p(t,[n]){(!k||1&n)&&$(b,t[0]),y&&y.p&&(!k||4&n)&&d(y,q,t,t[2],k?v(q,t[2],n,null):g(t[2]),null),(!k||2&n)&&m(e,"href",t[1])},i(t){k||(E(y,t),k=!0)},o(t){x(y,t),k=!1},d(t){t&&u(e),y&&y.d(t)}}}function J(t,e,n){let{$$slots:s={},$$scope:a}=e,{icon:r}=e,{redirect:o}=e;return t.$$set=t=>{"icon"in t&&n(0,r=t.icon),"redirect"in t&&n(1,o=t.redirect),"$$scope"in t&&n(2,a=t.$$scope)},[r,o,a,s]}class K extends t{constructor(t){super(),e(this,t,J,F,n,{icon:0,redirect:1})}}function O(t){let e,n,s,r,i,$,d,g,v,k,A="/"===t[0].path&&Q();const N=[B,z],P=[];function j(t,e){return"/"!==t[0].path?0:1}r=j(t),i=P[r]=N[r](t);const D=[Y,X],_=[];function I(t,e){return"/route-details"!==t[0].path?0:1}return d=I(t),g=_[d]=D[d](t),{c(){e=a("div"),A&&A.c(),n=o(),s=a("div"),i.c(),$=o(),g.c(),this.h()},l(t){e=l(t,"DIV",{class:!0});var a=c(e);A&&A.l(a),n=h(a),s=l(a,"DIV",{class:!0});var r=c(s);i.l(r),$=h(r),g.l(r),r.forEach(u),a.forEach(u),this.h()},h(){m(s,"class","header-layout svelte-1hmhp9q"),m(e,"class","box svelte-1hmhp9q")},m(t,a){p(t,e,a),A&&A.m(e,null),f(e,n),f(e,s),P[r].m(s,null),f(s,$),_[d].m(s,null),k=!0},p(t,a){"/"===t[0].path?A?1&a&&E(A,1):(A=Q(),A.c(),E(A,1),A.m(e,n)):A&&(q(),x(A,1,1,(()=>{A=null})),S());let o=r;r=j(t),r===o?P[r].p(t,a):(q(),x(P[o],1,1,(()=>{P[o]=null})),S(),i=P[r],i?i.p(t,a):(i=P[r]=N[r](t),i.c()),E(i,1),i.m(s,$));let l=d;d=I(t),d===l?_[d].p(t,a):(q(),x(_[l],1,1,(()=>{_[l]=null})),S(),g=_[d],g?g.p(t,a):(g=_[d]=D[d](t),g.c()),E(g,1),g.m(s,null))},i(t){k||(E(A),E(i),E(g),b((()=>{v||(v=w(s,y,{},!0)),v.run(1)})),k=!0)},o(t){x(A),x(i),x(g),v||(v=w(s,y,{},!1)),v.run(0),k=!1},d(t){t&&u(e),A&&A.d(),P[r].d(),_[d].d(),t&&v&&v.end()}}}function Q(t){let e,n,s,o,h,$;return{c(){e=a("span"),n=a("h1"),s=r("Go somewhere"),this.h()},l(t){e=l(t,"SPAN",{class:!0});var a=c(e);n=l(a,"H1",{});var r=c(n);s=i(r,"Go somewhere"),r.forEach(u),a.forEach(u),this.h()},h(){m(e,"class","header-layout svelte-1hmhp9q")},m(t,a){p(t,e,a),f(e,n),f(n,s),$=!0},i(t){$||(b((()=>{o||(o=w(n,A,{},!0)),o.run(1)})),b((()=>{h||(h=w(e,y,{},!0)),h.run(1)})),$=!0)},o(t){o||(o=w(n,A,{},!1)),o.run(0),h||(h=w(e,y,{},!1)),h.run(0),$=!1},d(t){t&&u(e),t&&o&&o.end(),t&&h&&h.end()}}}function z(t){let e,n,s,a;return e=new K({props:{icon:"home",redirect:"/ringing-alarm",$$slots:{default:[C]},$$scope:{ctx:t}}}),s=new K({props:{icon:"work",$$slots:{default:[U]},$$scope:{ctx:t}}}),{c(){N(e.$$.fragment),n=o(),N(s.$$.fragment)},l(t){P(e.$$.fragment,t),n=h(t),P(s.$$.fragment,t)},m(t,r){j(e,t,r),p(t,n,r),j(s,t,r),a=!0},p(t,n){const a={};128&n&&(a.$$scope={dirty:n,ctx:t}),e.$set(a);const r={};128&n&&(r.$$scope={dirty:n,ctx:t}),s.$set(r)},i(t){a||(E(e.$$.fragment,t),E(s.$$.fragment,t),a=!0)},o(t){x(e.$$.fragment,t),x(s.$$.fragment,t),a=!1},d(t){D(e,t),t&&u(n),D(s,t)}}}function B(t){let e,n,s;return{c(){e=a("a"),n=r("arrow_back_ios"),this.h()},l(t){e=l(t,"A",{href:!0,class:!0});var s=c(e);n=i(s,"arrow_back_ios"),s.forEach(u),this.h()},h(){m(e,"href",s="/route-details"!==t[0].path?"/":"/suggested-routes"),m(e,"class","material-icons back-button svelte-1hmhp9q")},m(t,s){p(t,e,s),f(e,n)},p(t,n){1&n&&s!==(s="/route-details"!==t[0].path?"/":"/suggested-routes")&&m(e,"href",s)},i:_,o:_,d(t){t&&u(e)}}}function C(t){let e;return{c(){e=r("Home")},l(t){e=i(t,"Home")},m(t,n){p(t,e,n)},d(t){t&&u(e)}}}function U(t){let e;return{c(){e=r("Work")},l(t){e=i(t,"Work")},m(t,n){p(t,e,n)},d(t){t&&u(e)}}}function X(t){let e,n,s,d,g,v,b,w,S,k,q,y,A,_,I,L,V=new Date(t[3].arriveTime).toLocaleString("en",{hour:"numeric",minute:"numeric"})+"",H=st(t[3].duration),M=at(t[3].duration)+"";n=new G({props:{route:t[3]}});let T=H&&Z(t);return{c(){e=a("div"),N(n.$$.fragment),s=o(),d=a("div"),g=a("span"),v=r("Leave now, arrive at\n\t\t\t\t\t\t\t"),b=a("span"),w=r(V),S=r("."),k=o(),q=a("span"),T&&T.c(),y=o(),A=a("span"),_=r(M),I=r("\n\t\t\t\t\t\t\tmin"),this.h()},l(t){e=l(t,"DIV",{class:!0});var a=c(e);P(n.$$.fragment,a),s=h(a),d=l(a,"DIV",{class:!0});var r=c(d);g=l(r,"SPAN",{class:!0});var o=c(g);v=i(o,"Leave now, arrive at\n\t\t\t\t\t\t\t"),b=l(o,"SPAN",{class:!0});var m=c(b);w=i(m,V),S=i(m,"."),m.forEach(u),o.forEach(u),k=h(r),q=l(r,"SPAN",{class:!0});var p=c(q);T&&T.l(p),y=h(p),A=l(p,"SPAN",{class:!0});var f=c(A);_=i(f,M),f.forEach(u),I=i(p,"\n\t\t\t\t\t\t\tmin"),p.forEach(u),r.forEach(u),a.forEach(u),this.h()},h(){m(b,"class","number svelte-1hmhp9q"),m(g,"class","extra svelte-1hmhp9q"),m(A,"class","number svelte-1hmhp9q"),m(q,"class","time svelte-1hmhp9q"),m(d,"class","route-layout svelte-1hmhp9q"),m(e,"class","searchbar-layout svelte-1hmhp9q")},m(t,a){p(t,e,a),j(n,e,null),f(e,s),f(e,d),f(d,g),f(g,v),f(g,b),f(b,w),f(b,S),f(d,k),f(d,q),T&&T.m(q,null),f(q,y),f(q,A),f(A,_),f(q,I),L=!0},p(t,e){const s={};8&e&&(s.route=t[3]),n.$set(s),(!L||8&e)&&V!==(V=new Date(t[3].arriveTime).toLocaleString("en",{hour:"numeric",minute:"numeric"})+"")&&$(w,V),8&e&&(H=st(t[3].duration)),H?T?T.p(t,e):(T=Z(t),T.c(),T.m(q,y)):T&&(T.d(1),T=null),(!L||8&e)&&M!==(M=at(t[3].duration)+"")&&$(_,M)},i(t){L||(E(n.$$.fragment,t),L=!0)},o(t){x(n.$$.fragment,t),L=!1},d(t){t&&u(e),D(n),T&&T.d()}}}function Y(t){let e,n,s,r=("/suggested-routes"===t[0].path||"origin"==t[0].params.endpoint)&&tt(t),i="origin"!==t[0].params.endpoint&&et(t);return{c(){e=a("div"),r&&r.c(),n=o(),i&&i.c(),this.h()},l(t){e=l(t,"DIV",{class:!0});var s=c(e);r&&r.l(s),n=h(s),i&&i.l(s),s.forEach(u),this.h()},h(){m(e,"class","searchbar-layout svelte-1hmhp9q")},m(t,a){p(t,e,a),r&&r.m(e,null),f(e,n),i&&i.m(e,null),s=!0},p(t,s){"/suggested-routes"===t[0].path||"origin"==t[0].params.endpoint?r?(r.p(t,s),1&s&&E(r,1)):(r=tt(t),r.c(),E(r,1),r.m(e,n)):r&&(q(),x(r,1,1,(()=>{r=null})),S()),"origin"!==t[0].params.endpoint?i?(i.p(t,s),1&s&&E(i,1)):(i=et(t),i.c(),E(i,1),i.m(e,null)):i&&(q(),x(i,1,1,(()=>{i=null})),S())},i(t){s||(E(r),E(i),s=!0)},o(t){x(r),x(i),s=!1},d(t){t&&u(e),r&&r.d(),i&&i.d()}}}function Z(t){let e,n,s,o=st(t[3].duration)+"";return{c(){e=a("span"),n=r(o),s=r("\n\t\t\t\t\t\t\t\thr"),this.h()},l(t){e=l(t,"SPAN",{class:!0});var a=c(e);n=i(a,o),a.forEach(u),s=i(t,"\n\t\t\t\t\t\t\t\thr"),this.h()},h(){m(e,"class","number svelte-1hmhp9q")},m(t,a){p(t,e,a),f(e,n),p(t,s,a)},p(t,e){8&e&&o!==(o=st(t[3].duration)+"")&&$(n,o)},d(t){t&&u(e),t&&u(s)}}}function tt(t){let e,n,s;function a(e){t[5](e)}let r={placeholder:"Enter your origin",name:"origin"};return void 0!==t[1].name&&(r.text=t[1].name),e=new H({props:r}),L.push((()=>V(e,"text",a))),{c(){N(e.$$.fragment)},l(t){P(e.$$.fragment,t)},m(t,n){j(e,t,n),s=!0},p(t,s){const a={};!n&&2&s&&(n=!0,a.text=t[1].name,I((()=>n=!1))),e.$set(a)},i(t){s||(E(e.$$.fragment,t),s=!0)},o(t){x(e.$$.fragment,t),s=!1},d(t){D(e,t)}}}function et(t){let e,n,s;function a(e){t[6](e)}let r={placeholder:"/"===t[0].path?"Search location":"Enter your destination",name:"destination"};return void 0!==t[2].name&&(r.text=t[2].name),e=new H({props:r}),L.push((()=>V(e,"text",a))),{c(){N(e.$$.fragment)},l(t){P(e.$$.fragment,t)},m(t,n){j(e,t,n),s=!0},p(t,s){const a={};1&s&&(a.placeholder="/"===t[0].path?"Search location":"Enter your destination"),!n&&4&s&&(n=!0,a.text=t[2].name,I((()=>n=!1))),e.$set(a)},i(t){s||(E(e.$$.fragment,t),s=!0)},o(t){x(e.$$.fragment,t),s=!1},d(t){D(e,t)}}}function nt(t){let e,n,a="/ringing-alarm"!==t[0].path&&O(t);const r=t[4].default,l=s(r,t,t[7],null);return{c(){a&&a.c(),e=o(),l&&l.c()},l(t){a&&a.l(t),e=h(t),l&&l.l(t)},m(t,s){a&&a.m(t,s),p(t,e,s),l&&l.m(t,s),n=!0},p(t,[s]){"/ringing-alarm"!==t[0].path?a?(a.p(t,s),1&s&&E(a,1)):(a=O(t),a.c(),E(a,1),a.m(e.parentNode,e)):a&&(q(),x(a,1,1,(()=>{a=null})),S()),l&&l.p&&(!n||128&s)&&d(l,r,t,t[7],n?v(r,t[7],s,null):g(t[7]),null)},i(t){n||(E(a),E(l,t),n=!0)},o(t){x(a),x(l,t),n=!1},d(t){a&&a.d(t),t&&u(e),l&&l.d(t)}}}function st(t){return Math.floor(t/3600)}function at(t){return Math.floor((t-3600*st(t))/60)}function rt(t,e,n){let s,a,r,o;k(t,M,(t=>n(0,s=t))),k(t,T,(t=>n(1,a=t))),k(t,R,(t=>n(2,r=t))),k(t,W,(t=>n(3,o=t)));let{$$slots:l={},$$scope:c}=e;return t.$$set=t=>{"$$scope"in t&&n(7,c=t.$$scope)},[s,a,r,o,l,function(e){t.$$.not_equal(a.name,e)&&(a.name=e,T.set(a))},function(e){t.$$.not_equal(r.name,e)&&(r.name=e,R.set(r))},c]}class ot extends t{constructor(t){super(),e(this,t,rt,nt,n,{})}}export{ot as default};
