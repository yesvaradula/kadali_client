import React, { useEffect, useReducer, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import moment from 'moment'
import axios from 'axios'
require('dotenv').config()
import Modal from 'react-bootstrap/Modal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import CIcon from '@coreui/icons-react'
import { cilPen, cilLocationPin, cilControl, cilDelete } from '@coreui/icons'
import InvoiceDetailsModal from './detailsModel'
import UpdateForm from './invoiceupdateform'
import NoDataComponent from '../common/NoDataComponent'

const Invoices = () => {
  const [invoiceList, setInvoiceList] = useState(() => [])
  const [payMethod, setPayMethod] = useState(() => '')
  const [transactionId, setTransactionId] = useState(() => '')
  const [payments, setPayments] = useState([])

  const [showUpdateInvModel, setShowUpdateInvModel] = useState(() => false)
  const handleUpdClose = () => setShowUpdateInvModel(() => false)

  const [updateInv, setUpdatedInv] = useState({
    toName: '',
    companyPhone: '',
    toAddress: '',
    contactPhone: '',
    contactName: '',
    artDirector: '',
    artPhone: '',
    contentType: '',
    propReceiver: '',
    gst: '',
    showAddressForm: false,
    startDate: new Date(),
    endDate: new Date(),
    totalCost: 0,
    initialDays: 1,
    advancePay: '',
    chequeNo: '',
    bank: '',
    transactionId: '',
    discount: '',
    invoiceAmount: '',
    gstpercentage: '',
    finalamount: 0,
    paymentMethod: '',
    isWhatName: '',
    isWhat: '',
  })

  const [show, setShow] = useState(() => false)
  const handleClose = () => setShow(() => false)
  const handleShow = () => setShow(() => true)

  const [showPF, setShowPF] = useState(() => false)
  const openPForm = () => setShowPF(true)
  const closePForm = () => setShowPF(false)

  const INVOICE_PENDING = 1
  const INVOICE_ACCEPTED = 2
  const INVOICE_REJECTED = 3

  const ACTIONS = {
    ADD_NEW: 'new',
    UPDATE_ADDRESS: 'address',
    RESET: 'reset',
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.ADD_NEW: {
        let toaddress = action.payload.data[0].to_name
          ? action.payload.data[0].to_name + ' - ' + action.payload.data[0].to_city
          : ''

        return {
          ...state,
          inv: action.payload.inv,
          to_details: toaddress,
          toName: action.payload.data[0].to_name,
          city: action.payload.data[0].to_city,
          address: action.payload.data[0].to_address,
          gst: action.payload.gst,
          dated: action.payload.data[0].rents_start_on,
          data: action.payload.data,
          status: action.payload.data[0].is_value,
          payment: action.payload.data[0].ip_value,
          finalamount: action.payload.data[0].finalamount,
          discount: action.payload.data[0].discount,
          gstpercentage: action.payload.data[0].gstpercentage,
          payableamount: action.payload.data[0].payableamount,
          vendoraddress: action.payload.data[0].vendoraddress
        }
      }
    }
  }

  const [invoiceDetails, dispatch] = useReducer(reducer, {
    inv: '',
    to_details: '',
    toName: '',
    city: '',
    address: '',
    status: '',
    payment: '',
    gst: '',
    dated: '',
    finalamount: 0,
    discount: 0,
    gstpercentage: 0,
    data: [],
  })

  const getDetail = (invoice) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/invoice/${invoice}/payments`)
      .then(async (response) => {
        setPayments(response.data)
      })
    axios
      .get(`${process.env.REACT_APP_API_URL}/invoice/${invoice}/details`)
      .then(async (response) => {
        console.log("response", response)
        dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: invoice } })
        handleShow()
      })
  }

  const getInvoices = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/invoice/list`, {
      params: { page: 1 },
    })
  }

  const getInvoiceList = () => {
    getInvoices().then((results) => {
      console.log(results)
      setInvoiceList(results.data)
    })
  }

  const markStatusChange = (as) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/invoice/${invoiceDetails.inv}/mark/${as}`)
      .then(async (response) => {
        getInvoiceList()
        handleClose()
      })
  }

  const openPaymentForm = () => {
    handleClose()
    openPForm()
  }

  const addPayment = (e) => {
    e.preventDefault()

    let payload = {
      payMethod: payMethod,
      transId: transactionId,
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/invoice/payment/${invoiceDetails.inv}`, payload)
      .then(async (response) => {
        getInvoiceList()
        closePForm()
      })
  }

  useEffect(() => {
    getInvoiceList()
  }, [])

  const updateInvoice = (id) => {

    axios
      .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/details`)
      .then(async (response) => {
        dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: id } })
        setShowUpdateInvModel(() => true)
      })
  }

  const deleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice ?')) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/invoice/${id}/delete`)
        .then(async (response) => {
          getInvoiceList()
        })
    }
  }

  return (
    <>
      <div className="row">
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-middle p-2">
              <div className="col-sm-10">
                <h4>Invoice List</h4>
              </div>
            </CRow>
          </CCardHeader>

          <table className="table table-stripped">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Invoice Number</th>
                <th>Quoted To</th>
                {/* <th>Contact</th> */}
                <th className="money">Products</th>
                <th className="money">Cost</th>
                <th className="money">Picked</th>
                <th className="money">From</th>
                <th className="money">To</th>
                <th className="money">Payment Status</th>
                <th className="money">Invoice Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                invoiceList.length ?
                  invoiceList.map((inv, index) => (
                    <tr key={inv.invoice}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to="#" path="#" onClick={() => getDetail(inv.invoice)}>
                          {inv.invoice}
                        </Link>
                      </td>
                      <td>{inv.to_name}</td>
                      {/* <td>
                      {inv.contactName} - {inv.contactPhone}
                    </td> */}
                      <td className="money">{inv.totalProducts}</td>
                      <td className="money">{inv.payableamount}</td>
                      <td className="money">
                        {moment.utc(inv.pickupDate).format('ddd - MMM Do, YYYY')}
                      </td>
                      <td className="money">
                        {moment.utc(inv.CreatedOn).format('ddd - MMM Do, YYYY')}
                      </td>
                      <td className="money">{moment.utc(inv.endDate).format('ddd - MMM Do, YYYY')}</td>
                      <td className="money">{inv.ip_value}</td>
                      <td className="money">{inv.is_value}</td>
                      <td>


                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              Update Invoice Products
                            </Tooltip>
                          }
                        >
                          <Link to="#" path="#" onClick={() => updateInvoice(inv.invoice)}>
                            <CIcon icon={cilControl} className="cricon" />
                          </Link>
                        </OverlayTrigger>
                        &nbsp;&nbsp;| &nbsp;&nbsp;

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip-2">
                              Update Invoice
                            </Tooltip>
                          }
                        >
                          <Link to="#" path="#" onClick={() => updateInvoice(inv.invoice)}>
                            <CIcon icon={cilPen} className="cricon" />
                          </Link>
                        </OverlayTrigger>
                        &nbsp;&nbsp;| &nbsp;&nbsp;
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="button-tooltip-2">Delete Invoice</Tooltip>}
                        >
                          <Link to="#" path="#">
                            <CIcon onClick={() => deleteInvoice(inv.invoice)}
                              icon={cilDelete} className="cricon" />
                          </Link>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                  : <tr><td colSpan="10"><NoDataComponent /></td></tr>
              }
            </tbody>
          </table>
        </CCard>
      </div>

      <div className="row">
        {showUpdateInvModel ? (
          <>
            {invoiceDetails.data[0] != undefined ? (
              <UpdateForm
                invoice={invoiceDetails}
                show={showUpdateInvModel}
                handleClose={handleUpdClose}
                isInvoice={true}
                isPaid={false}
                cb={getInvoiceList}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="row">
        {invoiceDetails.data[0] != undefined ? (
          <InvoiceDetailsModal
            invoice={invoiceDetails}
            payments={payments}
            show={show}
            handleClose={handleClose}
            isInvoice={true}
            isPaid={false}
            cb={getInvoiceList}
          />
        ) : (
          <></>
        )}
        <div className="row">
          <Modal show={showPF} onHide={closePForm} size="lg">
            <form method="post" onSubmit={addPayment}>
              <Modal.Header closeButton>
                <Modal.Title>Payment for invoice {invoiceDetails.inv}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div className="row">
                    <div className="col">
                      <select
                        required
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select</option>
                        <option value="Paytm">Paytm</option>
                      </select>
                    </div>
                    <div className="col">
                      <input
                        onChange={(e) => setTransactionId(e.target.value)}
                        type="text"
                        required
                        className="form-control"
                        placeholder="Transaction Id"
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button type="submit" class="btn btn-primary">
                    Mark Invoice Paid
                  </button>
                </div>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default Invoices
