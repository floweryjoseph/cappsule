import React, { useEffect } from "react";

const Button = ({ available, selected, btnValue, updateState, click }) => {

  useEffect(()=>{
    if(available){
      updateState(btnValue)
    }else if(click){
      updateState(btnValue)
    }
  },[])

  if (available) {
    return (
      <div
        onClick={() => updateState(btnValue)}
        className={`border-2 flex justify-center items-center shadow-md text-xs  py-2 rounded-xl ${selected ? "border-[#112D31] shadow-[#b9f4ee]" : "border-black/30"}`}
      >
        {btnValue
        }</div>
    );
  } else {
    return (
      <div
        onClick={() => updateState(btnValue)}
        className={`border-2 flex justify-center items-center border-dashed shadow-lg text-xs py-2 rounded-xl ${selected ? "border-[#112D31]   shadow-[#87d6ce]" : "border-black/30"}`}
      >
        {btnValue}
      </div>
    );
  }
};

export default Button;