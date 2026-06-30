import { Link, useNavigate } from "react-router-dom";
import BodyPartPage from "../Pages/BodyPartPage";


const bodyList = [
    "shoulder",
    "Chest",
    "Back",
    "Legs"
]





function BodyList() {
    const navigate = useNavigate();
    const toDetail = (bodypart:string) => {
        navigate('/BodyPartPage', {state: {name:bodypart},});
    }


    return <>
    <h1>Body Parts</h1>
    <ul className="list-group">
        {bodyList.map((item) => 
            // <li key={index} className="list-group-item " onClick={()=>toDetail(item)}>{item}
            <button type="button" id={item} className="list-group-item" onClick={()=>toDetail(item)}>{item}</button>
            // {/* {item}
            // <Link to="/BodyPartPage" state={{name : item}}> 
            //     {item}
            // </Link> */}
        // {/* </li> */}
    )}
    </ul>
    
    </>;
}

export default BodyList;
