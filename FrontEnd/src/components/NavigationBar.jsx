import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/navbar.css";
import logo from "../assets/virtuo-logo.png";
import { useAuth } from "../js/AuthContext";

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const navRef = useRef(null);
  const initialOffsetRef = useRef(0);
  const [sticky, setSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

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
      setSticky(scrollY > initialOffsetRef.current + 8);
    };

    const handleResize = () => measure();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/games?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  const handleNavClick = () => {
    if (expanded) setExpanded(false);
  };

  return (
    <>
      {sticky && <div style={{ height: navHeight }} aria-hidden="true" />}
      {expanded && <div className="virt-overlay" onClick={() => setExpanded(false)} aria-hidden="true" />}
      <Navbar
        ref={navRef}
        expand="lg"
        variant="dark"
        expanded={expanded}
        onToggle={(v) => setExpanded(v)}
        className={`app-navbar-minimal ${sticky ? "scrolled" : ""}`}
        fixed={sticky ? "top" : undefined}
      >
        <Container className="nav-container-minimal">
          <Navbar.Brand as={Link} to="/" className="brand-minimal" aria-label="Home">
            <img src={logo} alt="Virtuo" className="brand-logo-minimal" />
          </Navbar.Brand>

          <div className="nav-right-tools">
            <Form className="d-none d-lg-flex align-items-center me-2 desktop-search" onSubmit={handleSearchSubmit} role="search">
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Search games..."
                  className="bg-dark text-white border-0 rounded-pill"
                  aria-label="Search"
                  size="sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="dark" size="sm" className="rounded-pill ms-2 border-0">
                  <i className="bi bi-search" aria-hidden="true" />
                  <span className="visually-hidden">Search</span>
                </Button>
              </InputGroup>
            </Form>

            <Navbar.Toggle aria-controls="main-navbar" className="toggle-minimal" />
          </div>

          <Navbar.Collapse id="main-navbar" className="mobile-navbar-collapse">
            <Nav className="ms-auto nav-items-minimal">
              <Nav.Link as={Link} to="/" className={`nav-link-minimal ${isActive("/")}`} onClick={handleNavClick}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/games" className={`nav-link-minimal ${isActive("/games")}`} onClick={handleNavClick}>
                Games
              </Nav.Link>
              <Nav.Link as={Link} to="/chat" className={`nav-link-minimal ${isActive("/chat")}`} onClick={handleNavClick}>
                Chat
              </Nav.Link>

              <NavDropdown
                title={<span className="nav-link-minimal">More</span>}
                id="more-dropdown"
                menuVariant="dark"
                align="end"
                className="nav-dropdown-minimal"
                renderMenuOnMount={true}
                onClick={(e) => e.stopPropagation()}
              >
                <NavDropdown.Item as={Link} to="/about" onClick={() => setExpanded(false)}>
                  About
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contact" onClick={() => setExpanded(false)}>
                  Contact
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/help" onClick={() => setExpanded(false)}>
                  Help
                </NavDropdown.Item>
              </NavDropdown>

              {!user ? (
                <Nav.Link as={Link} to="/login" className="nav-link-minimal ms-lg-3" onClick={handleNavClick}>
                  Login
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={<span className="nav-link-minimal">{user.username}</span>}
                  id="user-dropdown"
                  menuVariant="dark"
                  align="end"
                  className="nav-dropdown-minimal ms-lg-3"
                  renderMenuOnMount={true}
                  onClick={(e) => e.stopPropagation()}
                >
                  <NavDropdown.Item as={Link} to="/account" onClick={() => setExpanded(false)}>
                    Account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      logout();
                      setExpanded(false);
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              <Form className="d-lg-none mt-3 mobile-search" onSubmit={handleSearchSubmit} role="search">
                <InputGroup>
                  <FormControl
                    type="search"
                    placeholder="Search games..."
                    className="bg-dark text-white border-0 rounded-pill"
                    aria-label="Search"
                    size="sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="dark" size="sm" className="rounded-pill ms-2 border-0">
                    <i className="bi bi-search" aria-hidden="true" />
                    <span className="visually-hidden">Search</span>
                  </Button>
                </InputGroup>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
