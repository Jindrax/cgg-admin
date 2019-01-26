<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Nuevo Item
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field label="Descripcion">
          <q-input v-model="descripcion"/>
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades"/>
        </q-field>
        <br>
        <q-field label="Precio">
          <q-input v-model="precio_venta"/>
        </q-field>
        <br>
        <q-field label="Costo">
          <q-input v-model="precio_compra"/>
        </q-field>
        <br>
        <q-btn icon="create" label="Crear Item" style="width: 100%" @click="newItem" color="primary"/>
      </q-card-main>
    </q-card>
    <br>
    <q-table v-if="tableData != null" title="Inventario" :data="tableData" :columns="columns" row-key="descripcion"
             style="width: 100%"/>
    <br>
    <q-card style="width: 100%">
      <q-card-title>
        Recargar Inventario
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field label="Descripcion">
          <q-select v-model="item_restock" :options="getOpciones()"/>
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades_restock"/>
        </q-field>
        <br>
        <q-field label="Costo">
          <q-input v-model="precio_compra_restock"/>
        </q-field>
        <br>
        <q-btn icon="update" label="Recargar Item" style="width: 100%" @click="restock" color="primary"/>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
  //Libreria de nodejs para el manejo del tiempo, ver documentacion moment.js
  const moment = require("moment");
  //Configuracion de localizacion
  moment.locale("es");
  export default {
    name: "PageIndex",
    /**
     * Propiedades desde el componente padre
     * - socket, puerto de comunicacion con el servidor
     * - usuario, objeto que contiene la informacion del usuario
     */
    props: ["socket", "usuario"],
    data() {
      return {
        //Descripcion del nuevo producto a inventariar
        descripcion: "",
        //Unidades iniciales en el inventario
        unidades: 0,
        //Precio por el que se compro cada unidad inicial
        precio_compra: 0,
        //Precio por el que se espera vender el producto
        precio_venta: 0,
        //Modelo que contiene el producto que se piensa reestablecer
        item_restock: "",
        //Unidades del producto que se piensa reestablecer
        unidades_restock: 0,
        //Precio unitario por el que se compraron los productos a reestablecer
        precio_compra_restock: 0,
        //Elemento de configuracion de la tabla, ver documentacion de q-table
        columns: [
          {
            name: "descripcion",
            required: true,
            label: "Descripcion",
            align: "left",
            field: "descripcion",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "unidades",
            required: true,
            label: "Unidades",
            align: "left",
            field: "unidades",
            sortable: false,
            style: "width: 500px"
          },
          {
            name: "precio_venta",
            required: true,
            label: "Precio",
            align: "left",
            field: "precio_venta",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "precio_compra",
            required: true,
            label: "Costo",
            align: "left",
            field: "precio_compra",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Objeto que contiene la informacion de la tabla de productos
        tableData: null
      };
    },
    mounted() {
      this.update();
    },
    methods: {
      /**
       * Funcion que intenta crear un nuevo producto a inventariar en el servidor
       */
      newItem() {
        this.socket.post(
          "/db/item/crear",
          {
            item: {
              descripcion: this.descripcion,
              unidades: this.unidades,
              precio_venta: this.precio_venta,
              precio_compra: this.precio_compra,
              creador: this.usuario.id
            }
          },
          (response, jwRes) => {
            if (jwRes.statusCode !== 200) {
              //En caso de que la peticion no sea exitosa, notificamos el error sin limpiar las variables
              this.$q.notify(response);
            } else {
              //En caso de que la peticion sea exitosa, limpiamos las variables y actualizamos la informacion
              this.descripcion = "";
              this.unidades = 0;
              this.precio_venta = 0;
              this.precio_compra = 0;
              this.update();
            }
          }
        );
      },
      /**
       * Funcion que actualiza la informacion de los productos
       */
      update() {
        this.socket.get("/db/item/buscar", {consulta: {}}, (response, jwRes) => {
          if (jwRes.statusCode === 200) {
            //Si la peticion fue exitosa llenamos la tabla
            this.tableData = response;
          } else {
            //Ante cualquier error, lo notificamos al usuario
            this.$q.notify(response);
          }
        });
      },
      /**
       * Funcion que toma todos los productos y genera el elemento de configuracion para mostrarlos como opciones para
       * el reestablecimiento de inventario. Para mayor informacion ver documentacion de q-select
       * @returns {Object} Elemento de configuracion para q-select
       */
      getOpciones() {
        if (this.tableData != null && this.tableData.length > 0) {
          //Si existen productos
          return this.tableData.map((item, index) => {
            //Mapeamos los productos en un elemento de configuracion
            return {
              label: item.descripcion,
              value: index
            };
          });
        } else {
          //Si no existen productos no hay opciones
          return [];
        }
      },
      /**
       * Funcion que intenta reestablecer el inventario de un producto por peticion del usuario
       */
      restock() {
        //Obtenemos la informacion del producto a reestablecer
        let item = this.tableData[this.item_restock];
        //Hacemos una peticion al servidor con la informacion proveida por el usuario
        this.socket.post(
          "/restock",
          {
            itemID: item.id,
            unidades: this.unidades_restock,
            precio_compra: this.precio_compra_restock,
            comprador: this.usuario.id
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //Si la peticion fue exitosa limpiamos las variables, notificamos al usuario y actualizamos la informacion
              this.item_restock = "";
              this.unidades_restock = 0;
              this.precio_compra_restock = 0;
              this.$q.notify(response);
              this.update();
            } else {
              //En caso de error, notificamos al usuario
              this.$q.notify(response);
            }

          }
        );
      }
    }
  };
</script>
