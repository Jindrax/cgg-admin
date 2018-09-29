<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Nuevo Item
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Descripcion">
          <q-input v-model="descripcion" />
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades" />
        </q-field>
        <br>
        <q-field label="Precio">
          <q-input v-model="precio_venta" />
        </q-field>
        <br>
        <q-field label="Costo">
          <q-input v-model="precio_compra" />
        </q-field>
        <br>
        <q-btn icon="create" label="Crear Item" style="width: 100%" @click="newItem" color="primary" />
      </q-card-main>
    </q-card>
    <br>
    <q-table v-if="tableData != null" title="Inventario" :data="tableData" :columns="columns" row-key="descripcion" style="width: 100%" />
    <br>
    <q-card style="width: 100%">
      <q-card-title>
        Recargar Inventario
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Descripcion">
          <q-select v-model="item_restock" :options="getOpciones()" />
        </q-field>
        <br>
        <q-field label="Unidades">
          <q-input v-model="unidades_restock" />
        </q-field>
        <br>
        <q-field label="Costo">
          <q-input v-model="precio_compra_restock" />
        </q-field>
        <br>
        <q-btn icon="update" label="Recargar Item" style="width: 100%" @click="restock" color="primary" />
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
var moment = require("moment");
moment.locale("es");
export default {
  name: "PageIndex",
  props: ["socket"],
  data() {
    return {
      descripcion: "",
      unidades: 0,
      precio_compra: 0,
      precio_venta: 0,
      item_restock: "",
      unidades_restock: 0,
      precio_compra_restock: 0,
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
      tableData: null
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    newItem() {
      this.socket.post(
        "/item",
        {
          descripcion: this.descripcion,
          unidades: this.unidades,
          precio_venta: this.precio_venta,
          precio_compra: this.precio_compra
        },
        (response, jwRes) => {
          if (jwRes.statusCode != 200) {
            this.$q.notify(response);
          } else {
            this.descripcion = "";
            this.unidades = 0;
            this.precio_venta = 0;
            this.precio_compra = 0;
            this.update();
          }
        }
      );
    },
    update() {
      this.socket.get("/item", null, (response, jwRes) => {
        if (jwRes.statusCode == 200) {
          this.tableData = response;
        }
      });
    },
    getOpciones() {
      if (this.tableData != null && this.tableData.length > 0) {
        return this.tableData.map((item, index) => {
          return {
            label: item.descripcion,
            value: index
          };
        });
      } else {
        return [];
      }
    },
    restock() {
      let item = this.tableData[this.item_restock];
      this.socket.post(
        "/restock",
        {
          itemID: item.id,
          unidades: this.unidades_restock,
          precio_compra: this.precio_compra_restock
        },
        (response, jwRes) => {
          this.item_restock = "";
          this.unidades_restock = 0;
          this.precio_compra_restock = 0;
          this.$q.notify(response);
          this.update();
        }
      );
    }
  }
};
</script>
