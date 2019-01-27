<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-tabs>
        <!--Cada una de estas rutas enlaza con una pagina en ../pages-->
        <q-route-tab :icon="usuario? 'lock' : 'lock_open'" to="/" exact slot="title"/>
        <q-route-tab icon="remove_red_eye" to="/monitor" exact slot="title" :disable="loggued"/>
        <q-route-tab icon="person_add" to="/add" exact slot="title" :disable="loggued"/>
        <q-route-tab icon="monetization_on" to="/charge" exact slot="title" :disable="loggued"/>
        <!--El control del inventario solo se presenta ante un administrador-->
        <q-route-tab icon="all_inbox" to="/inventario" exact slot="title" :disable="loggued" :hidden="!isAdmin"/>
        <q-route-tab icon="shopping_basket" to="/venta" exact slot="title" :disable="loggued"/>
        <!--Los siguientes reportes solo se presentan ante un administrador-->
        <q-route-tab icon="account_balance_wallet" to="/sesionreport" exact slot="title" :disable="loggued"
                     :hidden="!isAdmin"/>
        <q-route-tab icon="library_books" to="/inventoryreport" exact slot="title" :disable="loggued"
                     :hidden="!isAdmin"/>
        <q-route-tab icon="settings" to="/config" exact slot="title" :disable="loggued"
                     :hidden="!isAdmin"/>
      </q-tabs>
    </q-layout-header>

    <q-page-container>
      <!--Controlador de las paginas enrutadas-->
      <router-view :socket="getSocket()" :usuario="usuario" @login="login($event)" @logout="usuario=null"/>
    </q-page-container>
  </q-layout>
</template>

<script>
  const socketIOClient = require("socket.io-client");
  const sailsIOClient = require("sails.io.js");
  const io = sailsIOClient(socketIOClient);
  io.sails.reconnection = true;
  /**
   * Url de conexion con el servidor
   * @type {string}
   */
  io.sails.url = process.env.API_URL;

  export default {
    name: "MyLayout",
    data() {
      return {
        //Objeto con la informacion del usuario
        usuario: null
      };
    },
    computed: {
      /**
       * Propiedad computada que se encarga de definir si el usuario ha iniciado sesion o no
       * @returns {boolean} Verdadero para un inicio de sesion valido, Falso en otro caso
       */
      loggued() {
        if (this.usuario == null) {
          return true;
        } else {
          return false;
        }
      },
      /**
       * Propiedad computada que se encarga de definir si el usuario es un administrador
       * @returns {boolean} Verdadero si el usuario es un administrador, Falso en otro caso
       */
      isAdmin() {
        if (this.usuario != null) {
          if (this.usuario.admin) {
            return true;
          }
        }
        return false;
      }
    },
    methods: {
      /**
       * Funcion que retorna el socket de socketIO usado para comunicarse con el servidor
       * @returns {Socket} puerto de comunicacion con el servidor
       */
      getSocket() {
        return io.socket;
      },
      /**
       * Funcion que intenta iniciar sesion en el servidor
       * @param {Object} data objeto que contiene la informacion proveida por el usuario para iniciar sesion.
       * ej: {
       *     username: 'nombre_usuario',
       *     password: 'xxxxxxxxxxxxxx'
       * }
       */
      login(data) {
        io.socket.post('/loginop', {
            username: data.username,
            password: data.password
          },
          /**
           * Callback del servidor para la ruta /loginop
           * @param response
           * @param jwRes
           */
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //En caso de que la peticion se haya realizado correctamente asignamos al usuario el objeto enviado por el servidor
              this.usuario = response;
              //Enrutamos el controlador a la pagina monitor
              this.$router.replace('/monitor');
            } else {
              //En caso de que haya un error en la peticion notificamos al usuario
              this.$q.notify(response);
            }
          });
      }
    }
  };
</script>

<style>
</style>
