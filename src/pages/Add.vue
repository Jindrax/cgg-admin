<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Crear Cliente
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Nombre de usuario">
          <q-input v-model="username" />
        </q-field>
        <br>
        <q-field label="Contraseña">
          <q-input v-model="password" type="password" />
        </q-field>
        <br>
        <q-field label="Pionero">
          <q-toggle v-model="vip" />
        </q-field>
        <br>
        <q-btn icon="create" label="Crear" style="width: 100%" @click="newCliente" color="primary" />
      </q-card-main>
    </q-card>
    <br>
    <q-table v-if="tableData != null" :data="tableData" :columns="columns" row-key="id">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="username" :props="props">
          {{ props.row.username }}
        </q-td>
        <q-td key="saldo" :props="props">
          <q-chip small square :color="props.row.saldo > 0? 'green' : 'red'">{{ props.row.saldo }}</q-chip>
        </q-td>
        <q-td key="meses_constante" :props="props">
          <q-btn size="sm" round dense color="secondary" icon="edit" @click="notificar(`Modificar usuario: ${props.row.id}`)" class="q-mr-xs" />
        </q-td>
      </q-tr>
    </q-table>    
    <q-btn icon="update" label="Actualizar" style="width: 100%" @click="update" color="primary" />
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
      username: "",
      password: "",
      vip: false,
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: "id",
          sortable: true,
          style: "width: 500px"
        },
        {
          name: "username",
          required: true,
          label: "Nombre de usuario",
          align: "left",
          field: "username",
          sortable: false,
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
        },
        {
          name: "meses_constante",
          required: true,
          label: "Editar",
          align: "left",
          field: "meses_constante",
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
    notificar(mensaje) {
      this.$q.notify(mensaje);
    },
    newCliente() {
      let cliente = {
        username: this.username,
        password: this.password,
        vip: this.vip ? true : false,
        meses_constante: this.vip ? 5 : 4
      };
      this.socket.post("/cliente", cliente, (response, jwRes) => {
        if (jwRes.statusCode == 200) {
          this.username = "";
          this.password = "";
          this.vip = false;
          this.update();
          this.$q.notify("Usuario creado correctamente");
        } else {
          this.$q.notify(response);
        }
      });
    },
    update() {
      this.socket.get(
        "/cliente?sort=createdAt DESC&limit=30",
        null,
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            this.tableData = response;
          }
        }
      );
    }
  }
};
</script>
