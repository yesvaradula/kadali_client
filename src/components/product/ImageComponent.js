import React from "react";
import Modal from 'react-bootstrap/Modal'

const ImageComponent = ({ src, handleClose }) => {
    const s = src.split('&&&')
    return (
        <>
            <Modal show={true} onHide={handleClose} size="lg">
                <Modal.Header className="logo-color white-color logo" closeButton>

                    Image preview for {s[0]}

                </Modal.Header>
                <Modal.Body>
                    <div className="center-content"><img src={s[1]} /></div>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    )
}

export default ImageComponent;