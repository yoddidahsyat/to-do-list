import React from 'react'
import { Modal } from 'react-bootstrap'
import icon from '../assets/images/modal-information-icon.svg'

const AlertModal = ({show, hide, type}) => {
  return (
    <Modal show={show} onHide={hide} centered>
        <Modal.Body><img src={icon} alt='info' className='me-3' /> {type} berhasil dihapus</Modal.Body>
        
    </Modal>
  )
}

export default AlertModal