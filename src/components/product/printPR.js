import React, { useEffect, useState } from 'react'

import QrCode from './QRCode'
import Barcode from 'react-barcode'
import { useHistory } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
  CRow,
} from '@coreui/react'

require('dotenv').config()

const printPR = (props) => {
  const history = useHistory()
  let [printingOptions, setPrintingOptions] = useState([])
  const [resultLoaded, setResultLoaded] = useState(false)
  const productId = props.match.params.id

  const [qrCode, setQRCode] = useState(true)
  const [barCode, setBarCode] = useState(true)
  let [arrChecked, setArrChecked] = useState([])

  let numofImages = 4

  useEffect(() => {
    if (resultLoaded === false) {
      setResultLoaded(true)
      singlePrintPage(productId)
    }
  })

  const setPrinting = (event) => {
    printingOptions[event.target.value] = event.target.checked ? true : false
    let newArr = { ...printingOptions }
    localStorage.setItem('printing_options', JSON.stringify(newArr))
  }

  const singlePrintPage = (k) => {
    let name = localStorage.getItem('print_name')
    let price = localStorage.getItem('print_price')
    arrChecked[k] = { code: k, doPrint: true, name: name, price: price }
    let newArr = { ...arrChecked }
    localStorage.setItem('print', '')
    localStorage.setItem('print', JSON.stringify(newArr))
  }

  const gotoPrintPage = () => {
    history.push('/products/print')
  }

  return (
    <>
      {/* <table className="table prlist">
        <thead>
          <tr>
            <td>
              <label>
                <input type="checkbox" onChange={(e) => setQRCode(!qrCode)} defaultChecked /> Print
                QR Code
              </label>
            </td>
            <td>
              <label>
                <input type="checkbox" onChange={(e) => setBarCode(!barCode)} defaultChecked />{' '}
                Print Bar Code
              </label>
            </td>
             
          <tr>
            <td colSpan="2">{qrCode ? <QrCode url={productId} /> : <></>}</td>
            <td colSpan="2">{barCode ? <Barcode value={productId} /> : <></>}</td>
          </tr>
        </thead>
      </table> */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Actions</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <div>
              <h6>Printing Options</h6>
            </div>

            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="logo" />
                &nbsp; Logo
              </label>
            </div>
            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="name" />
                &nbsp; Name
              </label>
            </div>
            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="code" />
                &nbsp; Code
              </label>
            </div>
            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="price" />
                &nbsp; Price
              </label>
            </div>
            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="bar" />
                &nbsp; Bar Code
              </label>
            </div>
            <div className="col-sm-1">
              <label>
                <input type="checkbox" onChange={setPrinting} value="qr" />
                &nbsp; QR Code
              </label>
            </div>
            <div className="col-sm-1">
              <CButton color="primary" type="button" onClick={gotoPrintPage}>
                Print Codes
              </CButton>
            </div>
          </CRow>
          <hr />
          <CRow>
            <div className="col-sm-2">{qrCode ? <QrCode url={productId} /> : <></>}</div>
            <div className="col-sm-2">{barCode ? <Barcode value={productId} /> : <></>}</div>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
export default printPR
