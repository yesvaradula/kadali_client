import React from 'react'
import { QRCode } from 'react-qrcode-logo'

export default function QrCode(props) {
  const defaultOptions = {
    ecLevel: 'M',
    enableCORS: false,
    size: 150,
    quietZone: 10,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    logoImage: '',
    logoWidth: 30,
    logoHeight: 30,
    logoOpacity: 1,
    qrStyle: 'square',
  }

  console.log(props.options)

  const options = { ...defaultOptions, ...props.options }

  return (
    <>
      <div style={{ marginTop: '-10px', marginRight: '40px' }}>
        <QRCode value={props.url} {...options} />
      </div>
    </>
  )
}
