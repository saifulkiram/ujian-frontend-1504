import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { login } from '../action/ActionUser'

import {
    Table,
    Button,
    Image,
    Form,
    Modal
} from 'react-bootstrap'

class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: null,
            newQty: 0,
            reqPayment: false,
            reqPass: false,
            errPass: false,
            errPayment: false,
            cartEmpty: false,
            toHistory: false
        }
    }

    Delete = (index) => {
        let tempCart = this.props.cart

        tempCart.splice(index, 1)
        console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((resp) => {
                console.log(resp.data)

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((resp) => this.props.login(resp.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    Minus = () => {
        if (this.state.newQty <= 0) return

        this.setState({ newQty: this.state.newQty - 1 })
    }

    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }

    Done = (index) => {
 
        let tempProduct = this.props.cart[index]

        tempProduct.qty = parseInt(this.state.newQty)
        tempProduct.total = this.state.newQty * this.props.cart[index].price
        console.log(tempProduct)


        let tempCart = this.props.cart

        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                    .then((resp) => {
                        this.props.login(resp.data)
                        this.setState({ selectedIndex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    totalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)
        return counter
    }

    checkOut = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmpty: true })

        this.setState({ reqPass: true })
    }

    confPayment = () => {
        let nominal = this.refs.payment.value
        let total = this.totalPrice()

        if (nominal < total) return this.setState({ errPayment: true })

        let history = {
            email: this.props.email,
            date: new Date().toLocaleString(),
            total: total,
            product: this.props.cart
        }
        console.log(history)

        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)

                
                Axios.patch(`http://localhost:2000/users/${localStorage.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)

                        
                        Axios.get(`http://localhost:2000/users/${localStorage.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ reqPayment: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    confPass = () => {
        let pass = this.refs.pass.value
        if (pass !== this.props.pass) return this.setState({ errPass: true })

        this.setState({ reqPayment: true, reqPass: false })
    }

    renderTHead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    if (this.state.selectedIndex === index) {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                                </td>
                                <td style={{ textAlign: "center" }}>IDR {item.price.toLocaleString()}</td>
                                <td style={{}}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button onClick={this.Minus}>
                                            <i className="fas fa-minus"></i>
                                        </Button>
                                        <Form.Control style={{ width: '100px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} min={0} />
                                        <Button onClick={() => this.setState({ newQty: parseInt(this.state.newQty) + 1 })}>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>IDR {(this.state.newQty * item.price).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Button variant='success' onClick={() => this.Done(index)} style={{ marginRight: '15px' }}>Done</Button>
                                    <Button variant='danger' onClick={() => this.setState({ selectedIndex: null })}>Cancel</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: "center" }}>
                                <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                            </td>
                            <td style={{ textAlign: "center" }}>IDR {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>{item.qty}</td>
                            <td style={{ textAlign: "center" }}>IDR {item.total.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>
                                <Button variant='warning' onClick={() => this.setState({ selectedIndex: index, newQty: item.qty })} style={{ marginRight: '15px' }}>Edit</Button>
                                <Button variant='danger' onClick={() => this.Delete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render() {
        const { reqPayment, reqPass, errPass, errPayment, cartEmpty, toHistory } = this.state

        if (!this.props.id) return <Redirect to='/login' />

        if (toHistory) return <Redirect to='/history' />

        return (
            <div style={{ marginTop: '70px', padding: '0 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Your Cart</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={this.checkOut} variant="success">Checkout</Button>
                    </div>
                </div>
                <Table striped bordered hover variant="dark">
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
                <h1 style={{ textAlign: 'right' }}>Total: IDR {this.totalPrice().toLocaleString()}</h1>
                <Modal show={reqPass} onHide={() => this.setState({ reqPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="pass" placeholder="Tolong Masukan Password Untuk Melanjutkan Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPass: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPass} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPass} onHide={() => this.setState({ errPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Wrong Password</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPass: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={reqPayment} onHide={() => this.setState({ reqPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="payment" type="number" placeholder="Tolong Masukan Jumlah Uang Untuk Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPayment: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPayment} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPayment} onHide={() => this.setState({ errPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Jumlah Uang Kurang Dari Total Cart</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPayment: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={cartEmpty} onHide={() => this.setState({ cartEmpty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Make Sure Your Cart Is Not Empty!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartEmpty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id,
        pass: state.user.password,
        email: state.user.email
    }
}

export default connect(mapStateToProps, { login })(Cart)