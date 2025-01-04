import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const qrscanner = React.lazy(() => import('./components/invoice/scanner'))

// Products
const Products = React.lazy(() => import('./components/product/Products'))
const AddProduct = React.lazy(() => import('./components/product/addProduct'))
const EditProduct = React.lazy(() => import('./components/product/editProduct'))
const PrintPR = React.lazy(() => import('./components/product/printPR'))
const ProductsPrint = React.lazy(() => import('./components/product/print'))
const ItemFinder = React.lazy(() => import('./components/product/finder'))
const addCategory = React.lazy(() => import('./components/category/addCategory'))
const CategoryListPDF = React.lazy(() => import('./components/product/catPdf'))
const Categories = React.lazy(() => import('./components/category/list'))
const DraftInvoice = React.lazy(() => import('./components/invoice/draftinvoice'))
const UpdateDraftInvoice = React.lazy(() => import('./components/invoice/updatedraftinvoice'))
const DraftList = React.lazy(() => import('./components/invoice/draft'))
const Invoices = React.lazy(() => import('./components/invoice/list'))
const PaidInvoices = React.lazy(() => import('./components/invoice/paidinvoices'))
const PrintedInvoices = React.lazy(() => import('./components/invoice/printedinvoices'))

const ReturnInvoice = React.lazy(() => import('./components/returns/returnInvoice'))
const PendingInvoice = React.lazy(() => import('./components/returns/pendingInvoice'))

const ReturnList = React.lazy(() => import('./components/returns/recievelist'))
const ReturnDamaged = React.lazy(() => import('./components/returns/damagelist'))

const BlockedInvoice = React.lazy(() => import('./components/invoice/blocked'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  // invoices
  { path: '/scanner', name: 'Scanner', component: qrscanner },
  { path: '/invoice/booked', name: 'Booked Invoice', component: BlockedInvoice },
  { path: '/invoice/draft', name: 'Rent Product', component: DraftInvoice },
  { path: '/invoice/updatedraft', name: 'Rent Product', component: UpdateDraftInvoice },
  { path: '/invoice/quotation', name: 'Rent Product', component: DraftList },
  { path: '/invoice/list', name: 'Rent Product', component: Invoices },
  { path: '/invoice/paid', name: 'Rent Product', component: PaidInvoices },
  { path: '/invoice/printed', name: 'Rent Product', component: PrintedInvoices },

  // returns invoices.

  { path: '/returns/', name: 'Return Invoice', exact: true, component: ReturnInvoice },
  { path: '/returns/pending', name: 'Pending Invoice', exact: true, component: PendingInvoice },
  { path: '/returns/list/', name: 'Return Invoice', exact: true, component: ReturnList },
  { path: '/returns/damaged/', name: 'Return Invoice', exact: true, component: ReturnDamaged },

  // products
  // { path: '/products/:p', exact: true, name: 'Products', component: Products },
  { path: '/products/:id/edit/:p', exact: true, name: 'Edit Product', component: EditProduct },
  { path: '/products/:id/edit/:p/:s', exact: true, name: 'Edit Product', component: EditProduct },
  { path: '/products/list/:p', exact: true, name: 'List', component: Products },
  { path: '/products/list/:p/:s', exact: true, name: 'List', component: Products },
  { path: '/products/add', exact: true, name: 'Add', component: AddProduct },
  { path: '/products/print', exact: true, name: 'Print', component: ProductsPrint },
  { path: '/products/find', exact: true, name: 'Find', component: ItemFinder },
  { path: '/products/:id', exact: true, name: 'Print', component: PrintPR },

  { path: '/category/list', exact: true, name: 'Category', component: Categories },
  { path: '/category/add', exact: true, name: 'Add Category', component: addCategory },
  { path: '/products/category/pdf', exact: true, name: 'Print PDF', component: CategoryListPDF },
]

export default routes
