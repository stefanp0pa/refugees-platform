import './quantity-change.css';

export default function QuantityChange(props){
    return (
        <div className="flex flex-row">
            <span className="input-group-btn">
                <button className="btn btn-default btn-subtract sign-btn" type="button" onClick={() => props.decreaseButton(props.member)}>-</button>
            </span>

            <input id={props.id} type="text" readOnly className="form-control no-padding text-center item-quantity quantity-input" value={props.value}></input>

            <span className="input-group-btn">
                <button className="btn btn-default btn-add sign-btn" type="button" onClick={() => props.addButton(props.member)}>+</button>
            </span>
        </div>
    );
}