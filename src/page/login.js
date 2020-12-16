import React from 'react'
import Axios from 'axios'
import {
    InputGroup,
    FormControl,
    Button,
    Modal
} from 'react-bootstrap'

import {  login } from '../action/ActionUser'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'



class HalamanLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loginErr: [false, ""],
            passvalidErr : [false,""],
            regError: [false, ""]
        }
    }

    Register = (a) => {
        let email = this.refs.email.value
        let password = this.refs.password.value

        Axios.post('http://localhost:2000/users',{
            email : email,
            password : password,
            cart: []
        })
        .then((resp)=>{
            console.log(resp.data)
            console.log('Register Successfull')
            this.setState({regError:[false,""]})
        })
        .catch((err)=>console.log(err))
    }


    Login = () => {
        let email = this.refs.email.value;
        let password = this.refs.password.value;

        if (!email || !password) return this.setState({ loginErr: [true, "Please Input All Data"] })

        Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
            .then((resp) => {
                if (resp.data.length === 0) return this.setState({ loginErr: [true, "Email or Username Invalid, Please Input Correct Data"] })
                localStorage.id = resp.data[0].id;
                this.props.login(resp.data[0])
                this.setState({ loginErr: [false, ""] });
            })
            .catch((error) => console.log(error));
    }

    passtrue = (a) => {
        let password = a.target.value
        let angka = /[0-9]/
        if(!angka.test(password) || password.length<6) return this.setState({passvalidErr:[true, "Must include number and minimum 6 character long"]})
        this.setState({passvalidErr:[false, ""]})

    }

    

    render() {
        if (this.props.email) return <Redirect to="/product" />
        const { loginErr, visible } = this.state
        return (
            <div style={styles.container}>
                <div style={styles.center}>
                    <div style={{ marginBottom: '10px' }}>
                        <h1>Login</h1>
                    </div>
                    <div style={{ width: '100%', height: 'auto', marginButtom: '5px', textAlign: 'center' }}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: '45px', display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-user" ></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                ref="email"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{ cursor: 'pointer' }}
                                onClick={() => this.setState({ visible: !visible })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: '45px', display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                ref="password"
                                type={visible ? "text" : "password"}
                                onChange={(a)=>this.passtrue(a)}
                            />
                        </InputGroup>
                        <Button onClick={this.Login} style={{ margin: "10px" }} Link to='/product'>
                            Login
                    <i className="fas fa-sign-in-alt" style={{ marginLeft: "8px" }} />
                        </Button>
                        <Button onClick={this.Register} style={{ margin: "10px" }} Link to='/product'>
                            Register
                    <i className="fas fa-sign-in-alt" style={{ marginLeft: "8px" }} />
                        </Button>
                    </div>
                </div>
                <Modal show={loginErr[0]} onHide={() => this.setState({ loginErr: [false, ""] })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{loginErr[1]}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({ loginErr: [false, ""] })}>
                            Okay
                </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
    },
    center: {
        marginTop: '100px',
        padding: '10px 30px',
        width: '350px',
        height: '50vh',
        backgroundColor: 'rgba(255, 255, 255, .7)',
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "30px"
    },
    item: {
        width: '100%',
        height: 'auto',
        marginButtom: '5px'
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}

export default connect(mapStateToProps, { login })(HalamanLogin)