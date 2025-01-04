import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { useHistory } from 'react-router-dom'

const Print = (props) => {
  const history = useHistory()

  const [isPCodePicked, setIsCodePicked] = useState(false)
  let [prints, setPrints] = useState([])

  const toggle = () => {
    setModal(!modal)
    alert(modal)
  }

  useEffect(() => {
    if (!isPCodePicked) {
      setIsCodePicked(true)
    }
    localStorage.setItem('print_size', JSON.stringify('90'))
  }, [])

  const printPreview = () => {
    window.open('#/products/print/preview', '_blank')
  }

  const getThisPrint = (k) => (event) => {
    let newPrint = JSON.parse(localStorage.getItem('print'))
    newPrint[k].num = event.target.value
    localStorage.setItem('print', JSON.stringify(newPrint))
  }

  const selectSize = (event) => {
    localStorage.setItem('print_size', JSON.stringify(event.target.value))
  }

  return (
    <>
      {isPCodePicked ? (
        <>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Printing Products Codes</strong>
                </CCardHeader>
                <CCardBody>
                  {Object.entries(JSON.parse(localStorage.getItem('print'))).map(([key, value]) => {
                    let d = value.doPrint ? (
                      <CRow key={key} className="mb-4">
                        <div className="col-sm-1">{1}</div>
                        <div className="col-sm-1">
                          <CFormLabel className="col-form-label">
                            <strong>{key}</strong>
                          </CFormLabel>
                        </div>
                        <div className="col-sm-3">
                          <CFormInput
                            required
                            autoComplete="off"
                            type="text"
                            onChange={getThisPrint(key)}
                            placeholder="Enter Print numbers"
                          />
                        </div>
                        <div className="col-sm-3">
                          <CFormSelect required onChange={(event) => selectSize(event)}>
                            <option value="90">70px</option>
                            <option value="35">35px</option>
                          </CFormSelect>
                        </div>
                      </CRow>
                    ) : (
                      <></>
                    )
                    return d
                  })}
                  <CRow className="mb-4">
                    <CCol xs={12} className="text-right">
                      <div className="col-sm-1">
                        <CButton color="primary" type="button" onClick={printPreview}>
                          Print Codes
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default Print
