import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

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

const FileReaderComponent = () => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileBrowse = () => {
    fileInputRef.current.click() // Simulate a click on the hidden file input
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    setLoading(() => true)

    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        const binaryString = e.target.result
        const workbook = XLSX.read(binaryString, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        const formattedData = jsonData.map((row) => {
          const headers = jsonData[0]
          const rowData = {}
          headers.forEach((header, index) => {
            if (!isNaN(row[8])) {
              rowData['code'] = row[1]
              rowData['cost'] = row[8]
              rowData['price'] = Math.round(row[8] + row[8] * 0.1).toFixed(2)
            }
          })
          return rowData
        })

        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/products/update/price`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ records: formattedData }),
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Data successfully sent to the server:', result)
            setLoading(() => false)
          } else {
            console.error('Failed to update the record:', response.statusText)
            setLoading(() => false)
          }
        } catch (error) {
          console.error('Error sending data to the server:', error)
          setLoading(() => false)
        }
      }

      reader.readAsBinaryString(file)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      {loading && <div><CButton color="info">Updating products...</CButton></div>}
      {!loading && (
        <CButton color="danger" style={{ color: 'white' }} onClick={handleFileBrowse} type="button">
          Bulk Price Update
        </CButton>
      )}
    </div>
  )
}

export default FileReaderComponent
