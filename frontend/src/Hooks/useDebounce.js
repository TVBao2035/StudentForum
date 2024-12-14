const { useState, useEffect } = require("react")

function useDebounce(value, delay) {
    const [valueDebounce, setValueDebounce] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setValueDebounce(value), delay);
        return () => clearTimeout(timeoutId);
    }, [value])

    return valueDebounce;
}

export default useDebounce;