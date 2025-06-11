import { ServerRoute } from "@hapi/hapi";
import user from "../docs/user";
const userRouter: ServerRoute[] = [
   { method: 'POST', path: '/user', options: user.createUser },
   { method: 'GET', path: '/user/{username}', options: user.getUser }
]
export default userRouter