import { useNavigate } from "react-router-dom";
import { MUSCLE_GROUPS } from "../data/MuscleGroups";

function MuscleList() {
    const navigate = useNavigate();
    const toDetail = (bodypart:string) => {
        navigate("/Exercises", {state: {name:bodypart},});
    }

    return <>
    <div className="d-flex justify-content-center">
    <h1 className="text-pink">Muscles</h1>
    </div>
    <ul className="list-group">
        <li className="list-group-item border-0 p-0" key="all">
            <button type="button" id={"all"} className="btn muscle-option  w-100" onClick={()=>toDetail("All")}>All</button>
        </li>
        {MUSCLE_GROUPS.map((item) => 
        <li className="list-group-item border-0 p-0" key={item}>
            <button type="button" id={item} className="btn muscle-option  w-100" onClick={()=>toDetail(item)}>{item}</button>
        </li>
    )}
    </ul>
    </>;
}

export default MuscleList;
 