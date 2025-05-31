import "../assets/style.css";
import LocalStorage from "../utils/storage";

LocalStorage.createLocalArr("localCartArr");
LocalStorage.createLocalArr("localFavoritesArr");

import HomeController from "../mvc/home/homeController";
import HomeModel from "../mvc/home/homeModel";
import HomeView from "../mvc/home/homeView";

const homeController = new HomeController(new HomeModel(), new HomeView());
homeController.init();
