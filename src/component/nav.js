import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {
    Navbar,
    Nav,
    Dropdown

} from 'react-bootstrap'

import {logout} from '../action/ActionUser'                                         

class Navigation extends React.Component {
    Logout = () =>{
        localStorage.removeItem('id')
        this.props.logout()
    }
    

    render() {
        return (
            <Navbar expand="lg" fixed='top' style={{ height: '70px', backgroundColor: 'rgba(43, 104, 213, .7)' }}>
                <Navbar.Brand>
                    Slide Shoe Store
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/' style={{ color: 'white' }}>Home</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/cart' style={{ color: 'white' }}>Cart</Nav.Link>
                    </Nav>
                    <Link to='/cart'>
                        <i className="fas fa-shopping-cart" style={{ fontSize: '22px', color: 'white' }}></i>
                    </Link>
                    <Dropdown style={{ margin: '0 40px' }}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.props.username || "username"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.username
                                ?
                                <>
                                    <Dropdown.Item onClick={this.Logout}>Logout</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={this.props.role === 'user' ? '/history' : '/history_admin'} >History</Dropdown.Item>
                                </>
                                :
                                <>
                                    <Dropdown.Item as={Link} to='/login' >Login</Dropdown.Item>
                                    <Dropdown.Item as={Link} to= '/PurchaseHistory'>Purchase History</Dropdown.Item>
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        email : state.user.email
    }
}

export default connect(mapStateToProps,{logout}) (Navigation)