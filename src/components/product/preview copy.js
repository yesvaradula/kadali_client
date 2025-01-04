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
    marginLeft: '3px',
    marginTop: '30px',
  }

  return (
    <>
      {isPCodePicked ? (
        <>
          <div className="mt-4 mb-4" style={{ textAlign: 'right', marginRight: '30px' }}>
            <button type="button" className="primary noprint" onClick={printThisPage}>
              Print
            </button>
          </div>

          {Object.entries(JSON.parse(localStorage.getItem('print'))).map(([key, value]) => {
            let n = parseInt(value.num)
            return value.doPrint ? (
              <>
                {po.qr ? (
                  <>
                    {[...Array(n)].map((i) => {
                      return (
                        <>
                          <div className="automargin">
                            <table key={key} className="printqr">
                              <tr>
                                <td width={30}>&nbsp;</td>
                                <td width={90} style={styles} align="left">
                                  <QrCode url={key} options={defaultOptions} />
                                </td>
                                <td width={3}>&nbsp;</td>
                                <td align="left">
                                  <table>
                                    <tr>
                                      <td align="left">{po.name ? value.name : <></>}</td>
                                    </tr>
                                    <tr>
                                      <td align="left">{po.code ? key : <></>}</td>
                                    </tr>
                                    <tr>
                                      <td align="left">{po.price ? value.price : <></>}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
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
                        <div className="col-sm-2 text-center">
                          <div className="caption">{po.name ? value.name : <></>}</div>
                          <div>
                            <Barcode
                              value={`${key}`}
                              width="1.5"
                              height="50"
                              textMargin="2"
                              fontSize="8"
                            />
                          </div>
                          {/* <div className="caption">
                                    {po.code ? key + '-' : <></>}
                                    {po.price ? value.price : <></>}
                                  </div> */}
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
