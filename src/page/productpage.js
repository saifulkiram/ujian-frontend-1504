import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    Image,
    Button,
} from 'react-bootstrap'

class DetailProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            image: '',
            size: 0,
            stock: '',
            total: 0,
            toLogin: false,
            toCart: false
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
            .then((res) => {
                console.log(res.data[0].img[1])
                this.setState({ data: res.data[0], image: res.data[0].img[1] })
            })
            .catch((err) => console.log(err))
    }

    handleAddToCart = () => {
        const { total, data } = this.state
        if (!this.props.id) return this.setState({ toLogin: true })


        let cartData = {
            name: data.name,
            image: data.img[1],
            price: data.price,
            qty: total,
            total: total * data.price
        }
        let tempCart = this.props.cart
        tempCart.push(cartData)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart: tempCart})
            .then((res) => {
                console.log(res.data)
                this.setState({ toCart: true})
            })
            .catch((err) => console.log(err))
    }

    render() {
        const { data, image, total, stock, toLogin, toCart } = this.state

        if (toLogin) return <Redirect to='/login' />

        if(toCart) return <Redirect to='/cart' />

        return (
            <div style={{ marginTop: '70px', padding: '0 20px' }}>
                <h1>Product Detail</h1>
                <div style={{ display: 'flex', height: '65vh' }}>
                    <div style={styles.img1}>
                        <Image src={image} rounded style={{ height: '90%', width: '90%' }} />
                    </div>
                    <div style={styles.detail}>
                        <div>
                            <h2>{data.name}</h2>
                            <h6>Description: {data.description}</h6>
                            <h6>Price: IDR {data.price ? data.price.toLocaleString() : 0}</h6>
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '50px' }}>
                                    <h5>*Stock = {stock}</h5>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <h5>Quantity: </h5>
                                    <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', borderRadius: '5px' }}>
                                        <Button
                                            variant="danger"
                                            onClick={() => this.setState({ total: total - 1 })}>
                                            -
                                        </Button>
                                        <h1>{total}</h1>
                                        <Button
                                            variant="primary"
                                            onClick={() => this.setState({ total: total + 1 })}>
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={this.handleAddToCart} Link to='/cart'>Add to Cart</Button>
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    img1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '40%',
        borderRadius: '15px',
        backgroundColor: 'rgba(43, 104, 213, .7)'
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexBasis: '60%',
        backgroundColor: 'salmon',
        padding: '15px',
        borderRadius: '15px'
    },
    total: {
        display: 'flex',
        alignItems: 'center'
    },
    adjust: {
        display: 'flex',
        // alignItems: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps)(DetailProduct)