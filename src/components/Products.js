import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const {enqueueSnackbar} = useSnackbar();

  const [isFetched, setIsFetched] = useState(false);
  const [product, setProduct] = useState("");
  const [timer, setTimer] = useState(null);
  const [searchText, setSearchText] = useState("");
  // const [data, setData] = useState("")

  useEffect(() => {
    performAPICall();
    console.log(product);
  }, []);

  const performAPICall = async () => {

    try {
      setIsFetched(false);
      let productsData = await axios.get(`${config.endpoint}/products`);
      console.log(productsData.data);
      setProduct(productsData.data);
      setIsFetched(true);

    } catch(error) {
      // setIsFetched(false);
      console.log(error.response.status);
      setIsFetched(false);

      if(error.response.status === 404) {
      // setIsFetched(false);
        enqueueSnackbar(error.response.statusText, {variant: "error"});
      } else {
        // setIsFetched(true);
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"})
      }
      console.log(isFetched);
    }
  };
  
  // const product = {
  //     "name":"Tan Leatherette Weekender Duffle",
  //     "category":"Fashion",
  //     "cost":150,
  //     "rating":4,
  //     "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //     "_id":"PmInA797xJhMIPti"
  //     }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  
  const performSearch = async (text) => {

    try {
      let searchAPI = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      console.log(searchAPI);
      setProduct(searchAPI.data);
      console.log(product);

    } catch(error) {
      console.log(error.response);
      if(error.response.status === 404) {
        setProduct([""]);
        enqueueSnackbar(error.response.statusText, {variant: "error"});
      } else {
        // setIsFetched(true);
        console.log(product);
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"})
      }
    }
    console.log(product);

  };

  // useEffect(() => {
  //   setProduct(data);
  // }, []);
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
    // useEffect(() => {
    //   const debounceFunc = setTimeout(() => {
    //     performSearch(searchText);
    //     console.log("debounced")
    //   }, 1500);
    //   return () => clearTimeout(debounceFunc);
    // }, [searchText]);

    const debounceSearch = (event, debounceTimeout) => {
      let text = event.target.value;
      setSearchText(text);
      if(timer !== 0) {
        clearTimeout(timer);
      }
       const newTimer = setTimeout(() => {
        performSearch(text);
       }, debounceTimeout);

       setTimer(newTimer);
    };
    
  return (
    <div>
      <Header children={<TextField
        className="search-desktop"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value = {searchText}
        onChange={(e) => debounceSearch(e, 500)}
      />} hasHiddenAuthButtons={false}>

        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value = {searchText}
        onChange={(e) => debounceSearch(e, 500)}
      />

      <Grid container>
        <Grid item container spacing={2} xs={12} md={9}>
         <Grid item className="product-grid" >
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
         {isFetched ?
          <Grid item container spacing={2} className="products">
            {product.map((item) => {
              // console.log(item);
              return item ? <Grid item key={item._id} xs={6} md={3}><ProductCard product={item} /></Grid> : 
              <div className="loading"><SentimentDissatisfied />No products found</div>
            }
            )}
          </Grid>
         : <div className="loading"><CircularProgress />Loading Products...</div>
         }
        </Grid>
        <Grid item container 
          direction="column" 
          justifyContent="flex-start" 
          alignItems="center" 
          xs={12} md={3} 
          className="cart">
            <Grid className="inside-cart">Cart is empty. Add more items to the cart to checkout.</Grid>
        </Grid>
      </Grid>
      
      <Footer />
    </div>
  );
};

export default Products;
