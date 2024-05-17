import React, { useEffect, useState } from "react";
import Button from "./Button";
import { checkAvailability, findLowestSellingPrice } from "../utils";

const Results = ({ medicine }) => {

    const [selectedForm, setSelectedForm] = useState(medicine.available_forms[0])
    const [selectedStrength, setSelectedStrength] = useState(null)
    const [selectedPacking, setSelectedPacking] = useState(null)
    const [saltformArr, setSaltformArr] = useState([])
    const [packagesArr, setPackagesArr] = useState([])
    const [available, setAvailable] = useState(null)
    const [showMoreForm, setShowMoreForm] = useState(false)
    const [showMoreStrength, setShowMoreStrength] = useState(false)
    const [price, setPrice] = useState(null)

    useEffect(() => {
        if (selectedForm) {
            setSaltformArr([])
            setSelectedStrength(Object.keys(medicine.salt_forms_json[selectedForm])[0])
            for (let i in medicine.salt_forms_json[selectedForm]) {
                medicine.salt_forms_json[selectedForm][i].strength = i;
                setSaltformArr(prev => [...prev, medicine.salt_forms_json[selectedForm][i]])
                setAvailable(checkAvailability(medicine.salt_forms_json[selectedForm]))
            }
            if (saltformArr.length > 0) {
                setSelectedStrength(saltformArr[0].strength)
            }
            let lowestSellingPrice = findLowestSellingPrice(medicine.salt_forms_json[selectedForm])
            if (lowestSellingPrice !== Infinity) {
                setPrice(lowestSellingPrice)
            }
        }
    }, [selectedForm])

    useEffect(() => {
        if (selectedStrength) {
            setPackagesArr([])
            const selectedStr = saltformArr.find(d => d.strength === selectedStrength)
            setAvailable(checkAvailability(selectedStr))
            for (let i in selectedStr) {
                if (i !== "strength") {
                    selectedStr[i].packing = i
                    setPackagesArr(prev => [...prev, selectedStr[i]])
                }
            }
        }
    }, [selectedStrength])


    useEffect(() => {
        if (selectedPacking) {
            const pharmacyData = packagesArr.find(p => p.packing === selectedPacking)
            let lowestPrice = Infinity;

            for (const key in pharmacyData) {
                if (Array.isArray(pharmacyData[key])) {
                    pharmacyData[key].forEach(item => {
                        if (item && typeof item.selling_price === 'number') {
                            lowestPrice = Math.min(lowestPrice, item.selling_price);
                        }
                    });
                }
            }
            if (lowestPrice !== Infinity) {
                setPrice(lowestPrice);
            }else{
                setPrice(null)
            }
        }
    }, [selectedPacking])

    return (
        <div className="w-[80%] flex justify-between items-center bg-gradient-to-l from-[#E8F2F1] to-transparent rounded-lg shadow-lg">
            <div className="w-[40%] flex flex-col items-center">
                <div className="w-full flex  justify-between  p-5">
                    <p className="w-[120px] text-left">Form:</p>
                    <div className="grid w-[70%] grid-cols-2 relative gap-2 pr-2">
                        {medicine.available_forms?.map((form, i) =>
                            <div hidden={i > 3 && !showMoreForm} key={form}>
                                <Button available={checkAvailability(medicine.salt_forms_json[form])} selected={selectedForm === form} btnValue={form} updateState={setSelectedForm} />
                            </div>
                        )}
                        {medicine.available_forms.length > 4 && <p onClick={() => setShowMoreForm(!showMoreForm)} className="p-3 font-semibold text-[#204772] text-sm cursor-pointer absolute -bottom-3 -right-14" >{showMoreForm ? "hide..." : "more..."}</p>}
                    </div>
                </div>
                <div className="w-full flex justify-between p-5">
                    <p className="w-[120px] text-left">Strength:</p>
                    <div className="grid w-[70%] grid-cols-2 relative gap-2 pr-2">
                        {saltformArr.length !== 0 && saltformArr.map((strength, i) => (
                            <div hidden={i > 3 && !showMoreStrength} key={strength.strength}>
                                <Button btnValue={strength.strength} available={checkAvailability(strength)} selected={selectedStrength === strength.strength} updateState={setSelectedStrength} />
                            </div>
                        ))}
                        {saltformArr.length > 4 && <p onClick={() => setShowMoreStrength(!showMoreStrength)} className="p-3 font-semibold text-[#204772] text-sm cursor-pointer absolute -bottom-3 -right-14 ">{showMoreStrength ? "hide..." : "more..."}</p>}
                    </div>
                </div>
                <div className="w-full flex justify-between p-5 ">
                    <p className="w-[120px] text-left">Packaging:</p>
                    <div className="w-[70%]  grid grid-cols-2 relative gap-2 pr-2">
                        {packagesArr.length !== 0 && packagesArr.map((pack, i) => (
                            <div hidden={i > 3} key={pack.packing}>
                                <Button form={true} btnValue={pack.packing} click={i===0} selected={selectedPacking === pack.packing} available={checkAvailability(pack)} updateState={setSelectedPacking} />
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <div className="w-[40%] flex flex-col items-center justify-center">
                <h1 className="text-lg font-semibold whitespace-pre-wrap break-words">{medicine.salt}</h1>
                <p className="text-[#204772] text-sm"><span>{selectedForm ? selectedForm : "not selected"}</span> | <span>{selectedStrength ? selectedStrength : "select strength"} </span> | <span>{selectedPacking ? selectedPacking : "select package"}</span></p>
            </div>
            <div className="w-[250px] flex items-center justify-center">
                {available && price ?
                    <h1 className="text-3xl text-[#204772] font-bold">From ₹{price && price}</h1>
                    :
                    <div className="mx-5 p-5 rounded-lg  font-normal text-sm my-4 text-center flex justify-between items-center bg-white border border-[#A7D6D4]">
                        <p>No stores selling this product near you</p>
                    </div>
                }
            </div>
        </div>
    );
};

export default Results;