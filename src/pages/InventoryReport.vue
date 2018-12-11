<template>
  <q-page class="flex flex-top">
    <div>
      <div class="row">
        <q-card class="col-12">
          <q-card-title>
            Reporte
          </q-card-title>
          <q-card-separator />
          <q-card-main>
            <div class="row">
              <div class="col-6">
                <q-datetime v-model="inicio" float-label="Inicio" format-model="number" />
              </div>
              <div class="col-6">
                <q-datetime v-model="fin" float-label="Fin" format-model="number" />
              </div>
            </div>
            <br>
            <div class="row">
              <q-btn label="Generar Reporte" @click="update" color="primary" class="col-12" />
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div class="row" v-if="total_vendido > 0 || total_comprado > 0 || total_utilidad > 0">
        <q-card class="col-12">
          <q-card-title>
            Totales
          </q-card-title>
          <q-card-separator />
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
        <q-table v-if="ventasData != null" title="Ventas" :data="ventasData" :columns="ventasColumns" row-key="fecha" :pagination.sync="ventasPagination" />
      </div>
      <div class="row">
        <q-table v-if="comprasData != null" title="Compras" :data="comprasData" :columns="comprasColumns" row-key="fecha" :pagination.sync="comprasPagination" />
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
var formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
      });
var moment = require("moment");
moment.locale("es");
export default {
  name: "PageIndex",
  props: ["socket", "usuario"],
  data() {
    return {
      inicio: null,
      fin: null,
      ventasPagination: {
        sortBy: "fecha",
        rowsPerPage: 0
      },
      comprasPagination: {
        sortBy: "fecha",
        rowsPerPage: 0
      },
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
          field: "valor",
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
      ventasData: [],
      comprasData: [],
      total_vendido: 0,
      total_comprado: 0,
      total_utilidad: 0
    };
  },
  methods: {
    update() {
      this.socket.post(
        "/inventoryreport",
        {
          solicitante: this.usuario.id,
          inicio: this.inicio,
          fin: this.fin
        },
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            this.ventasData = response.ventas;
            this.comprasData = response.compras;
            this.total_vendido = response.total_vendido;
            this.total_comprado = response.total_comprado;
            this.total_utilidad = response.total_utilidad;
          } else {
            console.log(response);
          }
        }
      );
      console.log('Se solicito el reporte');
    },
    formatCurrency(value) {
      return formatter.format(value);
    }
  }
};
</script>
