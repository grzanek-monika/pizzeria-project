import { select, settings } from "../settings.js";
import BaseWidget from "./BaseWidget.js";

class AmountWidget extends BaseWidget {
    constructor(element) {
      super(element, settings.amountWidget.defaultValue);
      const thisWidget = this;
      /*thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);*/
      thisWidget.initActions();
      console.log('AmoundWidget: ', thisWidget);
      console.log('constructor arguments: ', element);
    }

    getElements() {
      const thisWidget = this;
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

    }

    setValue(value) {
      const thisWidget = this;
      const newValue = thisWidget.parseValue(value);
      /* Add validation */
      if(thisWidget.value !== newValue && thisWidget.isValid(newValue)) {
        thisWidget.value = newValue;
      } 
      thisWidget.input.value = thisWidget.value;

      thisWidget.announce();
     
    }
    parseValue(value){
      return parseInt(value);
    }

    isValid(value){
      return !isNaN(value) && value >= settings.amountWidget.defaultMin && value <= settings.amountWidget.defaultMax;
    }

    announce() {
      const thisWidget = this;
      const event = new Event('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }

    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      })
    }
  }

  export default AmountWidget;