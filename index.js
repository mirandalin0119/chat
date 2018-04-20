import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyB7qoRJ_3VmZfYv7DPbFppxVfYn8pClX7o",
    authDomain: "chat-7afc0.firebaseapp.com",
    databaseURL: "https://chat-7afc0.firebaseio.com",
    projectId: "chat-7afc0",
    storageBucket: "",
    messagingSenderId: "192354754380"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
