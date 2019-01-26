<template>
  <q-page class="flex flex-top">
    <q-card style="width: 30%">
      <q-card-title>
        Nueva Venta
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field label="Descripcion">
          <q-select v-model="seleccionado" :options="getOpciones()"/>
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades"/>
        </q-field>
        <br>
        <q-btn icon="create" label="Añadir" style="width: 100%" @click="addItem" color="primary"/>
      </q-card-main>
    </q-card>
    <div style="width: 70%">
      <q-table v-if="tableData != null" title="Inventario" :data="tableData" :columns="columns" row-key="descripcion"
               :pagination.sync="pagination"/>
      <q-btn icon="monetization_on" :label="`Pagar ${total} pesos`" style="width: 100%" @click="newSale"
             color="primary"/>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
  //Libreria de nodejs para le manejo del tiempo, ver documentacion moment.js
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
        //Elemento de configuracion para la tabla, ver documentacion q-table
        pagination: {
          sortBy: "equipo",
          rowsPerPage: 0
        },
        //Pendiente de documentacion
        descripcion: "",
        //Unidades del producto que se quieren añadir a la venta
        unidades: 0,
        //Producto seleccionado para la venta
        seleccionado: null,
        //Productos disponibles para la venta
        inventario: [],
        //Elemento de configuracion para la tabla, ver documentacion de q-table
        columns: [
          {
            name: "item",
            required: true,
            label: "Item",
            align: "left",
            field: "item",
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
            name: "valor_total",
            required: true,
            label: "Precio",
            align: "left",
            field: "valor_total",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Informacion presentada en la tabla
        tableData: []
      };
    },
    mounted() {
      this.update();
    },
    computed: {
      /**
       * Valor computado que suma el precio de los productos por unidades actualmente en la venta
       * @returns {Number} Total de la venta en tiempo real
       */
      total() {
        return this.tableData.reduce((valorAnterior, valorActual) => {
          return valorAnterior + valorActual.valor_total;
        }, 0);
      },
      /**
       * Valor computado que calcula la utilidad de la venta
       * @returns {Number} Utilidad de la venta en tiempo real
       */
      utilidad() {
        return this.tableData.reduce((valorAnterior, valorActual) => {
          return valorAnterior + valorActual.utilidad_total;
        }, 0);
      }
    },
    methods: {
      /**
       * Funcion que intenta registrar una nueva venta en el servidor
       */
      newSale() {
        let fecha = Date.now();
        let items = this.tableData;
        this.socket.post(
          "/newsale",
          {
            fecha: fecha,
            items: items,
            total: this.total,
            utilidad: this.utilidad,
            vendedor: this.usuario.id
          },
          (response, jwRes) => {
            if (jwRes.statusCode !== 200) {
              //Si la peticion no ha sido exitosa notificamos al usuario
              this.$q.notify(response);
            } else {
              //En caso de que la peticion haya sido exitosa limpiamos las variables, notificamos al usuario y actualizamos la informacion
              this.tableData = [];
              this.$q.notify(response);
              this.update();
            }
          }
        );
      },
      /**
       * Funcion que solicita la actualizacion del inventario
       */
      update() {
        this.socket.get("/db/item/buscar", {consulta: {}}, (response, jwRes) => {
          if (jwRes.statusCode === 200) {
            //En caso de que la solicitud sea exitosa actualizamos el inventario
            this.inventario = response;
          }
        });
      },
      /**
       * Funcion que mapea el inventario y crea un elemento de configuracion para alimentar la seleccion de productos para la venta
       * @returns {Object} Configuracion para el q-select
       */
      getOpciones() {
        if (this.inventario.length > 0) {
          //Si hay productos en el inventario los mapeamos y devolvemos la configuracion
          return this.inventario.map((item, index) => {
            return {
              label: item.descripcion,
              value: index
            };
          });
        } else {
          //Si no hay productos en el inventario no podemos dar opciones
          return [];
        }
      },
      /**
       * Funcion que añade a la venta el producto seleccionado por la cantidad solicitada por el cliente
       */
      addItem() {
        let item = this.inventario[this.seleccionado];
        //Solicitamos la comprobacion de inventario para el producto que deseaños añadir a la venta
        this.socket.post(
          "/checkstock",
          {
            itemID: item.id,
            unidades: this.unidades
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              /* En caso de que la peticion sea exitosa, significa que la cantidad de productos se encuentran disponibles
                 por lo que añadimos los productos a la venta*/
              this.tableData.push({
                id: item.id,
                item: item.descripcion,
                unidades: this.unidades,
                precio: item.precio_venta,
                valor_total: item.precio_venta * this.unidades,
                utilidad_total: (item.precio_venta - item.precio_compra) * this.unidades
              });
              //Limpiamos las variables
              this.seleccionado = null;
              this.unidades = 0;
            } else {
              //En caso de que la peticion falle notificamos al usuario
              this.$q.notify(response);
            }
          }
        );
      }
    }
  };
</script>
