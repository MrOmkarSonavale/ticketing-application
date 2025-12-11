import { userEffect } from 'react'
import userRequest from '../../hooks/user-request'

export default () => {
    const { doRequest } = userRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {}
    })
    return <div></div>
};