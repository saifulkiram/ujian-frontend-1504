import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

import {
    Card,
    Button
} from 'react-bootstrap'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:2000/products')
            .then((res) => {
                this.setState({ data: res.data })
            })
            .catch((err) => console.log(err))
    }

    render() {
        return (
            <div style={{ padding: '50px' }}>
                <h1>Products</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {this.state.data.map((item, index) => {
                        return (
                            <Card key={index} style={{ width: '18rem', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                                <Card.Img variant="top" src={item.img[1]} style={{}} />
                                <Card.Body style={styles.cardBody}>
                                    <Card.Title style={{}}>{item.name}</Card.Title>
                                    <Card.Text style={{}}>Stock :{item.stock}</Card.Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Button variant="primary" as={Link} to={`/product?id=${item.id}`}>Buy Now</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const styles = {
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}

export default Products