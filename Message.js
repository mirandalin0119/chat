import React from "react";
import moment from 'moment';
import firebase from "firebase/app";
import "firebase/auth";

export default class Message extends React.Component {
    render() {
        let user = firebase.auth().currentUser;
        let snapshot = this.props.snapshot.val();

        return (
            <div className="oneMessage">

                {/* Author information */}
                <figure className="figure col">
                    <img src={snapshot.author.photoURL} alt="author"></img>
                    <figcaption className="figure-caption">{snapshot.author.displayName}</figcaption>
                </figure>

                {/* Message Content */}
                <p className="comment col-8">{snapshot.body}</p>

                {/* Timestamp and edit/delete buttons if applicable */}
                <div className="info col">
                    <div className="float-right">
                        <p className="time">{moment(new Date(snapshot.createdAt)).format("MM/DD/YY HH:mm")}</p>
                        {
                            snapshot.author.userID === user.uid
                                ? <button type="button" className="btn btn-xs btn-outline-secondary" onClick={() => this.handleEdit(this.props.snapshot.ref)}>Edit</button>
                                : null
                        }
                        {
                            snapshot.author.userID === user.uid
                                ? <button type="button" className="btn btn-xs btn-outline-secondary" onClick={() => this.props.snapshot.ref.remove()}>Delete</button>
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleEdit(ref) {
        let oldMsg = this.props.snapshot.val().body
        let ask = prompt("Enter Your New Message:");
        if (!ask || ask.trim().length === 0) {
            ref.update({ body: oldMsg });
        } else {
            ref.update({ body: ask });
        }
    }
}