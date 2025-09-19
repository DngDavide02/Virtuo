import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/navbar.css";
import logo from "../assets/virtuo-logo.png";
import { useAuth } from "../js/AuthContext";

/**
 * Componente SearchForm memoizzato per evitare perdita focus
 */
const SearchForm = React.memo(({ searchTerm, setSearchTerm, onSubmit, className }) => (
  <Form className={className} onSubmit={onSubmit} role="search">
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
));

/**
 * NavigationBar component con supporto a:
 * - Sticky navbar al scroll
 * - Ricerca giochi (desktop e mobile)
 * - Dropdown utenti/log in
 * - Mobile overlay e toggle
 */
export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navRef = useRef(null);
  const initialOffsetRef = useRef(0);

  const [sticky, setSticky] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Controlla se il link corrente è attivo
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // Misura altezza navbar e gestisce sticky
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const measure = () => {
      const rect = navEl.getBoundingClientRect();
      setNavHeight(rect.height);
      initialOffsetRef.current = navEl.offsetTop;
    };

    measure();

    const handleScroll = () => setSticky(window.scrollY > initialOffsetRef.current + 8);
    const handleResize = () => measure();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Chiude il menu mobile con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && expanded && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Gestione submit ricerca
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  // Chiude il menu mobile cliccando sui link
  const handleNavClick = () => expanded && setExpanded(false);

  return (
    <>
      {/* Placeholder per sticky */}
      {sticky && <div style={{ height: navHeight }} aria-hidden="true" />}
      {/* Overlay mobile */}
      {expanded && <div className="virt-overlay" onClick={() => setExpanded(false)} aria-hidden="true" />}

      <Navbar
        ref={navRef}
        expand="lg"
        variant="dark"
        expanded={expanded}
        onToggle={setExpanded}
        className={`app-navbar-minimal ${sticky ? "scrolled" : ""}`}
        fixed={sticky ? "top" : undefined}
      >
        <Container className="nav-container-minimal">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="brand-minimal" aria-label="Home">
            <img src={logo} alt="Virtuo" className="brand-logo-minimal" />
          </Navbar.Brand>

          {/* Ricerca desktop + toggle mobile */}
          <div className="nav-right-tools">
            <div className="d-none d-lg-flex align-items-center me-2 desktop-search">
              <SearchForm className="d-flex" searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSubmit={handleSearchSubmit} />
            </div>
            <Navbar.Toggle aria-controls="main-navbar" className="toggle-minimal" />
          </div>

          {/* Menu collapsible */}
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

              {/* Dropdown "More" */}
              <NavDropdown
                title={<span className="nav-link-minimal">More</span>}
                id="more-dropdown"
                menuVariant="dark"
                align="end"
                className="nav-dropdown-minimal"
                renderMenuOnMount
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

              {/* Login / User Dropdown */}
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
                  renderMenuOnMount
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

              {/* Ricerca mobile */}
              <div className="d-lg-none mt-3 mobile-search">
                <SearchForm className="" searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSubmit={handleSearchSubmit} />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
