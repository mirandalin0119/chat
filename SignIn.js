import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./constants";
import firebase from "firebase/app";
import "firebase/auth";

export default class SignInView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
    }

    // Listens for authentication state changes, and once authenticated, 
    // directs user to general channel
    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push(ROUTES.generalChannel);
            }
        });
    }

    // Stops listening for authentication state changes 
    componentWillUnmount() {
        this.authUnlisten();
    }

    render() {
        return (
            <div>
                <header className="jumbotron jumbotron-fluid bg-info text-white">
                    <div className="container">
                        <h1>Sign In</h1>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {
                            this.state.errorMsg &&
                            <p className="alert alert-danger">{this.state.errorMsg}</p>
                        }

                        {/* Sign In Form */}
                        <form onSubmit={evt => this.handleSubmit(evt)}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    id="email"
                                    className="form-control"
                                    placeholder="your email address"
                                    onChange={evt => this.setState({ email: evt.target.value })} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="your password"
                                    onChange={evt => this.setState({ password: evt.target.value })} />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-info">Sign In</button>
                            </div>
                        </form>
                        <p>Don't have an account yet? <Link to={ROUTES.signUp}>Sign Up</Link>!</p>
                    </div>
                </main>
            </div>
        );
    }

    // Displays credential errors to users, otherwise proceeds with sign in
    handleSubmit(login) {
        login.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(err => this.setState({ errorMsg: err.message }))
    }
}