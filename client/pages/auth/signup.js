import { useState } from "react";
import axios from "axios";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setError] = useState([]);

    const onSubmit = async (event) => {
        try {
            event.preventDefault();

            const response = await axios.post('/api/users/signup', {
                email, password
            })
            console.log(response.data);
        }
        catch (err) {
            setError(err.response.data.errors);
            console.log(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>sign up</h1>
            <div className="form-group" >
                <label>Email Address</label>
                <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={password}
                    onChange={e => setPassword(e.target.value)} />
            </div>
            {
                errors.length > 0 &&
                <div className="alert alert-danger">
                    <h4>Opps..</h4>
                    <ul className="my-0">

                        {
                            errors.map((err, i) => <li key={i}>{err.message}</li>
                            )
                        }

                    </ul>
                </div>
            }

            <button className="btn btn-primary">Sing up</button>
        </form>
    )
};
