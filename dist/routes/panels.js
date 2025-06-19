"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const panels_1 = require("../docs/panels");
const panelsRoutes = [
    { method: 'GET', path: '/panels', options: panels_1.getPanels },
    { method: 'POST', path: '/panels', options: panels_1.postPanel },
    { method: 'PUT', path: '/panels/{id}', options: panels_1.putPanel },
    { method: 'DELETE', path: '/panels/{id}', options: panels_1.deletePanelDoc },
];
exports.default = panelsRoutes;
