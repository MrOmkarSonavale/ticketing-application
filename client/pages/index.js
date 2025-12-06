import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return currentUser ?
        (< h1 > You are signed in</h1 >) :
        (<h1>You are not signed out</h1>)
};

LandingPage.getInitialProps = async ({ req }) => {

    // console.log('hello' + await buildClient({ req }));
    const { data } = await buildClient({ req }).get('/api/users/currentuser');


    return data;
};

export default LandingPage