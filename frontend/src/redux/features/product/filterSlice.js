import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filteredProducts : [],
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        FILTER_PRODUCTS(state, action){
            const { products, search } = action.payload;
            if(!search){
                state.filteredProducts = products;
            }else{
            const tempProducts = products.filter(
                (product) =>  
                 (product &&
                product.name &&
                product.category &&
                (product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase()) 
            )));
            state.filteredProducts = tempProducts;
            // return { ...state, filteredProducts: tempProducts };
        }
        },
    },
}) ;

export const { FILTER_PRODUCTS } = filterSlice.actions;

export const selectFilteredProducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer;