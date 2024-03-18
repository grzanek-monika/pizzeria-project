import { select, classNames, templates } from "../settings.js";
import utils from "../utils.js";
import AmountWidget from "./AmountWidget.js";

class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
      console.log('new Product: ', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      console.log('thisProductInRender: ', thisProduct);
      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      console.log('generatedHTML: ', generatedHTML);
      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
      console.log('menuContainer:', menuContainer);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      console.log('form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      console.log('formInputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    
    initAccordion() {
      const thisProduct = this;
          /* find the clickable trigger (the element that should react to clicking) */
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('clickableTrigger: ', clickableTrigger);
      console.log('thisProduct.element: ',thisProduct.element);
      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct != null && activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        console.log('activeProduct: ', activeProduct);
      });
    }

    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
      
    }

    processOrder() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData: ', formData);
      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log('paramsy: ', paramId, param);
        console.log('formData[paramId]: ', formData[paramId]);
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          const optionImage = thisProduct.imageWrapper.querySelector(`.${paramId}-${optionId}`);
          console.log('opcje: ', optionId, option);
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
            if(optionSelected) {
              if(!option.default) {
                price += option.price;
                console.log('dodanie składnika: ', option.price);               
              }         
            } 
            else if(option.default) {
                price -= option.price;
                console.log('price: ', price);
            }      

            if(optionImage) {
              if(optionSelected) {
                optionImage.classList.add(classNames.menuProduct.imageVisible);
              } else if(!optionSelected) {
                optionImage.classList.remove(classNames.menuProduct.imageVisible);
              }
            }
          }
         
        }

      /* assign price to property priceSingle in thisProduct */
      thisProduct.priceSingle = price;
      /*multiply price by amount */
      price *= thisProduct.amountWidget.value;
      console.log('singlePrice:', thisProduct.priceSingle);
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;    
    }

    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      })
    }

    addToCart() {
      const thisProduct = this;
      // app.cart.add(thisProduct.prepareCartProduct());

      const event = new CustomEvent('add-to-cart', {
      bubbles: true, 
      detail: {
        product: thisProduct.prepareCartProduct()
      }
      });
      thisProduct.element.dispatchEvent(event);
    }

    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.amountWidget.value * thisProduct.priceSingle,
        params: thisProduct.prepareCartProductParams()
      };
      console.log('show productSummary: ', productSummary);
      return productSummary;
      
    }

    prepareCartProductParams() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData: ', formData);
      const params = {};

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log('paramsy z koszyka: ', paramId, param);
        console.log('formData[paramId] koszyk: ', formData[paramId]);
        // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
        params[paramId] = {
          label: param.label,
          options: {}
        }

        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          
          console.log('opcje wybranego produktu: ', optionId, option);
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
            if(optionSelected) {
              params[paramId].options[optionId] =  option.label;
            } 
        }
      }
      return params;
    }
  }

  export default Product;