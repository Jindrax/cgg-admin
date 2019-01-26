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
      <div class="row" v-if="total_cobrado > 0 || total_promocional > 0 || total_consumido > 0">
        <q-card class="col-12">
          <q-card-title>
            Totales
          </q-card-title>
          <q-card-separator/>
          <q-card-main>
            <div class="row">
              Total Cobrado: {{formatCurrency(total_cobrado)}}
            </div>
            <br>
            <div class="row">
              Total Promocional: {{formatCurrency(total_promocional)}}
            </div>
            <br>
            <div class="row">
              Total Consumido: {{formatCurrency(total_consumido)}}
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div class="row">
        <q-table v-if="cobrosData != null" title="Cobros" :data="cobrosData" :columns="cobrosColumns" row-key="fecha"
                 :pagination.sync="cobrosPagination"/>
      </div>
      <div class="row">
        <q-table v-if="sesionesData != null" title="Sesiones" :data="sesionesData" :columns="sesionesColumns"
                 row-key="inicio" :pagination.sync="sesionesPagination"/>
      </div>
    </div>
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
        //Fecha en formato unix time stamp que indica desde que momento se desea generar el reporte
        inicio: null,
        //Fecha en formato unix time stamp que indica hasta que momento se desea generar el reporte
        fin: null,
        //Elemento de configuracion para la tabla de cobros, ver documentacion de q-table
        cobrosPagination: {
          sortBy: "fecha",
          rowsPerPage: 0
        },
        //Elemento de configuracion para la tabla de sesiones, ver documentacion de q-table
        sesionesPagination: {
          sortBy: "inicio",
          rowsPerPage: 0
        },
        //Configuracion de columnas para la tabla de cobros
        cobrosColumns: [
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
            name: "operario",
            required: true,
            label: "Operario",
            align: "left",
            field: "operario",
            sortable: false,
            style: "width: 500px"
          },
          {
            name: "cliente",
            required: true,
            label: "Cliente",
            align: "left",
            field: "cliente",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "valor",
            required: true,
            label: "Valor",
            align: "left",
            field: "valor",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "valor_promocional",
            required: true,
            label: "Promocional",
            align: "left",
            field: "valor_promocional",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Configuracion de columnas para la tabla de sesiones
        sesionesColumns: [
          {
            name: "inicio",
            required: true,
            label: "Inicio",
            align: "left",
            field: "inicio",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "fin",
            required: true,
            label: "Fin",
            align: "left",
            field: "fin",
            sortable: false,
            style: "width: 500px"
          },
          {
            name: "equipo",
            required: true,
            label: "Equipo",
            align: "left",
            field: "equipo",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "cliente",
            required: true,
            label: "Cliente",
            align: "left",
            field: "cliente",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "minutos_consumidos",
            required: true,
            label: "Minutos",
            align: "left",
            field: "minutos_consumidos",
            sortable: true,
            style: "width: 500px"
          },
          {
            name: "saldo_consumido",
            required: true,
            label: "Saldo",
            align: "left",
            field: "saldo_consumido",
            sortable: true,
            style: "width: 500px"
          }
        ],
        //Objeto que almacena la informacion de los cobros
        cobrosData: [],
        //Objeto que almacena la informacion de las sesiones
        sesionesData: [],
        //Variables de informacion consolidada
        total_cobrado: 0,
        total_promocional: 0,
        total_consumido: 0
      };
    },
    methods: {
      /**
       * Funcion que actualiza la informacion presentada
       */
      update() {
        this.socket.post(
          "/sesionreport",
          {
            solicitante: this.usuario.id,
            inicio: this.inicio,
            fin: this.fin
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //Cargamos la informacion para mostrarla al usuario
              this.cobrosData = response.cobros;
              this.sesionesData = response.sesiones;
              this.total_cobrado = response.total_cobrado;
              this.total_promocional = response.total_promocional;
              this.total_consumido = response.total_consumido;
            } else {
              //En caso contrario lo registramos
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
      }
    }
  };
</script>
