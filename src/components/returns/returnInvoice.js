import React, { useEffect, useState, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { searchInvoices, loadOptions, loadDataTable } from './searchItems'

const ReturnInvoice = props => {
    const [searchString, setSearchString] = useState('')
    const [ss, setSS] = useState(false)
    const [invoices, setInvoices] = useState(() => [])
    const [returnInvoice, setReturnInvoice] = useState([])
    const [formValues, setFormValues] = useState(() => [{
        code: '',
        name: '',
        error: '',
        quantity: 0,
        isDamaged: false
    }])

    const getInvoices = async (e) => {
        e.stopPropagation();
        let results = await axios.post(`${process.env.REACT_APP_API_URL}/invoice/search`, { ss: searchString })
        setSS(true)
        setInvoices(prev => [...results.data])
    }

    const displaySelectedInvoice = (e) => {
        if (e.target.value !== 0) {
            setReturnInvoice(prevState => invoices.filter(i => i.invoice === e.target.value)[0])
        } else {
            setReturnInvoice(prevState => [])
        }
    }

    return (
        <>
            {searchInvoices(setSearchString, getInvoices)}
            {
                invoices.length ?
                    <>
                        {loadOptions(invoices, displaySelectedInvoice)}
                        <hr />
                        {
                            returnInvoice && returnInvoice.invoice !== undefined ?
                                loadDataTable(formValues, setFormValues, returnInvoice)
                                :
                                <>
                                    <div className="message col-sm-6">
                                        Please select the Invoice to return items
                                    </div>
                                </>
                        }
                    </>
                    :
                    <>
                        {ss ? <>
                            <div className="message col-sm-6">
                                No invoices found. Please refine your search
                            </div>
                        </> : <></>}
                    </>
            }
        </>
    )
}

export default ReturnInvoice;