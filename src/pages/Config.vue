<template>
  <q-page class="flex flex-top">
    <q-card style="width: 100%">
      <q-card-title>
        Configuraciones
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-table v-if="tableData != null" :data="tableData" :columns="columns" row-key="id">
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="identificador" :props="props">
              {{ props.row.identificador }}
            </q-td>
            <q-td key="valor" :props="props">
              {{ props.row.valor }}
            </q-td>
            <q-td key="id" :props="props">
              <q-btn size="sm" round dense color="red" icon="edit"
                     @click="modal_config(props.row.id)" class="q-mr-xs"/>
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
     * - usuario, objeto que contiene la informacion del usuario
     */
    props: ["socket", "usuario"],
    data() {
      return {
        /*Arreglo que contiene el esqueleto de las columnas de la tabla.
          Dicho esqueleto es computado con el nivel de permisos del usuario para presentar la configuracion de tabla
          acorde a los permisos que tenga el usuario*/
        columns_array: [
          {
            prop: "identificador",
            label: "Identificador",
            admin: false
          },
          {
            prop: "valor",
            label: "Valor",
            admin: false
          },
          {
            prop: "id",
            label: "Editar",
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
       * Funcion que actualiza la informacion
       */
      update() {
        //Solicitamos las configuraciones para llenar la tabla
        this.socket.get(
          "/db/configuracion/buscar",
          {
            consulta: {}
          },
          (response, jwRes) => {
            if (jwRes.statusCode === 200) {
              //Si la peticion fue exitosa actualizamos la informacion en la tabla
              this.tableData = response;
            }
          }
        );
      },
      modal_config(config_id) {
        //Se configura el modal y se recibe una promesa
        this.$q
          .dialog({
            title: "Nuevo Valor",
            message: "Ingrese el nuevo valor",
            prompt: {
              model: "",
              type: "text"
            },
            ok: "Confirmar",
            cancel: "Cancelar",
            cancel: true,
            color: "secondary"
          })
          .then(nuevoValor => {
            //En la resolucion de la promesa se hace una peticion al servidor con el valor recibido del modal
            this.socket.post(
              "/db/configuracion/editar",
              {
                id: config_id,
                valor: nuevoValor
              },
              (response) => {
                //Actualizamos la informacion teniendo en cuenta el filtro de busqueda
                this.update();
                console.log(response);
                this.notificar(`Configuracion ${response.identificador} actualizada, nuevo valor: ${response.valor}`);
              }
            );
          })
          .catch(() => {
            //En caso del rechazo de la promesa el modal fue cancelado
            console.log("Se cancelo el dialogo");
          });
      }
    }
  };
</script>
