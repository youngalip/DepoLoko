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
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'; // ✅ Fault icon
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'; // ✅ Component Usage icon

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
  LogoutOutlinedIcon,
  WarningAmberOutlinedIcon,
  ListAltOutlinedIcon // ✅ daftarkan icon baru
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
          url: '/action-plan'
        },
        {
          id: 'pantauan-roda-cc205',
          title: 'Pantauan Roda CC205',
          type: 'item',
          icon: icons['DirectionsRailwayFilledIcon'],
          url: '/pantauan-roda-cc205'
        },
        {
          id: 'rekap-fasilitas',
          title: 'Rekap Data Fasilitas',
          type: 'item',
          icon: icons['TableChartOutlinedIcon'],
          url: '/rekap-fasilitas'
        },
        {
          id: 'manpower',
          title: 'Manpower Data',
          type: 'item',
          icon: icons['GroupOutlinedIcon'],
          url: '/manpower-data-manage'
        },
        {
          id: 'fault-history',
          title: 'Fault History',
          type: 'item',
          icon: icons['WarningAmberOutlinedIcon'],
          url: '/fault-history'
        },
        {
          id: 'component-usage',
          title: 'Component Usage',
          type: 'item',
          icon: icons['ListAltOutlinedIcon'], // ✅ Icon untuk component usage
          url: '/component-usage' // ✅ pastikan path sesuai dengan MainRoutes.jsx
        },
        {
          id: 'performance-history',
          title: 'Performance History',
          type: 'item',
          icon: icons['AssessmentOutlinedIcon'],
          url: '/performance-history'
        },

        {
          id: 'input-data',
          title: 'Input Data Dashboard',
          type: 'item',
          icon: icons['InputOutlinedIcon'],
          url: '/input-data'
        },
        { type: 'divider' },
        {
          id: 'account',
          title: 'Account',
          type: 'item',
          icon: icons['AccountCircleOutlinedIcon'],
          url: '/account'
        },
        {
          id: 'settings',
          title: 'Settings',
          type: 'item',
          icon: icons['SettingsOutlinedIcon'],
          url: '/settings'
        },
        { type: 'divider' },
        {
          id: 'call-center',
          title: 'Call Center',
          type: 'item',
          icon: icons['CallOutlinedIcon'],
          url: '/call-center'
        },
        {
          id: 'help',
          title: 'Help',
          type: 'item',
          icon: icons['HelpOutlineOutlinedIcon'],
          url: '/help'
        },
        {
          id: 'logout',
          title: 'Log Out',
          type: 'item',
          icon: icons['LogoutOutlinedIcon'],
          url: '/logout'
        }
      ]
    }
  ]
};
