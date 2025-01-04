import React, { useEffect, useReducer, useState } from 'react'
import moment from 'moment'
import { useHistory, Link } from 'react-router-dom'
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

import InvoiceDetailsModal from '../invoice/detailsModel'

import axios from 'axios'
require('dotenv').config()

const ItemFinder = (props) => {

    const ACTIONS = {
        ADD_NEW: 'new',
        UPDATE_ADDRESS: 'address',
        RESET: 'reset',
    }

    const [show, setShow] = useState(() => false)
    const handleClose = () => setShow(() => false)
    const handleShow = () => setShow(() => true)
    const [payments, setPayments] = useState([])

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

    let [searchTerm, setSearchTerm] = useState(() => '')
    let [searchR, setSearchR] = useState(() => [])
    const [searched, setSearched] = useState(() => false)

    const changeTerm = (event) => {
        setSearchTerm(event.target.value)
    }

    const clearSearch = () => {
        setSearchTerm('')
        setSearched(() => false)
        setSearchR(() => [])
    }

    const getItem = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/items/find/${searchTerm}`).then((response) => {

            setSearchR(() => response.data)
            setSearched(() => true)
        })
    }

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

    const results = () => {
        return (

            <CCard className="mb-4">
                <CCardHeader>
                    Search Results
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        {
                            searched ?
                                searchR.length ?
                                    <>
                                        <table className="table prlist">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Name</th>
                                                    <th>Invoice Number</th>
                                                    <th>Given To</th>
                                                    <th>Company</th>
                                                    <th>Content</th>
                                                    <th>Sent On</th>
                                                    <th>Expected On</th>
                                                    <th>Where</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    searchR.map(i => (
                                                        <tr>
                                                            <td>{i.code}</td>
                                                            <td>{i.name}</td>
                                                            <td>
                                                                <Link to="#" path="#"
                                                                    onClick={() => getDetail(i.invoice_id)}>
                                                                    {i.invoice_id}
                                                                </Link>
                                                            </td>
                                                            <td>{i.prop_receiver_name}</td>
                                                            <td>{i.to_name}</td>
                                                            <td>{i.content_type}</td>
                                                            <td>
                                                                {moment.utc(i.startDate).format('ddd - MMM Do, YYYY')}
                                                            </td>
                                                            <td>
                                                                {moment.utc(i.endDate).format('ddd - MMM Do, YYYY')}
                                                            </td>
                                                            <td>
                                                                {
                                                                    (i.isBlocked) ? 'Booked'
                                                                        :
                                                                        (i.rstatus === 'NR') ? 'Pending'
                                                                            :
                                                                            (i.rstatus === 'R') ?
                                                                                (i.code.indexOf('-D') > 0) ? 'Damaged'
                                                                                    :
                                                                                    (i.code.indexOf('-FULL_D') > 0) ? 'Fully Damaged' : 'Received'
                                                                                :
                                                                                ''
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </>
                                    :
                                    <>
                                        <h4>No Item found. Search with different Product Name, code or Nickname</h4>
                                    </>
                                :
                                <>Search with any product from pending invoices</>
                        }
                    </CRow>
                </CCardBody>
            </CCard>
        )
    }

    const searchBar = () => {
        return (
            <CCard className="mb-4">
                <CCardHeader>
                    <form>
                        <CRow>
                            <div className="col-sm-2">
                                <strong>Search Items</strong>
                            </div>
                            <div className="col-sm-4">
                                <CFormInput
                                    value={searchTerm}
                                    type="text" onChange={changeTerm}
                                    placeholder={`Search Items by - code/name/nickname`} />
                            </div>
                            <div className="col-sm-3">
                                <CButton color="primary" type="submit"
                                    onClick={() => getItem()}
                                >
                                    Search
                                </CButton>
                                &nbsp;&nbsp;&nbsp;
                                <CButton color="secondary" type="button"
                                    onClick={clearSearch}
                                >
                                    Reset
                                </CButton>
                            </div>
                        </CRow>
                    </form>
                </CCardHeader>
            </CCard>
        )
    }

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    {searchBar()}
                </CCol>
                <CCol xs={12}>
                    {results()}
                </CCol>
            </CRow>
            <div className="row">
                {invoiceDetails.data[0] != undefined ? (
                    <InvoiceDetailsModal
                        invoice={invoiceDetails}
                        payments={payments}
                        show={show}
                        handleClose={handleClose}
                        isInvoice={false}
                        isPaid={true}
                        cb={getItem}
                        finder={true}
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default ItemFinder