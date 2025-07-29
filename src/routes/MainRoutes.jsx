import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import { Navigate } from 'react-router-dom';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const ActionPlanDashboard = Loadable(lazy(() => import('views/Dashboard/ActionPlanDashboard')));
const PantauanRodaCC205 = Loadable(lazy(() => import('views/Dashboard/PantauanRodaCC205')));
const RekapDataFasilitas = Loadable(lazy(() => import('views/Dashboard/RekapDataFasilitas')));
const ManpowerDataManage = Loadable(lazy(() => import('views/Dashboard/ManpowerDataManage')));
const InputDataMultiKategori = Loadable(lazy(() => import('views/Dashboard/InputDataMultiKategori')));
const ComponentUsage = Loadable(lazy(() => import('views/Dashboard/ComponentUsage')));

const LoginUser = Loadable(lazy(() => import('views/Auth/LoginUser')));
const LoginAdmin = Loadable(lazy(() => import('views/Auth/LoginAdmin')));
const RegisterUser = Loadable(lazy(() => import('views/Auth/RegisterUser')));

const MainRoutes = [
  {
    path: '/',
    element: <Navigate to="/login-user" replace />
  },
  {
    path: '/login-user',
    element: <LoginUser />
  },
  {
    path: '/register-user',
    element: <RegisterUser />
  },
  {
    path: '/login-admin',
    element: <LoginAdmin />
  },
  {
    path: '/dashboard',
    element: <MainLayout />,
  children: [
    {
      path: '', // dashboard home
      element: <DashboardDefault />
    },
    {
      path: 'default',
      element: <DashboardDefault />
    },
    {
      path: 'pantauan-roda-cc205',
      element: <PantauanRodaCC205 />
    },
    { 
      path: 'rekap-fasilitas', 
      element: <RekapDataFasilitas /> },
    {
      path: 'action-plan',
      element: <ActionPlanDashboard />
    },
    {
      path: 'input-data-multi-kategori',
      element: <InputDataMultiKategori />
    },
    {
      path: 'manpower-data-manage',
      element: <ManpowerDataManage />
    },
    {
      path: 'component-usage',
      element: <ComponentUsage />
    }
  ]
  }
];

export default MainRoutes;
