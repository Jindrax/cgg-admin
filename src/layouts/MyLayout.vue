<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-tabs>
        <q-route-tab :icon="usuario? 'lock' : 'lock_open'" to="/" exact slot="title"/>
        <q-route-tab icon="remove_red_eye" to="/monitor" exact slot="title" :disable="loggued"/>
        <q-route-tab icon="person_add" to="/add" exact slot="title" :disable="loggued"/>
        <q-route-tab icon="monetization_on" to="/charge" exact slot="title" :disable="loggued"/>
        <q-route-tab icon="all_inbox" to="/inventario" exact slot="title" :disable="loggued" :hidden="!isAdmin" />
        <q-route-tab icon="shopping_basket" to="/venta" exact slot="title" :disable="loggued"/>
      </q-tabs>
    </q-layout-header>

    <q-page-container>
      <router-view :socket = "getSocket()" :usuario = "usuario" @login="login($event)" @logout="usuario=null"/>
    </q-page-container>
  </q-layout>
</template>

<script>
var socketIOClient = require("socket.io-client");
var sailsIOClient = require("sails.io.js");
var io = sailsIOClient(socketIOClient);
io.sails.reconnection = true;
io.sails.url = "http://lanserver:1337";

export default {
  name: "MyLayout",
  data() {
    return {
      usuario: null
    };
  },
  computed:{
    loggued(){
      if(this.usuario==null){
        return true;
      }else{
        return false;
      }
    },
    isAdmin(){
      if(this.usuario!=null){
        if(this.usuario.admin){
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    getSocket(){
      return io.socket;
    },
    login(data){
      io.socket.post('/loginop', {
        username: data.username,
        password: data.password
      }, (response, jwRes)=>{
        if(jwRes.statusCode == 200){
          this.usuario = response;
          this.$router.replace('/monitor');
        }else{
          this.$q.notify(response);
        }
      });
    }
  }
};
</script>

<style>
</style>
