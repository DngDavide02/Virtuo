import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/navbar.css";
import logo from "../assets/virtuo-logo.png";
import { useAuth } from "../js/AuthContext";

export default function NavigationBar() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const navRef = useRef(null);
  const initialOffsetRef = useRef(0);
  const [sticky, setSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  const { user, logout } = useAuth();

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const measure = () => {
      const rect = navEl.getBoundingClientRect();
      setNavHeight(rect.height);
      initialOffsetRef.current = navEl.offsetTop;
    };

    measure();

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > initialOffsetRef.current + 8) {
        if (!sticky) setSticky(true);
      } else {
        if (sticky) setSticky(false);
      }
    };

    const handleResize = () => {
      measure();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [sticky]);

  return (
    <>
      {sticky && <div style={{ height: navHeight }} aria-hidden="true" />}

      <Navbar
        ref={navRef}
        expand="lg"
        variant="dark"
        className={`app-navbar-minimal ${sticky ? "scrolled" : ""}`}
        fixed={sticky ? "top" : undefined}
        role="navigation"
        aria-label="Main navigation"
      >
        <Container className="nav-container-minimal d-flex align-items-center justify-content-between">
          <Navbar.Brand as={Link} to="/" className="brand-minimal">
            <img src={logo} alt="Virtuo" className="brand-logo-minimal" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" className="toggle-minimal" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto nav-items-minimal" role="menu">
              <Nav.Link as={Link} to="/" className={`nav-link-minimal ${isActive("/")}`} aria-current={isActive("/") ? "page" : undefined}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/games" className={`nav-link-minimal ${isActive("/games")}`}>
                Games
              </Nav.Link>
              <NavDropdown
                title={<span className="nav-link-minimal">More</span>}
                id="more-dropdown"
                menuVariant="dark"
                align="end"
                className="nav-dropdown-minimal"
              >
                <NavDropdown.Item as={Link} to="/about">
                  About
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contact">
                  Contact
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/help">
                  Help
                </NavDropdown.Item>
              </NavDropdown>

              <Form className="d-flex ms-3 align-items-center" role="search">
                <InputGroup>
                  <FormControl type="search" placeholder="Search games..." className="bg-dark text-white border-0 rounded-pill" aria-label="Search" size="sm" />
                  <Button variant="dark" size="sm" className="rounded-pill ms-2 border-0">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </Form>

              {!user ? (
                <Nav.Link as={Link} to="/login" className="nav-link-minimal ms-3">
                  Login
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={<span className="nav-link-minimal">{user}</span>}
                  id="user-dropdown"
                  menuVariant="dark"
                  align="end"
                  className="nav-dropdown-minimal ms-3"
                >
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
