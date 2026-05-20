import { Params } from '../Params';

export const navData = [
  {
    routerLink: Params.PageNames.dashboard,
    icon: 'lucideLayoutDashboard',
    label: 'Dashboard',
  },
  {
    routerLink: 'announcement',
    icon: 'lucideMegaphone',
    label: 'Announcement',
  },
  {
    routerLink: Params.PageNames.courses,
    icon: 'lucideBookOpen',
    label: 'Courses',
  },
  {
    routerLink: Params.PageNames.tests,
    icon: 'lucideSquarePen',
    label: 'Tests',
  },
  {
    routerLink: Params.PageNames.practice_papers,
    icon: 'lucideFileText',
    label: 'Practice Papers',
  },
  {
    routerLink: 'forums',
    icon: 'lucideMessageCircle',
    label: 'Forums',
  },
  {
    routerLink: 'leaderboard',
    icon: 'lucideTrophy',
    label: 'Leaderboard',
  },
];
