import React, { useState, useEffect } from "react";
import { GetItems } from "../routes/laf-routes";

const LostAndFoundPage = () => {
    const [allItems, setAllItems] = useState();
    const [filterItems, setFilterItems] = useState();

    useEffect(() => {
        GetItems((result) =>{
            setAllItems(result);
            setFilterItems(result);
        })
    }, []);

    // const filterItems= () => {

    // }

  return <div className="w-full h-screen b-test-red"></div>;
};

export default LostAndFoundPage;
