"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userMess_1 = require("../docs/userMess");
const userMessRoutes = [
    { method: 'GET', path: '/api/messager', options: userMess_1.userMessHealth },
    { method: 'POST', path: '/api/messager', options: userMess_1.userMessPost }
];
exports.default = userMessRoutes;
