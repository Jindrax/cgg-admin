
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Monitor.vue'), props: true },
      { path: '/add', component: () => import('pages/Add.vue'), props: true },
      { path: '/charge', component: () => import('pages/Charge.vue'), props: true },
      { path: '/inventario', component: () => import('pages/Inventario.vue'), props: true },
      { path: '/venta', component: () => import('pages/venta.vue'), props: true }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes