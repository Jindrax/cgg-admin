(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"/60A":function(e,a,t){var o=t("tqkr");"string"===typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);var r=t("SZ7m").default;r("5d732e4c",o,!1,{sourceMap:!1})},BZG2:function(e,a,t){"use strict";var o=t("/60A"),r=t.n(o);r.a},VVgq:function(e,a,t){"use strict";t.r(a);var o=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("q-page",{staticClass:"flex flex-top"},[t("q-card",{staticStyle:{width:"100%"}},[t("q-card-title",[e._v("\n      Crear Cliente\n    ")]),t("q-card-separator"),t("q-card-main",[t("q-field",{attrs:{label:"Nombre de usuario"}},[t("q-input",{model:{value:e.username,callback:function(a){e.username=a},expression:"username"}})],1),t("br"),t("q-field",{attrs:{label:"Contraseña"}},[t("q-input",{attrs:{type:"password"},model:{value:e.password,callback:function(a){e.password=a},expression:"password"}})],1),t("br"),t("q-field",{attrs:{label:"Pionero"}},[t("q-toggle",{model:{value:e.vip,callback:function(a){e.vip=a},expression:"vip"}})],1),t("br"),e.usuario.admin?t("q-field",{attrs:{label:"Operario"}},[t("q-toggle",{model:{value:e.op,callback:function(a){e.op=a},expression:"op"}})],1):e._e(),e.usuario.admin?t("br"):e._e(),e.usuario.admin?t("q-field",{attrs:{label:"Admin"}},[t("q-toggle",{model:{value:e.admin,callback:function(a){e.admin=a},expression:"admin"}})],1):e._e(),e.usuario.admin?t("br"):e._e(),t("q-btn",{staticStyle:{width:"100%"},attrs:{icon:"create",label:"Crear",color:"primary"},on:{click:e.newCliente}})],1)],1),t("q-card",{staticStyle:{width:"100%"}},[t("q-card-title",[e._v("\n      Clientes\n    ")]),t("q-card-separator"),t("q-card-main",[t("q-search",{staticStyle:{width:"100%"},attrs:{"hide-underline":"",color:"secondary"},on:{input:function(a){e.search(e.filter)}},model:{value:e.filter,callback:function(a){e.filter=a},expression:"filter"}}),t("br"),null!=e.tableData?t("q-table",{attrs:{data:e.tableData,columns:e.columns,"row-key":"id"},scopedSlots:e._u([{key:"body",fn:function(a){return t("q-tr",{attrs:{props:a}},[t("q-td",{key:"id",attrs:{props:a}},[e._v("\n            "+e._s(a.row.id)+"\n          ")]),t("q-td",{key:"username",attrs:{props:a}},[e._v("\n            "+e._s(a.row.username)+"\n          ")]),t("q-td",{key:"saldo",attrs:{props:a}},[t("q-chip",{attrs:{small:"",square:"",color:a.row.saldo>0?"green":"red"},on:{click:function(t){e.modal_saldo(a.row.id)}}},[e._v(e._s(a.row.saldo))])],1),e.usuario.admin?t("q-td",{key:"sesion_activa",attrs:{props:a}},[t("q-btn",{staticClass:"q-mr-xs",attrs:{size:"sm",round:"",dense:"",color:"red",icon:"cancel",disable:null==a.row.sesion_activa},on:{click:function(t){e.logoutFromApp(a.row.sesion_activa)}}})],1):e._e(),e.usuario.admin?t("q-td",{key:"restaurar_pass",attrs:{props:a}},[t("q-btn",{staticClass:"q-mr-xs",attrs:{size:"sm",round:"",dense:"",color:"secondary",icon:"edit",disable:a.row.restaurar_pass},on:{click:function(t){e.restore_pass(a.row.id,a.row.username)}}})],1):e._e(),t("q-td",{key:"nombres",attrs:{props:a}},[e._v("\n            "+e._s(a.row.nombres)+"\n          ")]),t("q-td",{key:"apellidos",attrs:{props:a}},[e._v("\n            "+e._s(a.row.apellidos)+"\n          ")]),t("q-td",{key:"email",attrs:{props:a}},[e._v("\n            "+e._s(a.row.email)+"\n          ")]),t("q-td",{key:"telefono",attrs:{props:a}},[e._v("\n            "+e._s(a.row.telefono)+"\n          ")]),t("q-td",{key:"nacimiento",attrs:{props:a}},[e._v("\n            "+e._s(a.row.nacimiento)+"\n          ")])],1)}}])}):e._e(),t("q-btn",{staticStyle:{width:"100%"},attrs:{icon:"update",label:"Actualizar",color:"primary"},on:{click:e.update}})],1)],1)],1)},r=[];o._withStripped=!0;t("OG14");var i=t("lSNA"),s=t.n(i),n=(t("rGqo"),{name:"PageIndex",props:["socket","usuario"],data:function(){return{username:"",password:"",vip:!1,op:!1,admin:!1,filter:"",columns_array:[{prop:"id",label:"ID",admin:!1},{prop:"username",label:"Nombre de usuario",admin:!1},{prop:"saldo",label:"Saldo",admin:!1},{prop:"sesion_activa",label:"Sesion",admin:!0},{prop:"restaurar_pass",label:"RC",admin:!0},{prop:"nombres",label:"Nombres",admin:!1},{prop:"apellidos",label:"Apellidos",admin:!1},{prop:"email",label:"E-mail",admin:!1},{prop:"telefono",label:"Telefono",admin:!1},{prop:"nacimiento",label:"Fecha nacimiento",admin:!1}],tableData:null}},computed:{columns:function(){var e=this,a=[];return this.columns_array.forEach(function(t){t.admin?e.usuario.admin&&a.push({name:t.prop,required:!0,label:t.label,align:"left",field:t.prop,sortable:!0,style:"width: 500px"}):a.push({name:t.prop,required:!0,label:t.label,align:"left",field:t.prop,sortable:!0,style:"width: 500px"})}),a}},mounted:function(){this.update()},methods:{notificar:function(e){this.$q.notify(e)},newCliente:function(){var e=this,a={username:this.username,password:this.password,vip:!!this.vip,meses_constante:this.vip?5:4,operario:this.op,admin:this.admin};this.socket.post("/adminlog",{fecha:Date.now(),anotacion:"".concat(this.usuario.username," creó al usuario ").concat(a.username," con los modificadores: tipo de cliente: ").concat(a.vip?"pionero":"normal").concat(a.operario?", operario":"").concat(a.admin?", admin":"")},function(a,t){200!=t.statusCode&&e.notificar(a)}),this.socket.post("/cliente",a,function(a,t){200==t.statusCode?(e.username="",e.password="",e.vip=!1,e.usuario.admin&&(e.op=!1,e.admin=!1),e.update(),e.notificar("Usuario creado correctamente")):e.notificar(a)})},update:function(){var e=this;this.socket.get("/cliente?sort=createdAt DESC&limit=30",null,function(a,t){200==t.statusCode&&(e.tableData=a)})},search:function(e){var a=this;this.filter=e,this.socket.get('/cliente?where={"username":{"contains":"'.concat(e,'"}}&sort=createdAt DESC&limit=30'),null,function(e,t){200==t.statusCode&&(a.tableData=e)})},restore_pass:function(e,a){var t=this;this.socket.post("/restorepass",{cliente_user:a,cliente:e},function(e,a){200==a.statusCode?t.notificar(e):t.notificar("No se pudo completar la peticion")})},modal_saldo:function(e){var a,t=this;this.usuario.admin&&this.$q.dialog((a={title:"Nuevo Saldo",message:"Ingrese el nuevo saldo",prompt:{model:"",type:"number"},ok:"Confirmar",cancel:"Cancelar"},s()(a,"cancel",!0),s()(a,"color","secondary"),a)).then(function(a){t.socket.post("/replacesaldo",{cliente:e,valor:a},function(e,a){""==t.filter?t.update():t.search(t.filter),t.notificar(e)})}).catch(function(){console.log("Se cancelo el dialogo")})},logoutFromApp:function(e){var a=this;this.socket.post("/logout",{sesion:e.id,fromApp:!0},function(e,t){a.notificar(e),a.search(a.filter)})}}}),l=n,c=(t("BZG2"),t("KHd+")),d=Object(c["a"])(l,o,r,!1,null,null,null);d.options.__file="Add.vue";a["default"]=d.exports},tqkr:function(e,a,t){a=e.exports=t("I1BE")(!1),a.push([e.i,"",""])}}]);