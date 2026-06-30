import { useState } from "react";
interface Props {
    items : string[];
    heading: string;
}

function ListGroup(props: Props) {
    // const cities = [
    //     'New York',
    //     'San fras',
    //     'Beijing'
    // ];


    const [hoveredInex, setHoveredIndex] = useState(-1);


    
    return (
        <>
            <h1>{props.heading}</h1>
            {props.items.length === 0 && <p>No item</p>}
            <ul 
            className="list-group">
                {props.items.map((item, index) => (<li 
                onMouseEnter={()=> setHoveredIndex(index)}
                onMouseLeave={()=> setHoveredIndex(-1)}
                className={hoveredInex === index ? "list-group-item active" : "list-group-item"} key={item}>{item}</li>))}
            </ul>
        </>
    );

}

export default ListGroup;