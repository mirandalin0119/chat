import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import Message from "./Message";

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ref: undefined
        }
    }

    // Listens for authentication state changes, and once authenticated, gets firebase
    // reference and starts listening for value changes. If logged out or not 
    // authenticated, user is directed to sign in page
    componentDidMount() {
        this.unlistenAuth = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ currentUser: user });
                this.ref = firebase.database().ref("messages/" + this.props.match.params.chanName).limitToLast(500);
                this.valueListener = this.ref.on("value", snapshot => this.setState({ msgSnap: snapshot }));
            } else {
                this.props.history.push(ROUTES.signIn);
            }
        });
    }

    // Stops listening for authentication state changes and reference value changes
    componentWillUnmount() {
        if (this.state.currentUser) {
            this.unlistenAuth();
            this.ref.off("value", this.valueListener);
        }
    }

    // Stops listening for previous reference value changes and starts listening to new 
    // channel's reference value changes
    componentWillReceiveProps(nextProps) {
        this.ref.off("value", this.valueListener);
        let currRef = firebase.database().ref("messages/" + nextProps.match.params.chanName).limitToLast(500);
        this.valueListener = currRef.on("value", snapshot => this.setState({ msgSnap: snapshot }));
    }

    render() {
        if (!this.state.msgSnap) {
            return <div className="loading"><h1>loading...</h1></div>;
        }

        // Creates a message object for each snapshot 
        let messages = [];
        this.state.msgSnap.forEach(snapshot => {
            messages.push(<Message key={snapshot.key} snapshot={snapshot} />);
        })

        return (
            <div>
                <header>
                    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav mr-auto">
                                <div className="nav-item nav-link">
                                    {
                                        this.props.match.params.chanName !== "general" ?
                                            <Link to={ROUTES.generalChannel}>General</Link>
                                            : "General"
                                    }
                                </div>
                                <div className="nav-item nav-link">
                                    {
                                        this.props.match.params.chanName !== "random" ?
                                            <Link to={ROUTES.randomChannel}>Random</Link>
                                            : "Random"
                                    }
                                </div>
                            </div>
                            {<button className="btn btn-info" onClick={() => firebase.auth().signOut()}>Sign Out</button>}
                        </div>
                    </nav>
                </header>
                <main>
                    <div className="container content">
                        {messages}

                        {/* Form for users to input message */}
                        <form onSubmit={evt => this.handleSubmit(evt)}>
                            {
                                this.state.fbError ?
                                    <div className="alert alert-danger">{this.state.fbError.message}</div> :
                                    undefined
                            }
                            <div className="input-group mb-3">
                                <input type="text"
                                    className="form-control"
                                    onInput={evt => this.setState({ message: evt.target.value })}
                                    placeholder="Type message here"
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-info" type="submit">Enter</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        );
    }

    // Creates message from user's input and pushes to firebase to be displayed 
    handleSubmit(evt) {
        if (this.state.message) {
            evt.preventDefault();
            document.querySelector("input").value = "";
            let message = {
                body: this.state.message,
                author: {
                    userID: this.state.currentUser.uid,
                    displayName: this.state.currentUser.displayName,
                    photoURL: this.state.currentUser.photoURL
                },
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            firebase.database().ref("messages/" + this.props.match.params.chanName).push(message)
            this.setState({ message: undefined });
        }
    }
}