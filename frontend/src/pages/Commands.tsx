import { useQuery } from "react-query";

const Commands = () => {

    const commandsQuery = useQuery('commands', () =>
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/commands").then(res => res.json())
    );

    return (
        <div>
            commands page
        </div>
    );
}

export default Commands;