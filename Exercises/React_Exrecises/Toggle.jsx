import { useState } from "react";

function Toggle() {

    const [show, setShow] = useState(true);

    return (
        <div>

            <button onClick={() => setShow(!show)}>
                Toggle
            </button>

            {show && <h2>Hello React</h2>}

        </div>
    );
}

export default Toggle;
