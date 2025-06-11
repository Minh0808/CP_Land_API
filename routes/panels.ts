// src/routes/panels.ts
import { ServerRoute } from '@hapi/hapi';
import {
  getPanels,
  postPanel,
  putPanel,
  deletePanelDoc
} from '../docs/panels';

const panelsRoutes: ServerRoute[] = [
  { method: 'GET',    path: '/panels',      options: getPanels },
  { method: 'POST',   path: '/panels',      options: postPanel },
  { method: 'PUT',    path: '/panels/{id}', options: putPanel },
  { method: 'DELETE', path: '/panels/{id}', options: deletePanelDoc },
];

export default panelsRoutes;
