class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
      console.log('new Cart: ', thisCart);
    }

    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger =  element.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = element.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
      thisCart.dom.form = element.querySelector(select.cart.form);
      thisCart.dom.address = element.querySelector(select.cart.address);
      thisCart.dom.phone = element.querySelector(select.cart.phone);
      console.log('dom:', thisCart.dom);
    }

    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(event) {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisCart.sendOrder();
      })
    }

    add(menuProduct) {
      const thisCart = this;
      console.log('adding product', menuProduct);
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      console.log('generatedDOM: ', generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('zapisane podsumowanie: ', thisCart.products);
      thisCart.update();
    }

    update() {
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      let subtotalPrice = 0;
      thisCart.totalPrice = 0;
      
      for(let product of thisCart.products) {
        thisCart.totalNumber += product.amount;
       subtotalPrice += product.price;
      }
      if(thisCart.totalNumber && thisCart.totalNumber > 0) {
        thisCart.totalPrice = subtotalPrice + thisCart.deliveryFee;
        thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

      } else {
        thisCart.totalPrice = subtotalPrice;
        thisCart.dom.deliveryFee.innerHTML = 0;
      }
      for(let price of thisCart.dom.totalPrice){
        price.innerHTML = thisCart.totalPrice;
      }

      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
      console.log('cena wysyłki: ', thisCart.deliveryFee);
      console.log('cena produktów: ', subtotalPrice);
      console.log('ilość produktów: ', thisCart.totalNumber);
      console.log('cena zamówienia: ', thisCart.totalPrice);
    }

    remove(productToRemove) {
      const thisCart = this;
      productToRemove.dom.wrapper.remove();
      const elementToRemove = thisCart.products.indexOf(productToRemove);
      thisCart.products.splice(elementToRemove, 1);
      thisCart.update()
    }

    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.totalPrice - thisCart.deliveryFee,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: []
      
      }
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }      
      console.log('payload: ', payload);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      

      fetch(url, options);
    }
  }