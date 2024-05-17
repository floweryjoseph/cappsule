export const checkAvailability = (obj) => {
    let availability = false;
    for (let i in obj) {
        if (typeof obj[i] === "object") {
            if (availability) return true;
            availability = checkAvailability(obj[i]);
        } else {
            if (i === "pharmacy_id") {
                return true;
            }
        }
    }
    return availability;
}



export const findLowestSellingPrice = (data) => {
    let lowestPrice = Infinity;

    for (const dosage in data) {
        for (const pack in data[dosage]) {
            for (const pharmacyPrice of Object.values(data[dosage][pack])) {
                if (pharmacyPrice && Array.isArray(pharmacyPrice)) {
                    for (const priceInfo of pharmacyPrice) {
                        if (priceInfo.selling_price && priceInfo.selling_price < lowestPrice) {
                            lowestPrice = priceInfo.selling_price;
                        }
                    }
                }
            }
        }
    }

    return lowestPrice;
}