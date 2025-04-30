import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  // {
  //   title: 'Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },

  {
    title: 'POS',
    icon: 'shopping-cart-outline',
    children: [
      {
        title: 'Sale',
        link: '/pages/pos/add-sale',
      },
      {
        title: 'Inventory',
        link: '/pages/pos/add-inventory',
      },
      {
        title: 'Product',
        link: '/pages/pos/product',
      },
      {
        title: 'Stock',
        link: '/pages/pos/stock',
      },
      {
        title: 'Category',
        link: '/pages/pos/category',
      },
      {
        title: 'Brand',
        link: '/pages/pos/brand',
      },
      {
        title: 'Supplier',
        link: '/pages/pos/supplier',
      },
    ],
  },

  {
    title: 'Settings',
    icon: 'settings-outline',
    children: [
      {
        title: 'Company',
        link: '/pages/features/company',
      },
      {
        title: 'Accounts',
        link: '/pages/features/accounts',
      },
    ],
  },
  {
    title: 'Client',
    icon: 'people-outline',
    link: '/pages/features/client',
  },
  {
    title: 'Sponsor',
    icon: 'star-outline',
    link: '/pages/features/sponsor',
  },
  {
    title: 'Users',
    icon: 'person-outline',
    link: '/pages/features/users',
  },
  {
    title: 'Designations',
    icon: 'layers-outline',
    link: '/pages/features/designations',
  },
  {
    title: 'Projects',
    icon: 'clipboard-outline',
    link: '/pages/features/projects',
  },
  {
    title: 'Asset / Timesheet',
    icon: 'cube-outline',
    link: '/pages/features/asset',
  },
  {
    title: 'Invoice',
    icon: 'file-text-outline',
    children: [
      {
        title: 'Invoices Managment',
        link: '/pages/features/invoice-detail',
      },
      {
        title: 'Prepare Invoices',
        link: '/pages/features/invoice',
      },
    ],
  },
  {
    title: 'Payment',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Asset Payment',
        link: '/pages/features/payment-management/asset-payment',
      },
      {
        title: 'Sponsor Payment',
        link: '/pages/features/payment-management/sponsor-payment',
      },
      {
        title: 'Invoice Payment',
        link: '/pages/features/invoice-detail',
      },
      {
        title: 'Expense',
        link: '/pages/features/payment-management/expense',
      },
    ],
  },
  {
    title: 'Ledger',
    icon: 'credit-card-outline',
    link: '/pages/features/ledger',
  },
];
