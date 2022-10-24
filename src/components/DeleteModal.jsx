import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import deleteIcon from '../assets/images/modal-delete-icon.svg'

const DeleteModal = ({show, confirm, hide, type, data}) => {
    return (
        <Modal show={show} onHide={hide} centered>
            <Modal.Header className='border-0 justify-content-center pt-5'>
                <img src={deleteIcon} alt='delete icon' />
            </Modal.Header>
            <Modal.Body className='px-5'>
                <div className='fw-medium text-center fs-18'>Apakah anda yakin menghapus {type} <span className='fw-bold'>“{data.title}”?</span></div>
            </Modal.Body>
            <Modal.Footer className='border-0 justify-content-center pb-5'>
                <Button variant='grey' className='rounded-pill px-4 fw-semibold' onClick={hide}>Batal</Button>
                <Button variant='red' className='rounded-pill px-4 fw-semibold' onClick={confirm}>Hapus</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteModal