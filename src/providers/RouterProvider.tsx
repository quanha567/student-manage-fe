import { RouterProvider as ReactRouterProvider } from 'react-router-dom';

import { privateRouters } from '@/routers';

export const RouterProvider = () => {
  return <ReactRouterProvider router={privateRouters} />;
};
