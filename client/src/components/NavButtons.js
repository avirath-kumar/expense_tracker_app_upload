import { Link } from "react-router-dom";

export function NavButtons () {
    return (
        <div>
            <Link to="http://localhost:3000/">
                <button>Choose Billing Cycle</button>
            </Link>
            <Link to="http://localhost:3000/home">
                <button>Home</button>
            </Link>
            <Link to="http://localhost:3000/transactions">
                <button>Transactions</button>
            </Link>
            <Link to="http://localhost:3000/categorization">
                <button>Categorization</button>
            </Link>
        </div>
    )
}