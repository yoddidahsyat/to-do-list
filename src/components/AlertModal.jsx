import React from "react";
import { Modal } from "react-bootstrap";
import icon from "../assets/images/modal-information-icon.svg";

const AlertModal = ({ show, hide, type }) => {
    return (
        <Modal show={show} onHide={hide} centered data-cy='modal-information'>
            <Modal.Body>
                <img src={icon} alt="info" className="me-3" data-cy='modal-information-icon' />
                <span data-cy='modal-information-title'>{type} berhasil dihapus</span>
            </Modal.Body>
        </Modal>
    );
};

export default AlertModal;
