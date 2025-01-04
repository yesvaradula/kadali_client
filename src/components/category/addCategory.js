import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
require('dotenv').config()

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
  CImage,
} from '@coreui/react'

const AddCategory = (props) => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <CForm
      className="g-3"
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol xs={12}>
          <CCard className="">
            <CCardHeader>
              <strong>Add Category</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <div className="col-sm-1">
                  <CFormLabel htmlFor="productCode" className="col-form-label">
                    <strong>Name</strong>
                  </CFormLabel>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default AddCategory
