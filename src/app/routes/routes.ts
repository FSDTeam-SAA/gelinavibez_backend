import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { apartmentRouter } from '../modules/apartment/apartment.routes';
import { contactRouter } from '../modules/contact/contact.routes';
import { serviceRouter } from '../modules/service/service.routes';
import { contractorRouter } from '../modules/contractor/contractor.routes';
import { callRequestRouter } from '../modules/callRequest/callRequest.routes';
import { tenantRouter } from '../modules/tenant/tenant.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/apartment',
    route: apartmentRouter,
  },
  {
    path: '/contact',
    route: contactRouter,
  },
  {
    path: '/service',
    route: serviceRouter,
  },
  {
    path: '/contractor',
    route: contractorRouter,
  },
  {
    path: '/callrequest',
    route: callRequestRouter,
  },
  {
    path: '/tenant',
    route: tenantRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
