import { useState, React} from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';



const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate()


    const handleLogin = () => {
        if (username.length == 0 || password.length == 0) {
            setError(true)
        } else {
            const url = '/Login/';
            const data = {
                "userName": username,
                "password": password
            }
            axios.post(url, data)
                .then((result) => {
                    console.log(result);  
                    if(result.data['authToken'] != null) 
                    {
                        axios.defaults.headers.common = {'Authorization': `bearer ${result.data['authToken']}`}
                        navigate("/glossary");
                    }
                    else{
                        navigate("/")
                    }
                    
                    
                }).catch((error) => {
                    setErrorMessage(error);
                })           
        }    

    }
    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                <form className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User Name</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} className="form-control"></input>
                                {error && username.length <= 0 ?
                                    <small class="text-danger">User Name can't be Empty</small> : ""
                                }
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control"></input>
                                {error && password.length <= 0 ?
                                    <small class="text-danger">Password can't be Empty</small> : ""
                                }
                            </div>
                            <div>
                            {errorMessage ? 
                             <small class="text-danger">Please enter valid credentials!</small> : ""
                            }
                            </div>
                        </div>
                        <div className="card-footer">
                            <Button variant="primary" onClick={handleLogin}>
                                Login
                            </Button>


                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;