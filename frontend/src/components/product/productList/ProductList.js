import React, { useEffect, useState } from "react";
import Search from "../../search/Search";
import { SpinnerImg } from "../../loader/Loader";
import { Link } from "react-router-dom";
import {AiOutlineEye} from 'react-icons/ai';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import {deleteProduct, getProducts} from '../../../redux/features/product/productSlice'
import { FILTER_PRODUCTS, selectFilteredProducts } from "../../../redux/features/product/filterSlice";
import ReactPaginate from 'react-paginate'; // use to show the list of product that how much will show in one row
import {confirmAlert} from 'react-confirm-alert'; // screen will pop up to do something like delete
import "react-confirm-alert/src/react-confirm-alert.css";
import  './ProductList.scss'

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text && text.length > n) {
      const shortenedYText = text.substring(0, n).concat("...");
      return shortenedYText;  
    }
    return text;
  };

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id))
    await dispatch(getProducts())
  }

  const confirmDelete = (id) => {
    confirmAlert({
        title: "Delete Product",
        message: "Are you sure you want to delete this product",
        buttons: [
            {
                label: "Delete",
                onClick: () => delProduct(id),
            },
            {
                label: "Cancel",
            },
        ],
    });
  };

  // Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffSet, setItemOffSet] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffSet = itemOffSet + itemsPerPage
    setCurrentItems(filteredProducts.slice(itemOffSet, endOffSet));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffSet, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffSet = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffSet(newOffSet)
  };

//   End pagination

useEffect(() => {
  dispatch(FILTER_PRODUCTS({products, search}));
}, [products, search, dispatch]);

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>
                        {"$"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"$"}
                        {price * quantity}
                      </td>
                      <td className="icons"> 
                         <span>
                            <Link to={`/product-detail/${_id}`}>
                                <AiOutlineEye size={25} color={"purple"}/>
                            </Link>
                         </span>
                         <span>
                            <Link to={`/edit-product/${_id}`}>
                                <FaEdit size={20} color={"green"}/>
                            </Link>
                         </span>
                         <span>
                          <FaTrashAlt size={20} color={"red"}
                          onClick={() => confirmDelete(_id)}
                          />
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"

        />
      </div>
    </div>
  );
};

export default ProductList;
