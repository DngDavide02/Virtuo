import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar expand="lg" variant="dark" style={{ backgroundColor: "transparent" }} fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: "#E0E0E0", fontWeight: "bold" }}>
          Virtuo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" style={{ borderColor: "#E0E0E0" }} />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              style={{ color: "#E0E0E0" }}
              onMouseEnter={(e) => (e.target.style.color = "#AAAAAA")}
              onMouseLeave={(e) => (e.target.style.color = "#E0E0E0")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/games"
              style={{ color: "#E0E0E0" }}
              onMouseEnter={(e) => (e.target.style.color = "#AAAAAA")}
              onMouseLeave={(e) => (e.target.style.color = "#E0E0E0")}
            >
              Games
            </Nav.Link>
            <NavDropdown title={<span style={{ color: "#E0E0E0" }}>More</span>} id="more-dropdown" menuVariant="dark">
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
