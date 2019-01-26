const routes = [
  {
    //Ruta de entrada a la aplicacion
    path: '/',
    //Layout cargado en la ruta de entrada
    component: () => import('layouts/MyLayout.vue'),
    //El controlador de rutas en el layout se encarga de manejar las siguientes rutas
    children: [
      //Ruta de entrada al controlador
      {path: '', component: () => import('pages/Login.vue'), props: true},
      {path: '/monitor', component: () => import('pages/Monitor.vue'), props: true},
      {path: '/add', component: () => import('pages/Add.vue'), props: true},
      {path: '/charge', component: () => import('pages/Charge.vue'), props: true},
      {path: '/inventario', component: () => import('pages/Inventario.vue'), props: true},
      {path: '/venta', component: () => import('pages/Venta.vue'), props: true},
      {path: '/sesionreport', component: () => import('pages/SesionReport.vue'), props: true},
      {path: '/inventoryreport', component: () => import('pages/InventoryReport.vue'), props: true}
    ]
  }
]

//Always leave this as last one
//En caso de llegar a una ruta no definida anterior a este punto se llega a la pagina 404
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
