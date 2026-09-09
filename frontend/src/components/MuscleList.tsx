import { Link, useNavigate } from "react-router-dom";
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
        <button type="button" id={"all"} className="list-group-item" onClick={()=>toDetail("All")}>All</button>
        {MUSCLE_GROUPS.map((item) => 
            <button type="button" id={item} className="list-group-item" onClick={()=>toDetail(item)}>{item}</button>
    )}
    </ul>
    </>;
}

export default MuscleList;
 