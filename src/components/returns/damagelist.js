import React, { useEffect, useState, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import RetList from './list'

const ReturnDamaged = props => {
    return (
        <div>
            <RetList type="damaged" />
        </div>
    )
}

export default ReturnDamaged