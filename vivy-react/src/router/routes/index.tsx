import { AppRouteMenu } from '../types'

export const RootRoute: AppRouteMenu[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Home',
    path: '/home',
    component: 'home/index',
    icon: 'ant-design:home-outlined',
  },
]

export const LoginRoute: AppRouteMenu = {
  name: 'Login',
  path: '/login',
  component: 'login/index',
  layout: false,
  hideInMenu: true,
}

export const NotFoundRoute: AppRouteMenu = {
  path: '*',
  component: '404',
  hideInMenu: true,
}

export const AccountRoute: AppRouteMenu = {
  name: 'Account Management',
  path: '/account',
  hideInMenu: true,
  children: [
    {
      name: 'Personal Center',
      path: 'center',
      component: 'account/center/index',
    },
  ],
}

export const localRoutes: AppRouteMenu[] = [...RootRoute, LoginRoute, AccountRoute, NotFoundRoute]
