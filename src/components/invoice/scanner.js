import React, { useEffect, useReducer } from 'react'
import useState from 'react-usestateref'
import { useHistory, Link } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { cilPlus, cilCheck, cilFingerprint, cilDelete } from '@coreui/icons'
import Loader from '../common/loading'
// import QrScan from 'react-qr-reader'

// import BarcodeScannerComponent from 'react-qr-barcode-scanner'

import moment from 'moment'
import axios from 'axios'
require('dotenv').config()

const Scanner = () => {
  const history = useHistory()
  const [items, setItems, refItems] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [openScanner, setOpenScanner] = useState(false)
  const [qrScanData, setQrScanData, refScannedItem] = useState('')
  const [stopStream, setStopStream] = React.useState(false)
  const [isLoading, setIsLoading, nowIsLoading] = useState(false)
  const [selectedScannedItem, setSelectedScannedItem] = useState(0)
  const [scans, setScans, refScans] = useState([])

  const startScanner = () => {
    setOpenScanner(true)
    setStopStream(false)
    setIsLoading(false)
  }

  useEffect(() => {
    getScannedItems()
  }, [])

  const getScannedItems = async () => {
    const results = await axios.get(`${process.env.REACT_APP_API_URL}/items/scanned`)
    setScans(results.data)
  }

  const getProductDetails = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/details/${refScannedItem.current}`)
      .then((data) => {
        if (data.data.length) {
          data = data.data[0]
          let d = [{ code: data.code, name: data.name, nickname: data.nickname }]
          setItems([...refItems.current, ...d])
        }
        setQrScanData('')
        setIsLoading(false)
      })
  }

  const resetScanner = () => {
    setQrScanData('')
    setIsLoading(false)
    setOpenScanner(false)
    setCompanyName('')
    setCompanyId('')
  }

  const addScannedItems = () => {
    let ids = refItems.current.map((item) => item.code).join(',')
    let params = {
      ids: ids,
      company: companyName,
    }

    if (companyId != '') {
      params = { ...params, c: companyId }
      axios
        .post(`${process.env.REACT_APP_API_URL}/products/updatescans`, params)
        .then(function (response) {
          history.push('/dashboard')
        })
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/products/addscans`, params)
        .then(function (response) {
          history.push('/dashboard')
        })
    }
  }

  const loadAlreadyScanned = async (company) => {
    if (company !== '') {
      setProceed(true)
      setCompanyName(company)
      let c = refScans.current.filter((i) => i.company === company)[0]
      setCompanyId(c?.id)
      let items = c?.items
      items = items.split(',')
      setItems([])
      await items.map(async (i) => {
        setIsLoading(true)
        await axios.get(`${process.env.REACT_APP_API_URL}/products/details/${i}`).then((data) => {
          if (data.data.length) {
            data = data.data[0]
            let d = [{ code: data.code, name: data.name, nickname: data.nickname }]
            setItems([...refItems.current, ...d])
          }
        })
        setIsLoading(false)
      })
    } else {
      setCompanyName('')
      setCompanyId('')
    }
  }

  let timeoutId
  let [proceed, setProceed] = useState(true)

  const validateAndSetCName = async (name) => {
    setCompanyName(name)
    setIsLoading(true)
    if (timeoutId) {
      clearTimeout()
    }

    timeoutId = setTimeout(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/scan/check/${name}`).then((data) => {
        setProceed(!data.data.existing)
        setIsLoading(false)
      })
    }, 1000)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow></CRow>
          <CRow>
            <div className="col-sm-12">
              <input
                value={companyName}
                onChange={(event) => validateAndSetCName(event.target.value)}
                type="text"
                className="form-control"
                placeholder="Enter Company Name"
              />
            </div>

            {!proceed && !isLoading ? (
              <span
                style={{
                  paddingTop: '10px',
                  fontWeight: '700',
                }}
              >
                Company with "{companyName}" already exists. Try with other name
              </span>
            ) : (
              <></>
            )}

            <div className="col-sm-12 text-center mt-2 mb-2">OR</div>
            <div className="col-sm-12">
              <select className="form-control" onChange={(e) => loadAlreadyScanned(e.target.value)}>
                <option value="">Select Name</option>
                {refScans.current.map((i) => (
                  <option value={i.company}>{i.company}</option>
                ))}
              </select>
            </div>
            <div className="donotdisplay">
              {/* <BarcodeScannerComponent stopStream={stopStream} onUpdate={(err, result) => {}} /> */}
            </div>
            {openScanner && !stopStream ? (
              <>
                {/* <BarcodeScannerComponent
                  width={250}
                  height={250}
                  stopStream={stopStream}
                  onUpdate={(err, result) => {
                    console.log('error', err)
                    if (result) {
                      setQrScanData(result.text)
                      setIsLoading(true)
                      setStopStream(true)
                      setTimeout(() => {
                        getProductDetails()
                      }, 2000)
                    }
                  }}
                /> */}
              </>
            ) : (
              <>
                <p>{qrScanData}</p>
              </>
            )}
          </CRow>
        </CCardBody>
      </CCard>
      {(companyName !== '' || companyId != '') && proceed && !isLoading ? (
        <>
          <CCard>
            <CCardHeader>
              <CRow>
                <div className="col-sm-2 float-left">Items Scanned</div>
                <div className="col-sm-2">
                  <CButton color="secondary" type="button">
                    <CIcon
                      onClick={() => startScanner()}
                      icon={cilFingerprint}
                      className="cricon"
                    />
                  </CButton>
                </div>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {nowIsLoading.current ? <Loader /> : <></>}
              {refItems.current.length ? (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refItems.current.map((i) => (
                        <tr>
                          <td>{i.nickname}</td>
                          <td>-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <></>
              )}

              <hr />
              <CRow>
                <div className="col-sm-12 float-right">
                  <CButton color="primary" type="button" onClick={() => addScannedItems()}>
                    Add
                  </CButton>
                  &nbsp;&nbsp;
                  <CButton color="secondary" onClick={() => resetScanner()} type="button">
                    Cancel
                  </CButton>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </>
      ) : (
        <></>
      )}

      <div>&nbsp;</div>
    </>
  )
}

export default Scanner
