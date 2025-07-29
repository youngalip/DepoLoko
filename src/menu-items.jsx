
// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DirectionsRailwayFilledIcon from '@mui/icons-material/DirectionsRailwayFilled';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';


const icons = {
  HomeOutlinedIcon,
  AssessmentOutlinedIcon,
  DirectionsRailwayFilledIcon,
  TableChartOutlinedIcon,
  GroupOutlinedIcon,
  InputOutlinedIcon,
  AccountCircleOutlinedIcon,
  SettingsOutlinedIcon,
  CallOutlinedIcon,
  HelpOutlineOutlinedIcon,
  CopyrightOutlinedIcon,
  LogoutOutlinedIcon
};

export default {
  items: [
    {
      id: 'main',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        },
        {
          id: 'action-plan',
          title: 'Monitoring Action Plan',
          type: 'item',
          icon: icons['AssessmentOutlinedIcon'],
          url: '/dashboard/action-plan'
        },
        {
          id: 'pantauan-roda-cc205',
          title: 'Pantauan Roda CC205',
          type: 'item',
          icon: icons['DirectionsRailwayFilledIcon'],
          url: '/dashboard/pantauan-roda-cc205'
        },
        {
          id: 'rekap-fasilitas',
          title: 'Rekap Data Fasilitas',
          type: 'item',
          icon: icons['TableChartOutlinedIcon'],
          url: '/dashboard/rekap-fasilitas'
        },
        {
          id: 'manpower',
          title: 'Manpower Data',
          type: 'item',
          icon: icons['GroupOutlinedIcon'],
          url: '/dashboard/manpower-data-manage'
        },
        {
          id: 'component-usage',
          title: 'Component Usage',
          type: 'item',
          icon: icons['TableChartOutlinedIcon'],
          url: '/dashboard/component-usage'
        },
        {
          id: 'input-data',
          title: 'Input Data Multi-Kategori',
          type: 'item',
          icon: icons['InputOutlinedIcon'],
          url: '/dashboard/input-data-multi-kategori'
        },
        {
          id: 'account',
          title: 'Account',
          type: 'item',
          icon: icons['AccountCircleOutlinedIcon'],
          url: '/account'
        },
        {
          id: 'copyright',
          title: '2025 KAI Divre IV',
          type: 'item',
          icon: icons['CopyrightOutlinedIcon'],
          url: '#',
        },
        {
          id: 'logout',
          title: 'Log Out',
          type: 'item',
          icon: icons['LogoutOutlinedIcon'],
          url: '/login-user'
        }
      ]
    }
  ]
};
