import React, { Component, useState } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const PrintPreview = React.lazy(() => import('./components/product/preview'))
const FinalPrint = React.lazy(() => import('./components/invoice/finalprint'))
const InvoicePrint = React.lazy(() => import('./components/invoice/invoiceprint'))
const ReturnPrint = React.lazy(() => import('./components/returns/invoicePrint'))
const ImagePrint = React.lazy(() => import('./components/invoice/imageprint'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

function App() {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <HashRouter>
      <React.Suspense fallback={loading}>
        <Login />
      </React.Suspense>
    </HashRouter>
  }

  return (
    <>
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route
              exact
              path="/products/print/preview"
              name="Print Preview"
              render={(props) => <PrintPreview {...props} />}
            />

            <Route
              exact
              path='/invoice/print/:id'
              name="Print Final Invoice "
              render={(props) => <FinalPrint {...props} />}
            />

            <Route
              exact
              path='/invoice/received/:id/:type'
              name="Print Final Invoice"
              render={(props) => <ReturnPrint {...props} />}
            />

            <Route
              exact
              path='/invoice/internalprint/:id'
              name="Print Final Invoice "
              render={(props) => <InvoicePrint {...props} />}
            />

            <Route
              exact
              path='/invoice/imageprint/:id'
              name="Print Final Invoice "
              render={(props) => <ImagePrint {...props} />}
            />

            <Route
              exact
              path='/invoice/imageprint/:id/:type'
              name="Print Final Invoice "
              render={(props) => <ImagePrint {...props} />}
            />



            <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    </>
  )
}

export default App
