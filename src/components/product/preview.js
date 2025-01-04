import React, { useEffect, useState } from 'react'

import QrCode from './QRCode'
import Barcode from 'react-barcode'

import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const PrintPreview = (props) => {
  const [isPCodePicked, setIsCodePicked] = useState(false)
  const [logo, setLogo] = useState(false)
  const [po, setPO] = useState({})
  let [i, setI] = useState(1)
  const printsize = JSON.parse(localStorage.getItem('print_size'))
  const defaultOptions = {
    size: printsize,
    ecLevel: 'Q',
    enableCORS: false,
    quietZone: 8,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    logoImage: '',
    logoWidth: 0,
    logoHeight: 0,
    logoOpacity: 1,
    qrStyle: 'square',
    style: { 'margin-top': '-12px' },
  }

  useEffect(() => {
    if (!isPCodePicked) {
      setIsCodePicked(true)
      Object.entries(JSON.parse(localStorage.getItem('printing_options'))).map(([key, value]) => {
        po[key] = value
      })
    }
  })

  const printThisPage = () => {
    window.print()
  }

  const styles = {
    marginTop: '-12px',
  }

  return (
    <>
      {isPCodePicked ? (
        <>
          {/* <div className="mt-4 mb-4" style={{ textAlign: 'right', marginRight: '30px' }}>
            <button type="button" className="primary noprint" onClick={printThisPage}>
              Print
            </button>
          </div> */}

          {Object.entries(JSON.parse(localStorage.getItem('print'))).map(([key, value]) => {
            let n = parseInt(value.num)
            return value.doPrint ? (
              <>
                {po.qr ? (
                  <>
                    {[...Array(n)].map((i) => {
                      return (
                        <>
                          <div className="printqr automargin">
                            <QrCode url={key} options={defaultOptions} />
                          </div>
                        </>
                      )
                    })}
                  </>
                ) : (
                  <></>
                )}

                {po.bar ? (
                  <CRow key={key} className="mb-4">
                    {[...Array(n)].map((i) => {
                      return (
                        <div>
                          {/* <div className="caption">{po.name ? value.name : <></>}</div> */}
                          <div
                            className="col-sm-2"
                            style={{
                              textAlign: 'left',
                              marginLeft: '62px',
                              marginTop: '-2px',
                            }}
                          >
                            <Barcode
                              value={`${key}`}
                              width={0.6}
                              height={35}
                              displayValue="false"
                              renderer="img"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </CRow>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )
          })}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default PrintPreview
