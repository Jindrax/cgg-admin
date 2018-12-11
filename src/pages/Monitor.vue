<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Monitoreo de equipos
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-table v-if="tableData != null" :data="tableData" :columns="columns" row-key="equipo" :pagination.sync="pagination" style="width: 100%">
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="equipo" :props="props">
              {{ props.row.equipo }}
            </q-td>
            <q-td key="ultima_ip" :props="props">
              {{ props.row.ultima_ip }}
            </q-td>
            <q-td key="activo" :props="props">
              <q-chip small square :color="props.row.activo? 'green' : 'red'">{{ props.row.activo? 'Activo' : 'Desconectado' }}</q-chip>
            </q-td>
            <q-td key="cliente" :props="props">
              <q-chip small square :color="props.row.cliente!=null? 'green' : 'red'">{{ props.row.cliente != null? props.row.cliente.username : 'Null' }}</q-chip>
            </q-td>
            <q-td key="saldo" :props="props">
              {{ props.row.cliente!=null? props.row.cliente.saldo : 'Null'}}
            </q-td>
          </q-tr>
        </q-table>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: "PageIndex",
  props: ["socket"],
  data() {
    return {
      pagination: {
        sortBy: "equipo",
        rowsPerPage: 0
      },
      columns: [
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
          name: "ultima_ip",
          required: true,
          label: "Ultima IP",
          align: "left",
          field: "ultima_ip",
          sortable: false,
          style: "width: 500px"
        },
        {
          name: "activo",
          required: true,
          label: "Activo",
          align: "left",
          field: "activo",
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
          name: "saldo",
          required: true,
          label: "Saldo",
          align: "left",
          field: "saldo",
          sortable: true,
          style: "width: 500px"
        }
      ],
      tableData: null
    };
  },
  mounted() {
    this.socket.get("/watchmonitor", null, (response, jwRes) => {
      if (jwRes.statusCode == 200) {
        this.tableData = response;
      }
      setTimeout(this.monitorear(), 60000);
    });
    this.socket.on("watchUpdate", msg => {
      this.tableData = msg;
    });
  },
  methods: {
    notificar(mensaje) {
      this.$q.notify(mensaje);
    },
    monitorear() {
      this.socket.get("/refreshmonitor", null, (response, jwRes) => {
        if (jwRes.statusCode == 200) {
          this.tableData = response;
        }
        setTimeout(this.monitorear(), 60000);
      });
    }
  }
};
</script>
