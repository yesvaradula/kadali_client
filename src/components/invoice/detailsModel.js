import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'
import axios from 'axios'
import logo from '../../../src/assets/images/logo.png'

const INVOICE_PENDING = 1
const INVOICE_ACCEPTED = 2
const INVOICE_REJECTED = 3

const ACTIONS = {
  ADD_NEW: 'new',
  UPDATE_ADDRESS: 'address',
  RESET: 'reset',
}

const PAY_TYPE = [
  { id: 4, value: 'Advance Payment' },
  { id: 3, value: 'Partial Payment' },
  { id: 2, value: 'Full Payment' },
]

const PAY_METHOD = ['Google Pay', 'Paytm', 'PhonePe', 'Internet Banking', 'Cheque', 'Cash']

const InvoiceDetailsModal = ({ invoice, payments, show, handleClose, isInvoice, isPaid, cb, isfinder = false, isQuote = false }) => {

  const [modalInvoice, setModalInvoice] = useState(() => invoice)
  modalInvoice.inv = invoice.inv
  modalInvoice.data = invoice.data;
  const [invoiceId, setInvoiceId] = useState(() => invoice.inv)
  const [fm, setfm] = useState(() => invoice.finalamount)
  const [pm, setpm] = useState(() => invoice.payableamount)
  const [tm, settm] = useState(() => invoice.data.reduce((a, b) => a + b.cost, 0).toFixed(2))
  const [modalData, setModalData] = useState(() => invoice.data)

  useEffect(() => {
    setModalData((old) => invoice.data)
    setpm((old) => invoice.payableamount)
    settm((old) => invoice.data.reduce((a, b) => a + b.cost, 0).toFixed(2))
  }, [invoice.inv])

  const invoiceData = invoice.data[0]
  const logoSize = {
    height: 120,
    width: 350,
  }

  const [showPaymentModel, setShowPM] = useState(() => false)
  const [advancePay, setAdvancePay] = useState(() => 0)
  const [chequeNo, setChequeNo] = useState(() => '')
  const [bank, setBank] = useState(() => '')
  const [transactionId, setTransactionId] = useState(() => '')
  const [paymentMethod, setPaymentMethod] = useState(() => '')
  const [paymenttype, setPaymentType] = useState(() => '')

  const removeItemFromInvoice = async (id, code, cost) => {
    let response = await axios.delete(`${process.env.REACT_APP_API_URL}/invoice/${id}/${code}/${cost}`);
    setModalInvoice((oldDate) => (
      {
        ...oldDate,
        finalamount: response.data[0].finalamount,
        payableamount: response.data[0].payableamount,
        totalCost: response.data[0].totalCost,
        data: response.data
      }))
    setpm((old) => response.data[0].payableamount)
    settm((old) => response.data.reduce((a, b) => a + b.cost, 0).toFixed(2))
    setModalData((old) => response.data)
    cb()
  }

  const addMorePayments = () => {
    setShowPM((oldV) => true)
  }

  const makePayment = () => {
    let payLoad = {
      method: paymentMethod,
      payment_type: paymenttype,
      amt: advancePay,
      chequeno: chequeNo,
      bank: bank,
      transId: transactionId,
      invoice_id: modalInvoice.inv,
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/invoice/payment/${invoice.inv}`, payLoad)
      .then(async (response) => {
        if (!isInvoice) {
          // mark it as invoice.
          axios
            .post(`${process.env.REACT_APP_API_URL}/invoice/mark/${invoice.inv}`)
            .then(async (res) => { })
        }

        // 2 is FULL PAYMENT if payment is made.
        if (paymenttype == 2) {
          axios
            .post(`${process.env.REACT_APP_API_URL}/invoice/markpaid/${invoice.inv}`)
            .then(async (res) => { })
        }

        setShowPM((oldV) => false)
        setTransactionId('')
        setPaymentType('')
        setPaymentMethod('')
        cb()
        handleClose()
      })
  }

  const markStatusChange = (status) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/invoice/${invoice.inv}/mark/${status}`)
      .then(async (res) => {
        cb()
        handleClose()
      })
  }

  const displayItems = (items) => {

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th width="4%">Image</th>
            <th width="10%">Code</th>
            <th width="25%">Name</th>
            <th width="5%">Qty</th>
            <th width="10%">From</th>
            <th width="10%">To</th>
            <th width="2%">Days</th>
            <th width="10%" className="money">Hire Cost</th>
            {
              (!isfinder && !isPaid) ? <th width="5%">Actions</th> : <></>
            }
          </tr>
        </thead>
        <tbody>
          {

            items.map((p) => (
              <tr key={p.product_code}>
                <td>
                  <img src={p.product_image} width="30" height="30" />
                </td>
                <td>{p.product_code}</td>
                <td>{p.product_name}</td>
                <td>{p.quantity}</td>
                <td>{moment.utc(p.pStartDate).format('DD/MM/yyyy')}</td>
                <td>{moment.utc(p.pEndDate).format('DD/MM/yyyy')}</td>
                <td className="money">{p.rent_days}</td>
                <td className="money">{p.cost.toFixed(2)}</td>
                {
                  // TODO: remove below td.
                }
                <td>-</td>
                {
                  /*
                  (!isfinder && !isPaid) ?
                  <td><button
                    className="btn btn-secondary"
                    onClick={() => removeItemFromInvoice(modalInvoice.inv, p.product_code, p.cost.toFixed(2))}
                  >
                    Remove
                  </button></td> :
                  <></>
                  */
                }

              </tr>
            ))

          }
        </tbody>
      </table>
    )
  }

  const printThisInvoice = (invoice) => {
    // console.log(invoice)
    const win = window.open(`#/invoice/internalprint/${invoice}`, "_blank");
    win.focus();
  }

  const printImages = (invoice) => {
    const win = window.open(`#/invoice/imageprint/${invoice}`, "_blank");
    win.focus();
  }

  const returnFun = () => {
    return (
      <>
        <Modal show={show} onHide={handleClose} size="xl">
          <Modal.Header className="logo-color logo">
            <div className="row">
              <div className="col-8 logo-color columnLeft">
                <img src={logo} style={logoSize} />
              </div>
              <div className="col-2 printRight">
                <button
                  className="btn btn-primary"
                  onClick={() => printThisInvoice(invoice.inv)}
                >
                  Print
                </button>
              </div>
              <div className="col-2 printRight">
                <button
                  className="btn btn-primary"
                  onClick={() => printImages(invoice.inv)}
                >
                  Image Print
                </button>
              </div>
            </div>

          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="lh-3 row mt-1">
                <div className="col-sm-4">
                  <strong>{payments.length ? 'Invoice' : 'Quotation'} Number:</strong>&nbsp;&nbsp;
                  {invoice.inv}
                </div>
                <div className="col-sm-4">
                  <strong>From:</strong>&nbsp;&nbsp;
                  {moment.utc(invoiceData.startDate).format('dddd - MMM Do, YYYY')}
                </div>
                <div className="col-sm-4">
                  <strong>To:</strong>&nbsp;&nbsp;
                  {moment.utc(invoiceData.endDate).format('dddd - MMM Do, YYYY')}
                </div>
              </div>
              <div>
                <div className="lh-3 row mt-4">
                  <div className="col-sm-6">
                    <strong>M/s</strong>&nbsp;&nbsp;
                    <span className="border-bottom">{invoiceData.to_name ? invoiceData.to_name : ''}</span>
                  </div>

                  <div className="col-sm-6">
                    <strong>Location</strong>&nbsp;&nbsp;
                    <span className="border-bottom">{invoiceData.to_address}</span>
                  </div>
                </div>

                <div className="lh-3 row mt-4">
                  <div className="col-sm-4">
                    <strong>Art Director</strong>&nbsp;&nbsp;
                    <span className="border-bottom">{invoiceData.art_director_name}</span>
                  </div>
                  <div className="col-sm-4">
                    <strong>Hero/Director</strong>&nbsp;&nbsp;
                    <span className="border-bottom">{invoiceData.name}({invoiceData.herodirector})</span>
                  </div>
                  <div className="col-sm-3">
                    <strong>Content Type</strong>&nbsp;&nbsp;
                    <span className="border-bottom">{invoiceData.content_type}</span>
                  </div>
                </div>
                <div className="lh-3 row mt-4">
                  <div className="col-sm-6">
                    <strong>Contact Name / Phone</strong>&nbsp;&nbsp;
                    <span className="border-bottom">
                      {invoiceData.contactName} / {invoiceData.contactPhone}
                    </span>
                  </div>
                  <div className="col-sm-6">
                    <strong>Received By / Phone</strong>&nbsp;&nbsp;
                    <span className="border-bottom">
                      {invoiceData.prop_receiver_name}({invoiceData.prop_receiver}) / {invoiceData.art_phone}
                    </span>
                  </div>
                </div>

                <div className="row mt-5">
                  {displayItems(modalData)}
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td className="">
                          <strong>Cost&nbsp;:&nbsp;</strong>
                          {tm}
                          {/* {invoice.data.reduce((a, b) => a + b.cost, 0).toFixed(2)} */}
                        </td>
                        <td className="">
                          <strong>Discount&nbsp;:&nbsp;</strong>
                          {invoice.discount} %
                        </td>
                        <td className="">
                          <strong>GST&nbsp;:&nbsp;</strong>
                          {invoice.gstpercentage} %
                        </td>
                        <td className="money">
                          <strong>Payable Amount</strong>
                        </td>
                        <td className="money">{pm}</td>
                        {/* <td>&nbsp;</td> */}
                      </tr>
                      {!isfinder && isInvoice ? (
                        <>
                          <tr>
                            <td className="money" colSpan={4}>
                              <strong>Total Paid till now</strong>
                            </td>
                            <td className="money">{payments.reduce((a, b) => a + b.amount, 0).toFixed(2)}</td>

                          </tr>
                          <tr>
                            <td className="money" colSpan={4}>
                              <strong>Remaining / Refund</strong>
                            </td>
                            <td className="money">
                              {(pm -
                                payments.reduce((a, b) => a + b.amount, 0)).toFixed(2)}
                            </td>
                            {/* <td>&nbsp;</td> */}
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>

                {!isfinder && isInvoice ? (
                  <div className="row mt-5">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>Payment Type</th>
                          <th>Payment Method</th>
                          <th>Transaction Id</th>
                          <th>Amount</th>
                          <th>Paid On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{p.paidby}</td>
                            <td>
                              {p.method}
                              {p.method == 'cheque' ? (
                                <span>
                                  &nbsp; / {p.cheque_no} / {p.bank}{' '}
                                </span>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>{p.transaction_id}</td>
                            <td>{p.amount}</td>
                            <td>{moment.utc(p.paid_on).format('DD/MM/yyyy')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!isfinder && isInvoice && !isPaid ? (
              <>
                {modalInvoice.data !== undefined && modalInvoice.data.length > 0 ? (
                  <>
                    {modalInvoice.data[0].invoice_status == INVOICE_ACCEPTED ||
                      modalInvoice.data[0].invoice_status == INVOICE_PENDING ? (
                      <button
                        className="btn btn-secondary"
                        onClick={() => markStatusChange('rejected')}
                      >
                        Mark As Rejectd Invoice
                      </button>
                    ) : (
                      <></>
                    )}

                    {modalInvoice.data[0].invoice_status == INVOICE_REJECTED ||
                      modalInvoice.data[0].invoice_status == INVOICE_PENDING ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => markStatusChange('accepted')}
                      >
                        Mark As Accepted Invoice
                      </button>
                    ) : (
                      <></>
                    )}

                    {modalInvoice.data[0].invoice_status == INVOICE_ACCEPTED ? (
                      <button className="btn btn-primary" onClick={() => addMorePayments()}>
                        Add More Payments
                      </button>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {!isfinder && !isInvoice && !isPaid ? (
              <>
                <button className="btn btn-primary" onClick={() => addMorePayments()}>
                  Mark As Invoice
                </button>
              </>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>

        {/* Payment Model Start */}
        <Modal
          className=""
          show={showPaymentModel}
          onHide={() => setShowPM((oldv) => false)}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Payment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <fieldset>
              <legend>Payment Details</legend>
              <div className="row mt-2">
                <div className="col">
                  <select onChange={(e) => setPaymentMethod(e.target.value)} className="form-control">
                    <option value="">Select Method</option>
                    {PAY_METHOD.map((i) => (
                      <option value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select onChange={(e) => setPaymentType(e.target.value)} className="form-control">
                    <option value="">Select Type</option>
                    {PAY_TYPE.map((i) => (
                      <option value={i.id}>{i.value}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <input
                    value={advancePay}
                    type="text"
                    onChange={(e) => setAdvancePay(e.target.value)}
                    className="form-control"
                    placeholder="Amount"
                  />
                </div>
                {paymentMethod === 'Cheque' ? (
                  <div className="col">
                    <input
                      value={chequeNo}
                      type="text"
                      onChange={(e) => setChequeNo(e.target.value)}
                      className="form-control"
                      placeholder="Cheque No"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {paymentMethod === 'Cheque' ? (
                <div className="row mt-2">
                  <div className="col">
                    <input
                      value={bank}
                      type="text"
                      onChange={(e) => setBank(e.target.value)}
                      className="form-control"
                      placeholder="Enter Bank Details - Name, Branch"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="row mt-2">
                {paymentMethod !== 'cheque' ? (
                  <div className="col">
                    <input
                      value={transactionId}
                      type="text"
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="form-control"
                      placeholder="Transaction Id"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </fieldset>
            <div>&nbsp;</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={makePayment}>
              Make Payment
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  return (
    returnFun()
    // setTimeout(() => { return returnFun() }, 3000)
  )
}

export default InvoiceDetailsModal
