<template>
  <q-page class="flex flex-top">
    <q-card style="width: 30%">
      <q-card-title>
        Nueva Venta
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Descripcion">
          <q-select v-model="seleccionado" :options="getOpciones()" />
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades" />
        </q-field>
        <br>
        <q-btn icon="create" label="Añadir" style="width: 100%" @click="addItem" color="primary" />
      </q-card-main>
    </q-card>
    <div style="width: 70%">
      <q-table v-if="tableData != null" title="Inventario" :data="tableData" :columns="columns" row-key="descripcion" :pagination.sync="pagination" />
      <q-btn icon="monetization_on" :label="`Pagar ${total} pesos`" style="width: 100%" @click="newSale" color="primary" />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
var moment = require("moment");
moment.locale("es");
export default {
  name: "PageIndex",
  props: ["socket", "usuario"],
  data() {
    return {
      pagination: {
        sortBy: "equipo",
        rowsPerPage: 0
      },
      descripcion: "",
      unidades: 0,
      seleccionado: null,
      inventario: [],
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
      tableData: []
    };
  },
  mounted() {
    this.update();
  },
  computed: {
    total() {
      return this.tableData.reduce((valorAnterior, valorActual) => {
        return valorAnterior + valorActual.valor_total;
      }, 0);
    },
    utilidad(){
      return this.tableData.reduce((valorAnterior, valorActual) => {
        return valorAnterior + valorActual.utilidad_total;
      }, 0);
    }
  },
  methods: {
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
          if (jwRes.statusCode != 200) {            
            this.$q.notify(response);
          } else {
            this.tableData = [];
            this.$q.notify(response);
            this.update();
          }
        }
      );
    },
    update() {
      this.socket.get("/item", null, (response, jwRes) => {
        if (jwRes.statusCode == 200) {
          this.inventario = response;
        }
      });
    },
    getOpciones() {
      if (this.inventario.length > 0) {
        return this.inventario.map((item, index) => {
          return {
            label: item.descripcion,
            value: index
          };
        });
      } else {
        return [];
      }
    },
    addItem() {
      let item = this.inventario[this.seleccionado];
      this.socket.post(
        "/checkstock",
        {
          itemID: item.id,
          unidades: this.unidades
        },
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            this.tableData.push({
              id: item.id,
              item: item.descripcion,
              unidades: this.unidades,
              precio: item.precio_venta,
              valor_total: item.precio_venta * this.unidades,
              utilidad_total: (item.precio_venta - item.precio_compra) * this.unidades
            });
            this.seleccionado = null;
            this.unidades = 0;
          }else{
            this.$q.notify(response);
          }
        }
      );
    }
  }
};
</script>
