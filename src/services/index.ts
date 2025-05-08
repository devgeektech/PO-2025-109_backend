import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import propertyRoutes from './property/routes';
import notificationRoutes from './notification/routes';
import contactRoutes from './contact/routes';
import inquiryRoutes from './inquiry/routes';
import siteRoutes from './site/routes';
import newsRoutes from './news/routes';

export default [
    ...authRoutes,
    ...userRoutes,
    ...propertyRoutes,
    ...notificationRoutes,
    ...contactRoutes,
    ...inquiryRoutes,
    ...siteRoutes,
    ...newsRoutes,
];
