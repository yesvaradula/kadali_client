import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibCodepen,
  cibLivejournal,
  cilSpeedometer,
  cibProbot,
  cilFactory,
  cibBitcoin,
  cilFlagAlt,cilFile
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import pages from '../../shared/permissions'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  ...((pages.includes('invoice') || pages.includes('all')) ? [
    {
      component: CNavGroup,
      name: 'Invoice',
      items: [
        ...((pages.includes('_invoice_draft') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'Quotation Bill',
          to: '/invoice/draft',
          icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
        },] : []), 
        ...((pages.includes('_invoice_booked') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'Booked List',
          to: '/invoice/booked',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []), 
        ...((pages.includes('_invoice_quotation') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'Quotation List',
          to: '/invoice/quotation',
          icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
        },] : []), 
        ...((pages.includes('_invoice_list') || pages.includes('all')) ? [ {
          component: CNavItem,
          name: 'Invoice List',
          to: '/invoice/list',
          icon: <CIcon icon={cilFlagAlt} customClassName="nav-icon" />,
        },] : []),
        ...((pages.includes('_invoice_paid') || pages.includes('all')) ? [ {
          component: CNavItem,
          name: 'Cash Invoices',
          to: '/invoice/paid',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []),
        ...((pages.includes('_invoice_printed') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'Taxable Invoices',
          to: '/invoice/printed',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []),
      ]
    }
  ]: []
  ),
  ...((pages.includes('invoice_received') || pages.includes('all')) ? [
    {
      component: CNavGroup,
      name: 'Invoice Received',
      items: [
        ...((pages.includes('_receive') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'Receive',
          to: '/returns',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []), 
        ...((pages.includes('_returns_pending') || pages.includes('all')) ? [ {
          component: CNavItem,
          name: 'Pending List',
          to: '/returns/pending',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []), 
        ...((pages.includes('_returns_list') || pages.includes('all')) ? [ {
          component: CNavItem,
          name: 'Received List',
          to: '/returns/list',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []),
        ...((pages.includes('_returns_damaged') || pages.includes('all')) ? [ {
          component: CNavItem,
          name: 'Damaged List',
          to: '/returns/damaged',
          icon: <CIcon icon={cibBitcoin} customClassName="nav-icon" />,
        },] : []), 
      ]
    }
  ]: []  
  ),
  ...((pages.includes('products') || pages.includes('all')) ? [
    {
      component: CNavGroup,
      name: 'Products',
      items: [
        ...(pages.includes('_products_add') || pages.includes('all')
          ? [
              {
                component: CNavItem,
                name: 'Add Product',
                to: '/products/add',
                icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
              },
            ]
          : []),
        ...(pages.includes('_products_list') || pages.includes('all')
          ? [
              {
                component: CNavItem,
                name: 'Products List',
                to: '/products/list/1',
                icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
              },
            ]
          : []),
        ...(pages.includes('_products_find') || pages.includes('all')
          ? [
              {
                component: CNavItem,
                name: 'Item Finder',
                to: '/products/find',
                icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
              },
            ]
          : []),
          ...(pages.includes('_products_find') || pages.includes('all')
          ? [
              {
                component: CNavItem,
                name: 'Print PDF',
                to: '/products/category/pdf',
                icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
              },
            ]
          : []),
      ],
    },
  ]: []
  ),

  
  ...((pages.includes('category') || pages.includes('all')) ? [
    {
      component: CNavGroup,
      name: 'Category',
      items: [
        ...((pages.includes('_category_list') || pages.includes('all')) ? [{
          component: CNavItem,
          name: 'List',
          to: '/category/list',
          icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
        }] : []), 
      ]
    }
  ]: []
  )
]

export default _nav
