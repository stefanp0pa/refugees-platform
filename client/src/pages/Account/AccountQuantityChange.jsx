import React from "react";
import './account-quantity-change.css';

export default function AccountQuantityChange({groupType, groupValue, decreaseButton, increaseButton}) {
    return (
        <span>
            <span className="input-group-btn">
                <button className="btn btn-default btn-subtract account-sign-btn" 
                    type="button" onClick={() => decreaseButton(groupType)}>-</button>
            </span>

            <input type="text" 
                className="form-control no-padding text-center item-quantity account-quantity-input" 
                value={groupValue}></input>

            <span className="input-group-btn">
                <button className="btn btn-default btn-add account-sign-btn" 
                    type="button" onClick={() => increaseButton(groupType)}>+</button>
            </span>
        </span>
    );
}