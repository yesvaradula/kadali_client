import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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

const SearchOperation = (props) => {
  let [searchTerm, setSearchTerm] = useState(() =>
    props.value ? (props.value !== undefined ? props.value : '') : '',
  )

  const changeTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    props.actBy('')
  }

  return (
    <>
      <form onSubmit={() => props.actBy(searchTerm)}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <div className="col-sm-2">
                <strong>Search {props.name}</strong>
              </div>
              <div className="col-sm-4">
                <CFormInput
                  value={searchTerm}
                  type="text"
                  onChange={changeTerm}
                  placeholder={`Search ${props.name} by - ${props.searchName}`}
                />
              </div>
              <div className="col-sm-3">
                <CButton color="primary" type="submit">
                  Search
                </CButton>
                &nbsp;&nbsp;&nbsp;
                <CButton color="secondary" type="button" onClick={clearSearch}>
                  Reset
                </CButton>
              </div>
            </CRow>
          </CCardHeader>
        </CCard>
      </form>
    </>
  )
}

export default SearchOperation
