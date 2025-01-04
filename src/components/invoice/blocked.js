import React, { useEffect, useReducer, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import moment from 'moment'
import axios from 'axios'
require('dotenv').config()

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import CIcon from '@coreui/icons-react'
import { cilPen, cilLocationPin, cilDelete } from '@coreui/icons'

import InvoiceDetailsModal from './detailsModel'
import UpdateForm from './invoiceupdateform'
import NoDataComponent from '../common/NoDataComponent'

const BlockedList = () => {
    const history = useHistory()
    const [drafts, setDrafts] = useState([])
    const [payments, setPayments] = useState([])

    const ACTIONS = {
        ADD_NEW: 'new',
        UPDATE_ADDRESS: 'address',
        RESET: 'reset',
    }

    const [showUpdateInvModel, setShowUpdateInvModel] = useState(() => false)
    const handleUClose = () => setShowUpdateInvModel(() => false)

    const reducer = (state, action) => {
        console.log(action)
        switch (action.type) {
            case ACTIONS.ADD_NEW: {
                let toaddress = action.payload.data.length
                    ? action.payload.data[0].to_name + ' - ' + action.payload.data[0].to_city
                    : ''


                return {
                    ...state,
                    inv: action.payload.inv,
                    to_details: toaddress,
                    toName: action.payload.data.length ? action.payload.data[0].to_name : '',
                    city: action.payload.data.length ? action.payload.data[0].to_city : '',
                    address: action.payload.data.length ? action.payload.data[0].to_address : '',
                    gst: action.payload.data.length ? action.payload.data[0].gst : '',
                    dated: action.payload.data.length ? action.payload.data[0].rents_start_on : '',
                    data: action.payload.data,
                    finalamount: action.payload.data.length ? action.payload.data[0].finalamount : '',
                    discount: action.payload.data.length ? action.payload.data[0].discount : '',
                    gstpercentage: action.payload.data.length ? action.payload.data[0].gstpercentage : '',
                    payableamount: action.payload.data.length ? action.payload.data[0].payableamount : '',
                    vendoraddress: action.payload.data.length ? action.payload.data[0].vendoraddress : ''
                }

            }

            case ACTIONS.UPDATE_ADDRESS: {
                return {
                    ...state,
                    toName: action.payload.toName,
                    city: action.payload.city,
                    address: action.payload.address,
                    gst: action.payload.gst,
                }
            }

            case ACTIONS.RESET: {
                return {
                    ...state,
                    inv: '',
                    to_details: '',
                    toName: '',
                    city: '',
                    address: '',
                    gst: '',
                    dated: '',
                    finalamount: 0,
                    discount: 0,
                    gstpercentage: 0,
                    data: [],
                }
            }
        }
    }

    const [invoiceData, dispatch] = useReducer(reducer, {
        inv: '',
        to_details: '',
        toName: '',
        city: '',
        address: '',
        status: '',
        payment: '',
        dated: '',
        finalamount: 0,
        discount: 0,
        gstpercentage: 0,
        totalCost: 0,
        data: [],
    })

    const [show, setShow] = useState(() => false)
    const handleClose = () => setShow(() => false)
    const handleShow = () => setShow(() => true)

    const [addressInv, setAddressInv] = useState(() => '')
    const [toName, setToName] = useState(() => '')
    const [toCity, setToCity] = useState(() => '')
    const [toAddress, setToAddress] = useState(() => '')
    const [gst, setGST] = useState(() => 0)
    const [markASInvoice, setMarkAsInvoice] = useState(() => false)
    const [isList, setisList] = useState(() => false)

    const createDraft = () => {
        history.push('/invoice/draft')
    }

    const getDraftInvoices = async () => {
        const results = await axios.get(`${process.env.REACT_APP_API_URL}/invoice/blocked`, {
            params: { page: 1 },
        })
        return results
    }

    const getDetail = (invoice) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${invoice}/details`)
            .then(async (response) => {
                dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: invoice } })
                handleShow()
            })
    }

    const getDrafts = () => {
        getDraftInvoices().then((results) => {
            setDrafts(results.data)
        })
    }

    useEffect(() => {
        getDrafts()
    }, [])

    const markInvoice = () => {
        if (invoiceDetails.toName == null || invoiceDetails.toName == '') {
            setAddressInv((old) => invoiceDetails.inv)
            setToName((oldValue) => '')
            setToCity((oldValue) => '')
            setToAddress((oldValue) => '')
            setGST((oldValue) => '')
            setShowAddressForm(true)
            setMarkAsInvoice((oldV) => true)
            handleClose()
        } else {
            continueMarkAsInvoice(invoiceDetails.inv)
        }
    }

    const continueMarkAsInvoice = (id) => {
        axios.post(`${process.env.REACT_APP_API_URL}/invoice/mark/${id}`).then(async (response) => {
            getDrafts()
            handleClose()
            setMarkAsInvoice((oldV) => false)
            dispatch({ type: ACTIONS.RESET })
        })
    }

    const addAddressToInv = (e) => {
        e.preventDefault()

        let p = {
            toName: toName,
            city: toCity,
            address: toAddress,
            gst: gst,
        }

        axios
            .post(`${process.env.REACT_APP_API_URL}/invoice/${addressInv}/address`, p)
            .then(async (response) => {
                markASInvoice ? continueMarkAsInvoice(addressInv) : getDrafts()
                setShowAddressForm(false)
            })
    }

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
                    getDrafts()
                })
        }
    }

    const showList = v => {
        setisList(() => v)
    }

    const showListed = () => { return (<div>List will be shown..</div>) }

    const showInvoice = () => {
        return (
            <table className="table table-stripped">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Quotation Number</th>
                        <th>Quoted To</th>
                        <th>Contact</th>
                        <th className="money">Products</th>
                        <th className="money">Cost</th>
                        <th className="money">From</th>
                        <th className="money">To</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        drafts.length ?
                            drafts.map((inv, index) => (
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
                                    <td className="money">{inv.payableamount}</td>
                                    <td className="money">
                                        {moment.utc(inv.startDate).format('ddd - MMM Do, YYYY')}
                                    </td>
                                    <td className="money">
                                        {moment.utc(inv.endDate).format('ddd - MMM Do, YYYY')}
                                    </td>
                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="button-tooltip-2">
                                                    Edit Items
                                                </Tooltip>
                                            }
                                        >
                                            <Link to="/invoice/updatedraft" path="/invoice/updatedraft" onClick={() => updateInvoice(inv.invoice)}>
                                                <CIcon icon={cilPen} className="cricon" />
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
                                                <CIcon icon={cilDelete}
                                                    onClick={() => deleteInvoice(inv.invoice)}
                                                    className="cricon" />
                                            </Link>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))
                            : <tr><td colSpan="9"><NoDataComponent /></td></tr>
                    }
                </tbody>
            </table>
        )
    }

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <CRow className="align-middle p-2">
                                <div className="col-sm-10">
                                    <h4>Quotation List</h4>
                                </div>
                                <div className="col-sm-2">
                                    <input type="checkbox" name="showitems"
                                        checked={isList}
                                        onChange={(event) => showList(event.target.checked)} />
                                    Show Items
                                </div>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            {
                                isList ? showListed() : showInvoice()
                            }
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <div>
                <CRow>
                    <CCol xs={12}>
                        <div className="col-sm-12">
                            {invoiceData.data[0] != undefined ? (
                                <InvoiceDetailsModal
                                    invoice={invoiceData}
                                    payments={payments}
                                    show={show}
                                    handleClose={handleClose}
                                    isInvoice={false}
                                    isPaid={false}
                                    cb={getDrafts}
                                    isQuote={true}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </CCol>
                </CRow>
            </div>

            <div className="row">
                {showUpdateInvModel ? (
                    <>
                        {invoiceData.data[0] != undefined ? (
                            <UpdateForm
                                invoice={invoiceData}
                                show={showUpdateInvModel}
                                handleClose={handleUClose}
                                isInvoice={false}
                                isPaid={false}
                                cb={getDrafts}
                            />
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default BlockedList
