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
  /**
   * Propiedades desde el componente padre
   * - socket, puerto de comunicacion con el servidor
   */
  props: ["socket"],
  data() {
    return {
      //Elemento de configuracion para la tabla, ver documentacion de q-table
      pagination: {
        sortBy: "equipo",
        rowsPerPage: 0
      },
      //Elemento de configuracion para la tabla, ver documentacion de q-table
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
      //Objeto que contiene la informacion para llenar la tabla
      tableData: null
    };
  },
  mounted() {
    //Peticion al servidor para incluir la aplicacion como monitor de los equipos
    this.socket.get("/watchmonitor", null, (response, jwRes) => {
      if (jwRes.statusCode === 200) {
        //Si la peticion fue correcta, en la respuesta se encuentra la informacion para llenar la tabla
        this.tableData = response;
      }
      //Se agenda una funcion para actualizar la informacion cada minuto (60.000 ms)
      setTimeout(this.monitorear(), 60000);
    });
    //Se escucha el evento en el que el servidor notifica sobre cambios en los equipos monitoreados
    this.socket.on("watchUpdate", msg => {
      //Se actualizan dichos cambios en la tabla
      this.tableData = msg;
    });
  },
  methods: {
    /**
     * Funcion para simplificar la notificacion al usuario
     * @param {String} mensaje notificacion para que vea el usuario
     */
    notificar(mensaje) {
      this.$q.notify(mensaje);
    },
    /**
     * Funcion que solicita al servidor actualizaciones en el estado de los equipos monitoreados
     */
    monitorear() {
      this.socket.get("/refreshmonitor", null, (response, jwRes) => {
        if (jwRes.statusCode === 200) {
          //En caso de que la peticion sea correcta, se actualiza la informacion de la tabla
          this.tableData = response;
        }
        //Se agenda la siguiente iteracion de este metodo
        setTimeout(this.monitorear(), 60000);
      });
    }
  }
};
</script>
