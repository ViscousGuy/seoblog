import React, { useState } from "react";
import Link from "next/link";
import Router from 'next/router'
import NProgress from 'nprogress'

import Search from './../blogs/search.component'
import { APP_NAME } from "./../../config";
import {isAuth, signout} from './../../actions/auth'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";


Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.start()
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <Link href="/">
        <NavLink className="font-weigh-bold" >{APP_NAME}</NavLink>
        </Link>
      
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>

              <React.Fragment>
                <NavItem>
                  <Link href="/blogs">
                    <NavLink>Blogs</NavLink>
                  </Link>
                </NavItem>

                <NavItem>
                  <Link href="/contact">
                    <NavLink>Contact </NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            






          {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {isAuth() && (
              <NavItem>
                <NavLink style={{ cursor: 'pointer' }} onClick={() => signout(() => Router.replace(`/signin`))}>
                  Signout
                </NavLink>
              </NavItem>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                <NavLink>
                  {`${isAuth().name}'s Dashboard`}
                </NavLink>
                </Link>
              </NavItem>
            )} 

            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                <NavLink>
                  {`${isAuth().name}'s Dashboard`}
                </NavLink>
                </Link>
              </NavItem>
            )}  
            <NavItem>
                  <a href="/user/crud/blog" className="btn btn-primary text-light">
                    Write a blog
                    </a>
            </NavItem>
            
          </Nav>
        </Collapse>
      </Navbar>
      <Search/>
    </React.Fragment>
  );
};

export default Header;
