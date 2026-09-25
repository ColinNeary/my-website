import { Link } from 'react-router-dom'

function NavOption(props: { label_text:string; destination:string }) {

    return (
        <div>
            <label>
                <Link to={props.destination}> {props.label_text} </Link>
            </label>
        </div>
    )
}

export default NavOption
