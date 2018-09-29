<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Cargar Saldo
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Nombre de usuario">
          <q-input v-model="username" />
        </q-field>
        <br>
        <q-field label="Saldo">
          <q-input v-model="saldo" />
        </q-field>
        <br>
        <q-btn icon="create" label="Cargar" style="width: 100%" @click="charge" color="primary" />
      </q-card-main>
    </q-card>
    <br>
    <q-table v-if="tableData != null" :data="tableData" :columns="columns" row-key="fecha" style="width: 100%">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="fecha" :props="props">
          {{ formatFecha(props.row.fecha) }}
        </q-td>
        <q-td key="operario" :props="props">
          {{ props.row.operario.username }}
        </q-td>
        <q-td key="cliente" :props="props">
          {{ props.row.cliente.username }}
        </q-td>
        <q-td key="valor" :props="props">
          <q-chip small square color="green">{{ props.row.valor }}</q-chip>
        </q-td>
        <q-td key="valor_promocional" :props="props">
          {{ props.row.valor_promocional }}
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
var moment = require("moment");
moment.locale('es');
export default {
  name: "PageIndex",
  props: ["socket"],
  data() {
    return {
      username: "",
      saldo: 0,
      columns: [
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
          label: "Valor Promocional",
          align: "left",
          field: "valor_promocional",
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
    charge() {
      this.socket.get(
        "/cliente",
        {
          username: this.username
        },
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            if(response.length>0){
              let carga = {
              operario: 1,
              cliente: response[0].id,
              valor_recibido: this.saldo
            };
            this.socket.post("/addcredit", carga, (response, jwRes) => {
              if (jwRes.statusCode == 200) {
                this.username = "";
                this.saldo = 0;
              }
              this.update();
              this.$q.notify(response);
            });
            }else{
              this.username = "";
              this.saldo = 0;
              this.$q.notify("El cliente no se encuentra registrado en el sistema");
            }
          } else {
            this.$q.notify(response);
          }
        }
      );
    },
    update() {
      this.socket.get(
        "/cobro?sort=createdAt%20DESC&limit=30&populate=operario,cliente",
        null,
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            this.tableData = response;
          }
        }
      );
    },
    formatFecha(fecha) {
      return moment(fecha).format("LLL");
    }
  }
};
</script>
