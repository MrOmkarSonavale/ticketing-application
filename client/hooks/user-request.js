import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
    const [errors, setError] = useState(null);

    const doRequest = async () => {
        try {
            setError(null)
            const response = await axios[method](url, body);

            onSuccess(response.data)

            // return response.data;
        } catch (err) {
            setError(
                <div className="alert alert-danger">
                    <h4>Opps..</h4>
                    <ul className="my-0">
                        {
                            err.response.data.errors.map((err, i) => <li key={i}>{err.message}</li>
                            )
                        }
                    </ul>
                </div>
            )

            // throw err;
        }
    };

    return { doRequest, errors };
};