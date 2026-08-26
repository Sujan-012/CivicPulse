function Greeting() {

    const isLogin = true;

    return (
        <div>

            {isLogin ? (
                <h2>Welcome User</h2>
            ) : (
                <h2>Please Login</h2>
            )}

        </div>
    );
}

export default Greeting;
