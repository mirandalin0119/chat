import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import md5 from "blueimp-md5";

export default class SignUpView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            passwordConfirm: ""
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

    // // Stops listening for authentication state changes and reference value changes
    componentWillUnmount() {
        this.authUnlisten();
    }

    render() {
        return (
            <div>
                <header className="jumbotron jumbotron-fluid bg-info text-white">
                    <div className="container">
                        <h1>Sign Up</h1>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {
                            this.state.errorMsg &&
                            <p className="alert alert-danger">{this.state.errorMsg}</p>
                        }

                        {/* Sign Up form */}
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
                                <label htmlFor="username">Display Name</label>
                                <input type="text"
                                    id="username"
                                    className="form-control"
                                    placeholder="Set your display name"
                                    onChange={evt => this.setState({ username: evt.target.value })} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password"
                                    id="password"
                                    className="form-control"
                                    minLength="6"
                                    placeholder="Set your password"
                                    onChange={evt => this.setState({ password: evt.target.value })} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPass">Confirm Password</label>
                                <input type="password"
                                    id="confirmPass"
                                    className="form-control"
                                    placeholder="Re-enter your password"
                                    onChange={evt => this.setState({ passwordConfirm: evt.target.value })} />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-info">Sign Up</button>
                            </div>
                        </form>
                        <p>Already have an account? <Link to={ROUTES.signIn}>Sign In!</Link></p>
                    </div>
                </main>
            </div>
        );
    }

    // Check sign up form for errors, if there are no errors, 
    // creates Firebase account and redirects user to general channel
    handleSubmit(evt) {
        evt.preventDefault();
        if (this.state.email.length < 1) {
            this.setState({ errorMsg: "Invalid email" });
        } else if (this.state.username < 1) {
            this.setState({ errorMsg: "Invalid display name" });
        } else if (this.state.password !== this.state.passwordConfirm) {
            this.setState({ errorMsg: "Passwords don't match" });
        } else {
            let emailHash = md5(this.state.email);
            let encode = encodeURI('https://cdn.pixabay.com/photo/2017/09/26/14/18/background-2788758_1280.png');
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(user => user.updateProfile({
                    displayName: this.state.username,
                    photoURL: "https://www.gravatar.com/avatar/" + emailHash + "?d=" + encode
                }))
                .catch(err => this.setState({ errorMsg: err.message }))
        }
    }
}