<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-tabs>
        <q-route-tab icon="remove_red_eye" to="/" exact slot="title" />
        <q-route-tab icon="person_add" to="/add" exact slot="title" />
        <q-route-tab icon="monetization_on" to="/charge" exact slot="title" />
        <q-route-tab icon="all_inbox" to="/inventario" exact slot="title" />
        <q-route-tab icon="shopping_basket" to="/venta" exact slot="title" />
      </q-tabs>
    </q-layout-header>

    <q-page-container>
      <router-view :socket = "getSocket()"/>
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
    };
  },
  methods: {
    getSocket(){
      return io.socket;
    }
  }
};
</script>

<style>
</style>
