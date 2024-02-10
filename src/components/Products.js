import { Search, SentimentDissatisfied, ShoppingCartOutlined } from "@mui/icons-material";
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
import { generateCartItemsFrom, Cart, ItemQuantity } from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {

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
  // let token = localStorage.getItem("token");
  const [isFetched, setIsFetched] = useState(false);
  const [products, setProducts] = useState([]);
  const [timer, setTimer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    performAPICall()
  }, []);

  const performAPICall = async () => {

    try {
      setIsFetched(false);
      let productsData = await axios.get(`${config.endpoint}/products`);
      console.log(productsData.data);
      setProducts(productsData.data);
      console.log(products);
      setIsFetched(true);

    } catch(error) {
      // setIsFetched(false);
      console.log(error.response.status);
      setIsFetched(false);

      if(error.response.status === 404) {
        enqueueSnackbar(error.response.statusText, {variant: "error"});
      } else {
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
      setProducts(searchAPI.data);
      console.log(products);

    } catch(error) {
      console.log(error.response);
      if(error.response.status === 404) {
        setProducts([""]);
        enqueueSnackbar(error.response.statusText, {variant: "error"});
      } else {
        // setIsFetched(true);
        console.log(products);
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: "error"})
      }
    }
    console.log(products);
  };

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
    /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
      let cartAPI = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(cartAPI.data);
      return cartAPI.data;
      
    } catch (e) {

      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  let token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart(token)
      .then((cartsData) => generateCartItemsFrom(cartsData, products))
      .then((cartItems) => setItems(cartItems));
  }, [products]);


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    
    const match = items.find((item) => item.productId === productId);
    // console.log(match);
    return match;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if(!token) {
      enqueueSnackbar('Please log in to add items to the cart', {variant: 'warning'});
      return;
    }

    if(options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.', {variant:'warning'});
      return;
    }

    try {
      const postCartItem = await axios.post(`${config.endpoint}/cart`, {productId, qty}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const cartItems = generateCartItemsFrom(postCartItem.data, products);
      setItems(cartItems);
      console.log(items);

    } catch(error) {
      if(error.response) {
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
      } else {
        enqueueSnackbar('Could not fetch the products. Check if the product is running.', {variant: 'error'})
      }
    }
  };
  
  const displayCart = async () => {
    
    <Box display="flex" alignItems="flex-start" padding="1rem">
        <Box className="image-container">
            <img
                // Add product image
                src=""
                // Add product name as alt eext
                alt=""
                width="100%"
                height="100%"
            />
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
        >
            <div>{/* Add product name */}</div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
            <ItemQuantity
            // Add required props by checking implementation
            />
            <Box padding="0.5rem" fontWeight="700">
                ${/* Add product cost */}
            </Box>
            </Box>
        </Box>
    </Box>
  }

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
    {localStorage.getItem("token") ?
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
            {products.map((item) => {
              // console.log(item);
              return item ? <Grid item key={item._id} xs={6} md={3}>
                <ProductCard 
                product={item} 
                handleAddToCart={() => addToCart(token, items, products, item._id, 1, {preventDuplicate: true})} />
                </Grid> : 
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
            className="cart-grid"
          ><Cart
            products={products}
            items={items}
            handleQuantity={addToCart}/>
        </Grid>
      </Grid> : 
      <Grid container spacing={2} direction="column">
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
              {products.map((item) => {
                // console.log(item);
                return item ? <Grid item key={item._id} xs={6} md={3}>
                  <ProductCard 
                  product={item} 
                  handleAddToCart={() => addToCart(token, items, products, item._id, 1, {preventDuplicate: true})} />
                  </Grid> : 
                <div className="loading"><SentimentDissatisfied />No products found</div>
              }
              )}
            </Grid>
          : <div className="loading"><CircularProgress />Loading Products...</div>
          }
      </Grid>}
      
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Footer />
    </div>
  );
};

export default Products;
