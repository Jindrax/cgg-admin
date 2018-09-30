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
        <q-field label="Operario" v-if="usuario.admin">
          <q-toggle v-model="op" />
        </q-field>
        <br v-if="usuario.admin">
        <q-field label="Admin" v-if="usuario.admin">
          <q-toggle v-model="admin" />
        </q-field>
        <br v-if="usuario.admin">
        <q-btn icon="create" label="Crear" style="width: 100%" @click="newCliente" color="primary" />
      </q-card-main>
    </q-card>
    <br>
    <br>
    <q-search hide-underline color="secondary" v-model="filter" style="width: 100%" @input="val => {search(filter);}"/>
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
        <q-td key="restaurar_pass" :props="props">
          <q-btn size="sm" round dense color="secondary" icon="edit" :disable="props.row.restaurar_pass || !usuario.admin" @click="restore_pass(props.row.id, props.row.username)" class="q-mr-xs" />
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
  props: ["socket", "usuario"],
  data() {
    return {
      username: "",
      password: "",
      vip: false,
      op: false,
      admin: false,
      filter: "",
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
          name: "restaurar_pass",
          required: true,
          label: "Restaurar Contraseña",
          align: "left",
          field: "restaurar_pass",
          sortable: false,
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
        meses_constante: this.vip ? 5 : 4,
        operario: this.op,
        admin: this.admin
      };
      this.socket.post("/adminlog", {
        fecha: Date.now(),
        anotacion: `${this.usuario.username} creó al usuario ${cliente.username} con los modificadores: tipo de cliente: ${cliente.vip? 'pionero' : 'normal'}${cliente.operario? ', operario':''}${cliente.admin? ', admin':''}`
      },(response, jwRes)=>{
        if(jwRes.statusCode != 200){
          this.notificar(response);
        }
      });
      this.socket.post("/cliente", cliente, (response, jwRes) => {
        if (jwRes.statusCode == 200) {
          this.username = "";
          this.password = "";
          this.vip = false;
          if(this.usuario.admin){
            this.op = false;
            this.admin = false;
          }
          this.update();
          this.notificar("Usuario creado correctamente");
        } else {
          this.notificar(response);
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
    },
    search(val){
      this.socket.get(
        `/cliente?where={"username":{"contains":"${val}"}}&sort=createdAt DESC&limit=30`,
        null,
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            this.tableData = response;
          }
        }
      );
    },
    restore_pass(id, username){
      this.socket.post(
        "/restorepass",
        {
          operario_user: this.usuario.username,
          cliente_user: username,
          cliente: id
        },
        (response, jwRes) => {
          if (jwRes.statusCode == 200) {
            //this.tableData = response;
          }
          this.notificar(response);
        }
      );
    }
  }
};
</script>
