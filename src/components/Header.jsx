import React from 'react'
import { Navbar, Container } from 'react-bootstrap'

const Header = () => {
  return (
    <Navbar className="bg-blue header" data-cy='header-background'>
        <Container>
            <Navbar.Brand href="/" className="fw-bold text-white fs-24" data-cy='header-title'>TO DO LIST APP</Navbar.Brand>
        </Container>
    </Navbar>
  )
}

export default Header