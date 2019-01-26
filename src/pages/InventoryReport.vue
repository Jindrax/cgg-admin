<template>
  <q-page class="flex flex-top">
    <div>
      <div class="row">
        <q-card class="col-12">
          <q-card-title>
            Reporte
          </q-card-title>
          <q-card-separator/>
          <q-card-main>
            <div class="row">
              <div class="col-6">
                <q-datetime v-model="inicio" float-label="Inicio" format-model="number"/>
              </div>
              <div class="col-6">
                <q-datetime v-model="fin" float-label="Fin" format-model="number"/>
              </div>
            </div>
            <br>
            <div class="row">
              <q-btn label="Generar Reporte" @click="update" color="primary" class="col-12"/>
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div class="row" v-if="total_vendido > 0 || total_comprado > 0 || total_utilidad > 0">
        <q-card class="col-12">
          <q-card-title>
            Totales
          </q-card-title>
          <q-card-separator/>
          <q-card-main>
            <div class="row">
              Total Vendido: {{formatCurrency(total_vendido)}}
            </div>
            <br>
            <div class="row">
              Total Comprado: {{formatCurrency(total_comprado)}}
            </div>
            <br>
            <div class="row">
              Utilidad Total: {{formatCurrency(total_utilidad)}}
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div class="row">
        <q-table v-if="ventasData != null" title="Ventas" :data="ventasData" :columns="ventasColumns" row-key="fecha"
                 :pagination.sync="ventasPagination">
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="fecha" :props="props">
              {{ props.row.fecha }}
            </q-td>
            <q-td key="vendedor" :props="props">
              {{ props.row.vendedor }}
            </q-td>
            <q-td key="venta" :props="props">
              <q-chip small square @click="modal_saldo(props.row.venta)">
                Detalles
              </q-chip>
            </q-td>
            <q-td key="total" :props="props">
              {{props.row.total}}
            </q-td>
            <q-td key="utilidad" :props="props">
              {{props.row.utilidad}}
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <div class="row">
        <q-table v-if="comprasData != null" title="Compras" :data="comprasData" :columns="comprasColumns"
                 row-key="fecha" :pagination.sync="comprasPagination"/>
      </div>
    </div>
    <q-dialog v-model="detallesDialog">
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title">Resumen</span>
      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message" v-for="venta in detalles">{{`${venta.item} x ${venta.unidades}, precio: ${venta.precio}, total: ${venta.valor_total}`}}<br></span>
    </q-dialog>
  </q-page>
</template>

<style>
</style>

<script>
  /*Objeto para formatear numeros con localizacion y formatos especiales
  Documentacion: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/NumberFormat*/
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  });
  //Libreria en nodejs para el manejo del tiempo, ver documentacion moment.js
  const moment = require("moment");
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
        //Fecha en formato unix time stamp que indica desde que momento se desea generar el reporte
        inicio: null,
        //Fecha en formato unix time stamp que indica hasta que momento se desea generar el reporte
        fin: null,
        //Elemento de configuracion para la tabla de ventas, ver documentacion de q-table
        ventasPagination: {
          sortBy: "fecha",
          rowsPerPage: 0
        },
        //Elemento de configuracion para la tabla de compras, ver documentacion de q-table
        comprasPagination: {
          sortBy: "fecha",
          rowsPerPage: 0
        },
        //Configuracion de columnas para la tabla de ventas
        ventasColumns: [
          {
            name: "fecha",
            required: true,
            label: "Fecha",
            align: "left",
            field: "fecha",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "vendedor",
            required: true,
            label: "Vendedor",
            align: "left",
            field: "vendedor",
            sortable: false,
            style: "width: 500px"
          },
          {
            name: "venta",
            required: true,
            label: "Venta",
            align: "left",
            field: "venta",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "total",
            required: true,
            label: "Total",
            align: "left",
            field: "total",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "utilidad",
            required: true,
            label: "Utilidad",
            align: "left",
            field: "utilidad",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Configuracion de columnas para la tabla de compras
        comprasColumns: [
          {
            name: "fecha",
            required: true,
            label: "Fecha",
            align: "left",
            field: "fecha",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "comprador",
            required: true,
            label: "Comprador",
            align: "left",
            field: "comprador",
            sortable: false,
            style: "width: 500px"
          },
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
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "precio",
            required: true,
            label: "Precio",
            align: "left",
            field: "precio",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "total",
            required: true,
            label: "Total",
            align: "left",
            field: "total",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Objeto que almacena la informacion de las ventas
        ventasData: [],
        //Objeto que almacena la informacion de las compras
        comprasData: [],
        //Variables de informacion consolidada
        total_vendido: 0,
        total_comprado: 0,
        total_utilidad: 0,
        //Modelo que controla la visibilidad del dialogo de detalles de la venta
        detallesDialog: false,
        //Objeto que contiene la informacion de los detalles de la venta
        detalles: []
      };
    },
    methods: {
      /**
       * Funcion que actualiza la informacion presentada
       */
      update() {
        this.socket.post(
          "/inventoryreport",
          {
            solicitante: this.usuario.id,
            inicio: this.inicio,
            fin: this.fin
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              console.log('Resporte recibido');
              console.log(response);
              //Cargamos la informacion para mostrarla al usuario
              this.ventasData = response.ventas;
              this.comprasData = response.compras;
              this.total_vendido = response.total_vendido;
              this.total_comprado = response.total_comprado;
              this.total_utilidad = response.total_utilidad;
            } else {
              //En caso contrario la registramos
              console.log(response);
            }
          }
        );
        //Registramos la solicitud
        console.log('Se solicito el reporte');
      },
      /**
       * Funcion que formatea un valor numerico para presentarlo de forma contable
       * @param {Number} value Valor a formatear
       * @returns {string} Cadena de caracteres formateada devuelta
       */
      formatCurrency(value) {
        return formatter.format(value);
      },
      modal_saldo(msg){
        this.detalles = msg;
        this.detallesDialog = true;
      }
    }
  };
</script>
