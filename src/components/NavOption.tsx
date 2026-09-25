

function NavOption(props: { label_text:string; destination:string }) {

    return (
        <div>
            <label>
                <a href={props.destination}> {props.label_text} </a>
            </label>
        </div>
    )
}

export default NavOption