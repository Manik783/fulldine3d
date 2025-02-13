import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./pages_menu/menu";
import AddDish from "./pages_admin/adddish";
import Login from "./pages_admin/Login";
import Dashboard from "./pages_admin/dashboard";
import Addrestaurant from "./pages_admin/addrestaurant";
import ClientLogin from "./pages_client/ClientLogin";
import RestaurantPage from "./pages_menu/restaurant_page";
import RestaurantDishes from "./pages_admin/restaurantdishes";
import EditDish from "./pages_admin/EditDish";
import AdminControl from "./pages_admin/admincontrol";
import AddAdmin from "./pages_admin/addadmin";
import DishInfo from "./pages_menu/dishinfo";
import RestaurantDetails from "./pages_admin/restaurantdetails";
import EditRestaurant from "./pages_admin/EditRestaurant";
import Clientdashboard from "./pages_client/Clientdashboard";
import EditDishClient from "./pages_client/EditDishClient";
import EditRestaurantClient from "./pages_client/editRestaurantClient";
import RestaurantDetailsClient from "./pages_client/restaurantDetailsClient";
import AddDishClient from "./pages_client/adddishclient";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/menu/:rest_id" element={<Menu></Menu>}></Route>
        <Route path="/add_dish/:rest_id" element={<AddDish></AddDish>}></Route>
        <Route
          path="/add_dish_client/:rest_id"
          element={<AddDishClient></AddDishClient>}
        ></Route>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route
          path="/addrestaurant"
          element={<Addrestaurant></Addrestaurant>}
        ></Route>

        <Route
          path="/editrestaurantclient/:rest_id"
          element={<EditRestaurantClient></EditRestaurantClient>}
        ></Route>
        <Route
          path="/clientlogin"
          element={<ClientLogin></ClientLogin>}
        ></Route>
        <Route
          path="/restaurant_page/:rest_id"
          element={<RestaurantPage></RestaurantPage>}
        ></Route>
        <Route
          path="/restaurantdishes/:rest_id"
          element={<RestaurantDishes />}
        />
        <Route
          path="/editdish/:rest_id/:item_id"
          element={<EditDish></EditDish>}
        ></Route>
        <Route
          path="/editdishclient/:rest_id/:item_id"
          element={<EditDishClient></EditDishClient>}
        ></Route>

        <Route
          path="/admincontrol"
          element={<AdminControl></AdminControl>}
        ></Route>
        <Route path="addadmin" element={<AddAdmin></AddAdmin>}></Route>
        <Route path="dishinfo" element={<DishInfo></DishInfo>}></Route>
        <Route
          path="restauantdetails/:rest_id"
          element={<RestaurantDetails></RestaurantDetails>}
        ></Route>
        <Route
          path="restauantdetailsclient/:rest_id"
          element={<RestaurantDetailsClient></RestaurantDetailsClient>}
        ></Route>

        <Route
          path="/editrestaurant/:rest_id"
          element={<EditRestaurant></EditRestaurant>}
        ></Route>
        <Route
          path="/clientdashboard/:rest_id"
          element={<Clientdashboard></Clientdashboard>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
