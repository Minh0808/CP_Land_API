
import { ServerRoute } from '@hapi/hapi';
import Auth from '../docs/auth'

const authRoutes: ServerRoute[] = [
   // { method: 'GET', path:'/auth/me', config: Auth.getMe },
   { method: 'POST', path:'/auth/login', options: Auth.login },
   { method: 'GET', path: '/auth/me', options: Auth.getUserMe },
   { method: 'POST', path:'/auth/logout', options: Auth.logout }
]

export default authRoutes;