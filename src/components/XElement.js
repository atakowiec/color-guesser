import xIcon from "../images/delete-button.png"

export default function XElement(props) {
    const e = props.position;
    return (<>
        {   e.length > 0 &&
            <img key={e[0] + "x" + e[1]} alt={"wrong answer"} style={{left: e[0] + "px", top: e[1] + "px"}} className={"x-image"} src={xIcon}/>
        }
    </>)
}