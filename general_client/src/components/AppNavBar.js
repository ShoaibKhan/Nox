import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';

class AppNavbar extends Component {
    state = { //Constructor not needed since for each function we set it up with a =>
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color='dark' dark expand='sm' className='mb-5'>
                    <Container>
                        <NavbarBrand href='/'>Nox</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className='ml-auto' navbar>
                                <NavItem>
                                    <NavLink href='/'>Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='https://github.com/ShoaibAhmadKhan/Nox'>GitHub</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='https://www.rickrolled.com/get-rolled'>Dark Mode</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href='/prof'>Professor Login</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default AppNavbar;