import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const ActionPlanDashboard = Loadable(lazy(() => import('views/Dashboard/ActionPlanDashboard')));
const PantauanRodaCC205 = Loadable(lazy(() => import('views/Dashboard/PantauanRodaCC205')));
const RekapDataFasilitas = Loadable(lazy(() => import('views/Dashboard/RekapDataFasilitas')));
const ManpowerDataManage = Loadable(lazy(() => import('views/Dashboard/ManpowerDataManage')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: '/default',
      element: <DashboardDefault />
    },
    {
      path: '/pantauan-roda-cc205',
      element: <PantauanRodaCC205 />
    },
    { 
      path: '/rekap-fasilitas', 
      element: <RekapDataFasilitas /> },
    {
      path: '/action-plan',
      element: <ActionPlanDashboard />
    },
    {
      path: '/manpower-data-manage',
      element: <ManpowerDataManage />
    }
  ]
};

export default MainRoutes;
