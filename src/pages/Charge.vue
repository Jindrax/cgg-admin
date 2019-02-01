<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>Cargar Saldo</q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field label="Nombre de usuario">
          <q-input v-model="username"/>
        </q-field>
        <br>
        <q-field label="Saldo">
          <q-input v-model="saldo"/>
        </q-field>
        <br>
        <q-btn icon="create" label="Cargar" style="width: 100%" @click="charge" color="primary"/>
      </q-card-main>
    </q-card>
    <br>
    <q-table
      v-if="tableData != null"
      :data="tableData"
      :columns="columns"
      row-key="fecha"
      style="width: 100%"
    >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="fecha" :props="props">{{ formatFecha(props.row.fecha) }}</q-td>
        <q-td key="operario" :props="props">{{ props.row.operario.username }}</q-td>
        <q-td key="cliente" :props="props">{{ props.row.cliente.username }}</q-td>
        <q-td key="valor" :props="props">
          <q-chip small square color="green">{{ props.row.valor }}</q-chip>
        </q-td>
        <q-td key="valor_promocional" :props="props">{{ props.row.valor_promocional }}</q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
//Libreria en nodejs para el manejo del tiempo
const moment = require("moment");
//Configuracion de localizacion
moment.locale("es");
export default {
  name: "PageIndex",
  /**
   * Propiedades desde el componente padre
   * - socket, puerto de comunicacion con el servidor
   * - usuario, objeto con la informacion del usuario
   */
  props: ["socket", "usuario"],
  data() {
    return {
      //Nombre de usuario del cliente al que se desea hacer una recarga
      username: "",
      //Saldo que desea cargar al cliente
      saldo: 0,
      //Elemento de configuracion de la tabla, ver documentacion q-table
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
      //Objeto que contiene la informacion de la tabla
      tableData: null
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    /**
     * Funcion que intenta cargar saldo al cliente que lo solicita
     */
    charge() {
      //Objeto que se enviara en la peticion al servidor
      let carga = {
        cliente: this.username,
        valor_recibido: this.saldo
      };
      this.socket.post("/addcredit", carga, (response, jwRes) => {
        //Limpiamos las variables
        this.username = "";
        this.saldo = 0;
        if (jwRes.statusCode === 200) {
          //Si la peticion fue exitosa actualizamos la informacion
          this.update();
          this.$q.notify(response);
        } else {
          this.$q.notify("El cliente no se encuentra registrado en el sistema");
        }
      });
    },
    /**
     * Funcion que actualiza la informacion de la tabla
     */
    update() {
      this.socket.get(
        "/db/cobro/buscar",
        {
          consulta: {
            sort: "createdAt DESC",
            limit: 30
          }
        },
        (response, jwRes) => {
          if (jwRes.statusCode === 200) {
            //Si la peticion fue exitosa actualizamos la tabla
            this.tableData = response;
          }
        }
      );
    },
    /**
     * Funcion que formatea la fecha, ver documentacion de moment.js
     * @param fecha Fecha en formato unix time stamp
     * @returns {string} Fecha formateada
     */
    formatFecha(fecha) {
      return moment(fecha).format("LLL");
    }
  }
};
</script>
