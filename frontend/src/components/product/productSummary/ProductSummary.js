import React, { useEffect } from 'react';
import InfoBox from "../../infoBox/InfoBox";
import {AiFillDollarCircle} from 'react-icons/ai';
import {BsCart4, BsCartX} from 'react-icons/bs';
import {BiCategory} from 'react-icons/bi';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectOutOfStock, 
    selectCategory, 
    CALC_STORE_VALUE, 
    CALC_OUTOFSTOCK, 
    CALC_CATEGORY,
    selectTotalStoreValue
} from "../../../redux/features/product/productSlice";
import './ProductSummary.scss'


// Icons
const earningIcon= <AiFillDollarCircle size={40} color='#fff'/> 
const productIcon= <BsCart4 size={40} color='#fff'/> 
const categoryIcon= <BiCategory size={40} color='#fff'/> 
const outOfStockIcon= <BsCartX size={40} color='#fff'/> 

// Format Amount
// x is argument and return a formatted string of number with commas like 100000 to 100,000
export const formatNumbers = (x) => { 
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // x.toString method will convert number to string to use the replace method()
    // It takes a number and returns a formatted string with commas for thousands separators.
  };
  

const ProductSummary = ({products}) => {
    const dispatch = useDispatch();
    const totalStoreValue = useSelector(selectTotalStoreValue);
        // console.log("summaryTotalStoreValue", totalStoreValue)
    const outOfStock = useSelector(selectOutOfStock);
    const category = useSelector(selectCategory);

    useEffect(() => {
        dispatch(CALC_STORE_VALUE(products))
        dispatch(CALC_OUTOFSTOCK(products))
        dispatch(CALC_CATEGORY(products))        
    }, [dispatch, products]);

    return (
    <div className='product-summary'>
        <h3 className='--mt'>Inventory Stats</h3>
        <div className='info-summary'>

            <InfoBox
            icon={productIcon}
            title={"Total Products"}
            count={products.length}
            bgColor="card1"
            />
            
            <InfoBox
            icon={earningIcon}
            title={"Total Store Value"}
            count={`$${formatNumbers(totalStoreValue.toFixed(2))}`}
            // The toFixed(2) method is used to ensure that the number has exactly two digits after the decimal point.
            bgColor='card2'
            />
            
            <InfoBox
            icon={outOfStockIcon}
            title={"Out Of Stock"}
            count={outOfStock}
            bgColor='card3'
            />

            <InfoBox
            icon={categoryIcon}
            title={"All Categories"}
            count={category.length}
            bgColor='card4'
            />
            
        </div>
    </div>
  );
};

export default ProductSummary
