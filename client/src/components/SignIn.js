import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignIn = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const Submit = () => {
        fetch('/auth/signIn', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                password
            })
        }).then(res => res.json()).then(data => {
            const { err, token } = data;
            if (token) {
                localStorage.setItem('jwt', token);
                M.toast({html: 'Success!'});
                history.push('/');
            }

            else {
                M.toast({html: err});
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h3 className="myfont"> LogIn </h3>
                <input type = "text" id = "username" value = {userName} placeholder = "Username" onChange = {(e) => setUserName(e.target.value)} />
                <input type = "password" id = "password" value = {password} placeholder = "Password" onChange = {(e) => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light" onClick={() => Submit()}> Login </button>
            </div>
        </div>
    )
}

export default SignIn;