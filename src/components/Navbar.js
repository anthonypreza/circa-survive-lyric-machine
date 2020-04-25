import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

export default () => (
  <div>
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">cslg</NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="https://open.spotify.com/artist/11FY888Qctoy6YueCpFkXT">
            Spotify
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://en.wikipedia.org/wiki/Circa_Survive">
            Wiki
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="http://circasurvive.com/">Official Site</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://github.com/anthonypreza/circa-survive-lyric-machine">
            GitHub
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  </div>
);
