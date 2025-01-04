import React, { useEffect, useState, useReducer } from 'react'
import { useHistory, Link } from 'react-router-dom'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import RetList from './list'

const ReturnList = props => {
    return (
        <div>
            <RetList type="returned" />
        </div>
    )
}

export default ReturnList