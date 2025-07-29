import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const ActionPlanDashboard = Loadable(lazy(() => import('views/Dashboard/ActionPlanDashboard')));
const PantauanRodaCC205 = Loadable(lazy(() => import('views/Dashboard/PantauanRodaCC205')));
const RekapDataFasilitas = Loadable(lazy(() => import('views/Dashboard/RekapDataFasilitas')));
const ManpowerDataManage = Loadable(lazy(() => import('views/Dashboard/ManpowerDataManage')));
const FaultHistory = Loadable(lazy(() => import('views/Dashboard/FaultHistory'))); // ✅ Tambahkan ini
const ComponentUsage = Loadable(lazy(() => import('views/Dashboard/ComponentUsage')));
const PerformanceHistory = Loadable(lazy(() => import('views/Dashboard/PerformanceHistory')));


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
      element: <RekapDataFasilitas />
    },
    {
      path: '/action-plan',
      element: <ActionPlanDashboard />
    },
    {
      path: '/manpower-data-manage',
      element: <ManpowerDataManage />
    },
    {
      path: '/fault-history',
      element: <FaultHistory />
    },
    {
      path: '/component-usage',
      element: <ComponentUsage />
    },
    {
      path: '/performance-history',
      element: <PerformanceHistory />
    }
  ]
};

export default MainRoutes;
