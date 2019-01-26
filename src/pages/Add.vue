<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Crear Cliente
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-field label="Nombre de usuario">
          <q-input v-model="username"/>
        </q-field>
        <br>
        <q-field label="Contraseña">
          <q-input v-model="password" type="password"/>
        </q-field>
        <br>
        <!-- Dreprecado
        Se ha eliminado el programa pionero y la membresia se compra directamente por la aplicacion cliente o en la tabla
        <q-field label="Pionero">
          <q-toggle v-model="vip" />
        </q-field>
        <br>
        -->
        <q-field label="Operario" v-if="usuario.admin">
          <q-toggle v-model="op"/>
        </q-field>
        <br v-if="usuario.admin">
        <q-field label="Admin" v-if="usuario.admin">
          <q-toggle v-model="admin"/>
        </q-field>
        <br v-if="usuario.admin">
        <q-btn icon="create" label="Crear" style="width: 100%" @click="newCliente" color="primary"/>
      </q-card-main>
    </q-card>
    <q-card style="width: 100%">
      <q-card-title>
        Clientes
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-search hide-underline color="secondary" v-model="filter" style="width: 100%"
                  @input="val => {search(filter);}"/>
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
              <q-chip small square :color="props.row.saldo > 0? 'green' : 'red'" @click="modal_saldo(props.row.id)">{{
                props.row.saldo }}
              </q-chip>
            </q-td>
            <q-td key="sesion_activa" :props="props">
              <q-btn size="sm" round dense color="red" icon="cancel" :disable="props.row.sesion_activa==null"
                     @click="logoutFromApp(props.row.sesion_activa)" class="q-mr-xs"/>
            </q-td>
            <q-td v-if="usuario.admin" key="restaurar_pass" :props="props">
              <q-btn size="sm" round dense color="secondary" icon="edit" :disable="props.row.restaurar_pass"
                     @click="restore_pass(props.row.id, props.row.username)" class="q-mr-xs"/>
            </q-td>
            <q-td key="nombres" :props="props">
              {{ props.row.nombres }}
            </q-td>
            <q-td key="apellidos" :props="props">
              {{ props.row.apellidos }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="telefono" :props="props">
              {{ props.row.telefono }}
            </q-td>
            <q-td key="nacimiento" :props="props">
              {{ props.row.nacimiento }}
            </q-td>
          </q-tr>
        </q-table>
        <q-btn icon="update" label="Actualizar" style="width: 100%" @click="update" color="primary"/>
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
     * - usuario, objeto que contiene la informacion del usuario
     */
    props: ["socket", "usuario"],
    data() {
      return {
        //Nombre del usuario que se desea añadir
        username: "",
        //Contraseña del usuario que se desea añadir
        password: "",
        /* Campo obsoleto, se usaba para el programa pionero el cual se elimino del establecimiento
        vip: false,
        */
        //Bandera que indica que el usuario a ser añadido sera un operario del establecimiento
        op: false,
        //Bandera que indica que el usuario a ser añadido sera un administrador del establecimiento
        admin: false,
        //Campo para filtrar las filas en la tabla
        filter: "",
        /*Arreglo que contiene el esqueleto de las columnas de la tabla.
          Dicho esqueleto es computado con el nivel de permisos del usuario para presentar la configuracion de tabla
          acorde a los permisos que tenga el usuario*/
        columns_array: [
          {
            prop: "id",
            label: "ID",
            admin: false
          },
          {
            prop: "username",
            label: "Nombre de usuario",
            admin: false
          },
          {
            prop: "saldo",
            label: "Saldo",
            admin: false
          },
          {
            prop: "sesion_activa",
            label: "Sesion",
            admin: false
          },
          {
            prop: "restaurar_pass",
            label: "RC",
            admin: true
          },
          {
            prop: "nombres",
            label: "Nombres",
            admin: false
          },
          {
            prop: "apellidos",
            label: "Apellidos",
            admin: false
          },
          {
            prop: "email",
            label: "E-mail",
            admin: false
          },
          {
            prop: "telefono",
            label: "Telefono",
            admin: false
          },
          {
            prop: "nacimiento",
            label: "Fecha nacimiento",
            admin: false
          }
        ],
        //Objeto que contiene la informacion de la tabla
        tableData: null
      };
    },
    computed: {
      //Elemento de configuracion de la tabla computado, ver documentacion q-table
      columns() {
        let retorno = [];
        this.columns_array.forEach(column => {
          if (column.admin) {
            if (this.usuario.admin) {
              retorno.push({
                name: column.prop,
                required: true,
                label: column.label,
                align: "left",
                field: column.prop,
                sortable: true,
                style: "width: 500px"
              });
            }
          } else {
            retorno.push({
              name: column.prop,
              required: true,
              label: column.label,
              align: "left",
              field: column.prop,
              sortable: true,
              style: "width: 500px"
            });
          }
        });
        return retorno;
      }
    },
    mounted() {
      this.update();
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
       * Funcion que intenta crear un nuevo cliente en el servidor
       */
      newCliente: function () {
        let cliente = {
          username: this.username,
          password: this.password,
          operario: this.op,
          admin: this.admin
        };
        this.socket.post("/db/cliente/crear", {cliente: cliente}, (response, jwRes) => {
          if (jwRes.statusCode === 200) {
            //Limpiamos las variables
            this.username = "";
            this.password = "";
            if (this.usuario.admin) {
              this.op = false;
              this.admin = false;
            }
            //Actualizamos la informacion en el cliente
            this.update();
            //Notificamos del exito al usuario
            this.notificar("Usuario creado correctamente");
          } else {
            //Notificamos el error al usuario
            this.notificar(response);
          }
        });
      },
      /**
       * Funcion que actualiza la informacion
       */
      update() {
        //Solicitamos 30 clientes sorteados del creado mas recientemente hasta el mas antiguo
        this.socket.get(
          "/db/cliente/buscar",
          {
            consulta: {
              sort: 'createdAt DESC',
              limit: 30
            }
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //Si la peticion fue exitosa actualizamos la informacion en la tabla
              this.tableData = response;
            }
          }
        );
      },
      /**
       * Funcion que solicita una busqueda en el servidor para obtener clientes bajo un criterio
       * @param {String} val criterio de busqueda
       */
      search(val) {
        //Actualizamos el filtro de la tabla
        this.filter = val;
        //Realizamos una consulta sobre los clientes con los parametros de busqueda
        this.socket.get(
          '/db/cliente/buscar',
          {
            consulta: {
              where: {
                username: {
                  contains: val
                }
              },
              sort: 'createdAt DESC',
              limit: 30
            }
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //Actualizamos la tabla con la informacion resultante de la busqueda
              this.tableData = response;
            }
          }
        );
      },
      /**
       * Funcion para solicitar el restablecimiento de contraseña para un cliente
       * @param {Number} id ID del cliente que solicita el servicio
       * @param {String} username Nombre de usuario del cliente que solicita el servicio
       */
      restore_pass(id, username) {
        this.socket.post(
          "/restorepass",
          {
            cliente_user: username,
            cliente: id
          },
          (response) => {
            this.notificar(response);
          }
        );
      },
      /**
       * Funcion que presenta un modal y usa la informacion para modificar el saldo de un cliente, solo accesible como administrador
       * @param cliente_id
       */
      modal_saldo(cliente_id) {
        //Solo disponible para un administrador
        if (this.usuario.admin) {
          //Se configura el modal y se recibe una promesa
          this.$q
            .dialog({
              title: "Nuevo Saldo",
              message: "Ingrese el nuevo saldo",
              prompt: {
                model: "",
                type: "number"
              },
              ok: "Confirmar",
              cancel: "Cancelar",
              cancel: true,
              color: "secondary"
            })
            .then(nuevoSaldo => {
              //En la resolucion de la promesa se hace una peticion al servidor con el valor recibido del modal
              this.socket.post(
                "/replacesaldo",
                {
                  cliente: cliente_id,
                  valor: nuevoSaldo
                },
                (response) => {
                  //Actualizamos la informacion teniendo en cuenta el filtro de busqueda
                  if (this.filter === "") {
                    this.update();
                  } else {
                    this.search(this.filter);
                  }
                  //Notificamos al usuario
                  this.notificar(response);
                }
              );
            })
            .catch(() => {
              //En caso del rechazo de la promesa el modal fue cancelado
              console.log("Se cancelo el dialogo");
            });
        }
      },
      /**
       * Funcion que solicita el cierre de sesion de un cliente por parte de la aplicacion
       * @param {Number} sesion Id de la sesion activa que se quiere cerrar
       */
      logoutFromApp(sesion) {
        this.socket.post("/logout", {
          sesion: sesion.id,
          fromApp: true
        }, (response) => {
          //Notificamos la respuesta del servidor y mantenemos el estado de busqueda
          this.notificar(response);
          this.search(this.filter);
        });
      }
    }
  };
</script>
