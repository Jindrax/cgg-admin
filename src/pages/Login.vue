<template>
  <div class="fixed-center text-center">
    <q-card>
      <q-card-title>
        {{usuario? 'Cerrar Sesion' : 'Iniciar Sesion'}}
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-field label="Nombre de usuario" v-if="usuario==null">
          <q-input v-model="username" />
        </q-field>
        <br v-if="usuario==null">
        <q-field label="Contraseña" v-if="usuario==null">
          <q-input v-model="password" type="password" />
        </q-field>
        <br v-if="usuario==null">
        <q-btn label="Iniciar Sesion" style="width: 100%" @click="login(username, password)" color="primary" v-if="usuario==null"/>
        <q-btn label="Cerrar Sesion" style="width: 100%" @click="logout" color="primary" v-if="usuario!=null"/>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: ['socket', 'usuario'],
  data(){
    return {
      username: "",
      password: ""
    }
  },
  methods:{
    login(username, password){
      this.$emit('login', {username: username, password: password});
    },
    logout(){
      this.$emit('logout');
    }
  }
};
</script>
