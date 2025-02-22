import { jsPDF } from 'jspdf'
import Barcode from 'react-barcode'
import ReactDOM from 'react-dom'

export const getBarcodeBase64 = async (code) => {
  return new Promise((resolve) => {
    const barcodeContainer = document.createElement('div')
    document.body.appendChild(barcodeContainer)

    const barcode = (
      <Barcode
        value={code}
        format="CODE128"
        width={1.5} // Reduce width for better fitting
        height={30}
        displayValue={false}
        renderer="canvas"
      />
    )

    ReactDOM.render(barcode, barcodeContainer, () => {
      setTimeout(() => {
        const barcodeCanvas = barcodeContainer.querySelector('canvas')
        if (barcodeCanvas) {
          resolve(barcodeCanvas.toDataURL('image/png'))
        }
        document.body.removeChild(barcodeContainer)
      }, 500) // Delay for proper rendering
    })
  })
}
