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
import { cilPen, cilFingerprint, cilDelete } from '@coreui/icons'
import InvoiceDetailsModal from './detailsModel'
import logo from '../../../src/assets/images/logo.png'
import NoDataComponent from '../common/NoDataComponent'

var converter = require('number-to-words');

const PrintedInvoices = () => {

    const camelCase = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        });
    }

    const inWords = (num) => {
        let n = num.split('.');
        let r = camelCase(converter.toWords(n[0]))
        let p = camelCase(converter.toWords(n[1]))
        r = r.charAt(0).toUpperCase() + r.slice(1);
        p = p.charAt(0).toUpperCase() + p.slice(1);
        return `${r} and ${p} Paise`;
    }

    const logoSize = {
        height: 120,
        width: 350,
    }

    const styles = {
        margin: 'none'
    }

    const history = useHistory()
    const [invoiceList, setInvoiceList] = useState(() => [])
    const [payMethod, setPayMethod] = useState(() => '')
    const [transactionId, setTransactionId] = useState(() => '')
    const [payments, setPayments] = useState([])

    const [show, setShow] = useState(() => false)
    const handleClose = () => setShow(() => false)
    const handleShow = () => setShow(() => true)

    const [showPF, setShowPF] = useState(() => false)
    const openPForm = () => setShowPF(true)
    const closePForm = () => setShowPF(false)
    const [showFI, setFI] = useState(() => false)

    const [sM, setSM] = useState(() => false)

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
                    gst: action.payload.data[0].gst,
                    dated: action.payload.data[0].rents_start_on,
                    data: action.payload.data,
                    status: action.payload.data[0].is_value,
                    payment: action.payload.data[0].ip_value,
                    discount: action.payload.data[0].discount,
                    gstpercentage: action.payload.data[0].gstpercentage,
                    payableamount: action.payload.data[0].payableamount,
                    vendoraddress: action.payload.data[0].vendoraddress,
                    finalamount: action.payload.data[0].finalamount,
                    payableamount: action.payload.data[0].payableamount
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
                dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: invoice } })
                handleShow()
            })
    }

    const getInvoices = async () => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/invoice/paid`, {
            params: { page: 1 },
        })
    }

    const getInvoiceList = () => {
        getInvoices().then((results) => {
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


    const chooseGST = id => {
        setSM(true)
        localStorage.setItem('finalInvoiceId', id)
    }

    const printFinalInvoice = () => {
        setSM(false)
        let id = localStorage.getItem('finalInvoiceId')
        // get the details of the invoice
        axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/payments`)
            .then(async (response) => {
                setPayments(response.data)
            })
        axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/details`)
            .then(async (response) => {
                dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: id } })
                setFI(true)
            })
    }

    const printThisInv = () => {
        let id = localStorage.getItem('finalInvoiceId')
        const win = window.open(`#/invoice/print/${id}`, "_blank");
        win.focus();
        // axios
        //     .post(`${process.env.REACT_APP_API_URL}/invoice/${id}/print`)
        //     .then(async (response) => {

        //     })
    }

    const selectGSTC = value => {
        localStorage.setItem('gst_check', value)
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
                                <th>Contact</th>
                                <th className="money">Products</th>
                                <th className="money">Cost</th>
                                <th className="money">From</th>
                                <th className="money">To</th>
                                <th className="money">Payment Status</th>
                                <th className="money">Invoice Status</th>
                                <th>Actions</th>
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
                                            <td>
                                                {inv.contactName} - {inv.contactPhone}
                                            </td>
                                            <td className="money">{inv.totalProducts}</td>
                                            <td className="money">{inv.totalCost.toFixed(2)}</td>
                                            <td className="money">
                                                {moment.utc(inv.startDate).format('ddd - MMM Do, YYYY')}
                                            </td>
                                            <td className="money">{moment.utc(inv.endDate).format('ddd - MMM Do, YYYY')}</td>
                                            <td className="money">{inv.ip_value}</td>
                                            <td className="money">{inv.is_value}</td>
                                            <td>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="button-tooltip-2">
                                                            Final Invoice details
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Link to="#" path="#" onClick={() => chooseGST(inv.invoice)}>
                                                        <CIcon icon={cilFingerprint} className="cricon" />
                                                    </Link>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="11"><NoDataComponent /></td></tr>
                            }
                        </tbody>
                    </table>
                </CCard>
            </div>

            <div className="row">
                {invoiceDetails.data[0] != undefined ? (
                    <InvoiceDetailsModal
                        invoice={invoiceDetails}
                        payments={payments}
                        show={show}
                        handleClose={handleClose}
                        isInvoice={true}
                        isPaid={true}
                        cb={getInvoiceList}
                    />
                ) : (
                    <></>
                )}

                <div className="row">
                    <Modal show={sM} onHide={() => setSM(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>GST Checks</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div><label><input onChange={() => selectGSTC('cgst')} type="radio" name="gstc" />&nbsp;&nbsp;CGST & SGST</label></div>
                            <div><label><input onClick={() => selectGSTC('igst')} type="radio" name="gstc" />&nbsp;&nbsp;IGST</label></div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary hideinprint"
                                onClick={() => printFinalInvoice()}
                            >Print</button>
                        </Modal.Footer>
                    </Modal>
                </div>

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

            <div className="row printdiv">
                {invoiceDetails.data[0] != undefined ? (
                    <Modal show={showFI} onHide={() => setFI(false)} size="xl">
                        <Modal.Header className="logo-color logo" closeButton>
                            <div className="logo-color" style={styles}>
                                <img src={logo} style={logoSize} />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="addressclass">
                                H.No: 3-517/1, ADITYA NAGAR, NEW HAFEEZPET, MEDCHAL MALKAJGIRI, HYDERABAD - 500049
                                <br />
                                Mobile: +91 8886112321, Mail ID: rightchoiceprops@gmail.com
                            </div>
                            <hr />
                            <div className="addressclass">
                                <h3>INVOICE DETAILS</h3>
                            </div>
                            <div>
                                <table className="addressTable">
                                    <tr>
                                        <td width="500">
                                            <div className="fbold">Right Choice</div>
                                            <div>H.No: 3-517/1,</div>
                                            <div>ADITYA NAGAR, NEW HAFEEZPET</div>
                                            <div>MEDCHAL MALKAJGIRI, </div>
                                            <div>HYDERABAD - 500049</div>
                                            <div>GTIN: 36ATUPK0654P2ZV</div>
                                        </td>
                                        <td>
                                            <div>Invoice Serial Number: 178</div>
                                            <div>Invoice date: 02, May, 2022</div>
                                            <div>Place of Supply: Hyderabad</div>
                                            <div>Description: Set Property Rent</div>
                                            <div>Terms of Payment: Immediate</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Details of receiver(billed to)</td>
                                        <td>Details of receiver(shipped to)</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="fbold">{invoiceDetails.toName}</div>
                                            <div className="">{invoiceDetails.vendoraddress}</div>
                                        </td>
                                        <td>
                                            <div className="fbold">{invoiceDetails.toName}</div>
                                            <div className="">{invoiceDetails.vendoraddress}</div>
                                        </td>
                                    </tr>
                                </table>
                                <table className="addressTable">
                                    <tr>
                                        <th>S.No</th>
                                        <th>Description</th>
                                        <th>HSN CODE</th>
                                        <th>TAXABLE VALUE</th>
                                        {
                                            localStorage.getItem('gst_check') === 'igst' ?
                                                <>
                                                    <th>IGST @ 18%</th>
                                                </>
                                                :
                                                <>
                                                    <th>CGST @ 9%</th>
                                                    <th>SGST @ 9%</th>
                                                </>
                                        }

                                        <th>TOTAL</th>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Set Property Rent</td>
                                        <td>00440076</td>
                                        <td>{((invoiceDetails.finalamount) / 1).toFixed(2)}</td>
                                        {
                                            localStorage.getItem('gst_check') === 'igst' ?
                                                <>
                                                    <td>{((invoiceDetails.payableamount - invoiceDetails.finalamount)).toFixed(2)}</td>
                                                </>
                                                :
                                                <>
                                                    <td>{((invoiceDetails.payableamount - invoiceDetails.finalamount) / 2).toFixed(2)}</td>
                                                    <td>{((invoiceDetails.payableamount - invoiceDetails.finalamount) / 2).toFixed(2)}</td>
                                                </>
                                        }

                                        <td>{(invoiceDetails.payableamount / 1).toFixed(2)}</td>
                                    </tr>
                                </table>
                                <table className="addressTable">
                                    <tr>
                                        <td>
                                            <span className="fbold">Rupees:</span>
                                            &nbsp;&nbsp; {inWords((invoiceDetails.payableamount / 1).toFixed(2))}
                                        </td>
                                        <td>
                                            <table className="addressTable">
                                                <tr>
                                                    <td className="fbold">Taxable Value</td>
                                                    <td className="fbold">{((invoiceDetails.finalamount) / 1).toFixed(2)}</td>
                                                </tr>

                                                {
                                                    localStorage.getItem('gst_check') === 'igst' ?
                                                        <>
                                                            <tr>
                                                                <td className="fbold">IGST @ 18%</td>
                                                                <td className="fbold">{((invoiceDetails.payableamount - invoiceDetails.finalamount)).toFixed(2)}</td>
                                                            </tr>
                                                        </> :
                                                        <>
                                                            <tr>
                                                                <td className="fbold">CGST @ 9%</td>
                                                                <td className="fbold">{((invoiceDetails.payableamount - invoiceDetails.finalamount) / 2).toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="fbold">SGST @ 9%</td>
                                                                <td className="fbold">{((invoiceDetails.payableamount - invoiceDetails.finalamount) / 2).toFixed(2)}</td>
                                                            </tr>
                                                        </>
                                                }


                                                <tr>
                                                    <td className="fbold">Total</td>
                                                    <td className="fbold">{(invoiceDetails.payableamount / 1).toFixed(2)}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table className="addressTable">
                                    <tr>
                                        <td width="500">
                                            <div>Remarks: Set Property Rent From</div>
                                            <div className="fbold">M/s. {invoiceDetails.toName}</div>
                                            <br />
                                            <div className="fitalic">All trasactions are subjected to Telangana Jurisdiction under GST ACT</div>
                                        </td>
                                        <td>

                                            <div className="fbold">Right Choice</div>
                                            <br /><br />
                                            <div className="fbold">Authority Signature</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary hideinprint"
                                onClick={() => printThisInv()}
                            >Print</button>
                        </Modal.Footer>
                    </Modal>
                ) : <></>}
            </div>
        </>
    )
}



export default PrintedInvoices
