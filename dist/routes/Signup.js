"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signup_1 = require("../docs/Signup");
const signupRoutes = [
    { method: 'GET', path: '/api/signup', options: Signup_1.signupHealth },
    { method: 'POST', path: '/api/signup', options: Signup_1.signupPost }
];
exports.default = signupRoutes;
