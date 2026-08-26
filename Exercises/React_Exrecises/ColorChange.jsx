import { useState } from "react";

function ColorChange() {

    const [color, setColor] = useState("red");

    return (
        <div>

            <h2 style={{ color: color }}>
                React Color
            </h2>

            <button onClick={() => setColor("blue")}>
                Change Color
            </button>

        </div>
    );
}

export default ColorChange;
