import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Header.scss';

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded} className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          <img src="/img/logo.png" alt="Barra Bambu" height="60" />
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(!expanded)}
          className="hamburger"
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </Navbar.Toggle>
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={Link} to="/#sobre" onClick={() => setExpanded(false)}>Sobre</Nav.Link>
            <Nav.Link as={Link} to="/cardapio" onClick={() => setExpanded(false)}>Cardápio</Nav.Link>
            <Nav.Link as={Link} to="/#galeria" onClick={() => setExpanded(false)}>Galeria</Nav.Link>
            <Nav.Link as={Link} to="/#reserva" onClick={() => setExpanded(false)}>Reserva</Nav.Link>
            <Nav.Link as={Link} to="/#contato" onClick={() => setExpanded(false)}>Contato</Nav.Link>
            <Button 
              as={Link} 
              to="/admin" 
              variant="outline-warning" 
              className="ms-2 admin-btn"
            >
              Admin
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;