(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"/T+3":function(t,e,a){"use strict";a.r(e);var l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"flex flex-top"},[a("q-card",{staticStyle:{width:"100%"}},[a("q-card-title",[t._v("\n      Monitoreo de equipos\n    ")]),a("q-card-separator"),a("q-card-main",[null!=t.tableData?a("q-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,columns:t.columns,"row-key":"equipo",pagination:t.pagination},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"body",fn:function(e){return a("q-tr",{attrs:{props:e}},[a("q-td",{key:"equipo",attrs:{props:e}},[t._v("\n            "+t._s(e.row.equipo)+"\n          ")]),a("q-td",{key:"ultima_ip",attrs:{props:e}},[t._v("\n            "+t._s(e.row.ultima_ip)+"\n          ")]),a("q-td",{key:"activo",attrs:{props:e}},[a("q-chip",{attrs:{small:"",square:"",color:e.row.activo?"green":"red"}},[t._v(t._s(e.row.activo?"Activo":"Desconectado"))])],1),a("q-td",{key:"cliente",attrs:{props:e}},[a("q-chip",{attrs:{small:"",square:"",color:null!=e.row.cliente?"green":"red"}},[t._v(t._s(null!=e.row.cliente?e.row.cliente.username:"Null"))])],1),a("q-td",{key:"saldo",attrs:{props:e}},[t._v("\n            "+t._s(null!=e.row.cliente?e.row.cliente.saldo:"Null")+"\n          ")])],1)}}])}):t._e()],1)],1)],1)},o=[];l._withStripped=!0;var i={name:"PageIndex",props:["socket"],data:function(){return{pagination:{sortBy:"equipo",rowsPerPage:0},columns:[{name:"equipo",required:!0,label:"Equipo",align:"left",field:"equipo",sortable:!0,style:"width: 500px"},{name:"ultima_ip",required:!0,label:"Ultima IP",align:"left",field:"ultima_ip",sortable:!1,style:"width: 500px"},{name:"activo",required:!0,label:"Activo",align:"left",field:"activo",sortable:!0,style:"width: 500px"},{name:"cliente",required:!0,label:"Cliente",align:"left",field:"cliente",sortable:!0,style:"width: 500px"},{name:"saldo",required:!0,label:"Saldo",align:"left",field:"saldo",sortable:!0,style:"width: 500px"}],tableData:null}},mounted:function(){var t=this;this.socket.get("/watchmonitor",null,function(e,a){200==a.statusCode&&(t.tableData=e)}),this.socket.on("watchUpdate",function(e){t.tableData=e})},methods:{notificar:function(t){this.$q.notify(t)}}},n=i,r=(a("97RF"),a("KHd+")),s=Object(r["a"])(n,l,o,!1,null,null,null);s.options.__file="Monitor.vue";e["default"]=s.exports},"97RF":function(t,e,a){"use strict";var l=a("Ij2o"),o=a.n(l);o.a},Ij2o:function(t,e,a){var l=a("T5CX");"string"===typeof l&&(l=[[t.i,l,""]]),l.locals&&(t.exports=l.locals);var o=a("SZ7m").default;o("1652dd28",l,!1,{sourceMap:!1})},T5CX:function(t,e,a){e=t.exports=a("I1BE")(!1),e.push([t.i,"",""])}}]);