 import {settings, select, classNames} from "./settings.js";
 import Product from "./components/Product.js";
 import Cart from "./components/Cart.js";
 import Booking from "./components/Booking.js";
 import Home from "./components/Home.js";
 
const app = {
  initPages: function(){
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    
    // eslint-disable-next-line no-unused-vars
    let pageMatchingHash = thisApp.pages[0].id;
    thisApp.activatePage(pageMatchingHash);


    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page from href attribute */
          const id = clickedElement.getAttribute('href').replace('#', '');
        /* run thisApp.activatePage with that id */
          thisApp.activatePage(id);
        /* change url hash */
          window.location.hash = '#/' + id;
      })
    }
  },
  activatePage: function(pageId){
    const thisApp = this;
    /* add class 'active' to matching pages and remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class 'active' to matching links and remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initMenu: function() {
      const thisApp = this;
      console.log('thisApp.data1: ', thisApp.data);
      for(let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },
    initData: function() {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse) {
          console.log('parsedResponse', parsedResponse);
          /* save parsedResponse as thisApp.products */
          thisApp.data.products = parsedResponse;
          /* execute initMenu method */
          thisApp.initMenu();
        });

        console.log('thisApp.data: ', JSON.stringify(thisApp.data));
    },
    initCart: function() {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event) {
        app.cart.add(event.detail.product);
      })
    }, 
    initBooking: function(){
      const thisApp = this;
      const bookingWrapper = document.querySelector(select.containerOf.booking);
      thisApp.booking = new Booking(bookingWrapper);
    },
    initHome: function(){
      const thisApp = this;
      const homeWrapper = document.querySelector(select.containerOf.home);
      thisApp.home = new Home(homeWrapper);
      
      thisApp.home.homeLinkBox = document.querySelectorAll(select.home.linkOfBox);
      console.log('homeLinkBox:', thisApp.home.homeLinkBox);
      for(let linkBox of thisApp.home.homeLinkBox) {
        console.log('linkBox:', linkBox);
        linkBox.addEventListener('click', function(event){
          event.preventDefault();
          const clickedElement = this;
          console.log('clickedElementHome', clickedElement);
          const newId = clickedElement.getAttribute('href').replace('#', '');
          thisApp.activatePage(newId);
          window.location.hash = '#/' + newId;
        })
      } 
    }, 
    init: function(){
      const thisApp = this;
      thisApp.initPages();
      thisApp.initData();
      thisApp.initCart();
      thisApp.initBooking();
      thisApp.initHome();
    },
  };

app.init();

