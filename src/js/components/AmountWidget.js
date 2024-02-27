class AmountWidget{
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(settings.amountWidget.defaultValue);
      thisWidget.initActions();
      console.log('AmoundWidget: ', thisWidget);
      console.log('constructor arguments: ', element);
    }

    getElements(element) {
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);

    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      /* Add validation */
      if(settings.amountWidget.defaultValue !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        settings.amountWidget.defaultValue = newValue;
      } 
      thisWidget.input.value = settings.amountWidget.defaultValue;

      thisWidget.announce();
     
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
        thisWidget.setValue(settings.amountWidget.defaultValue - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event) {
        event.preventDefault();
        thisWidget.setValue(settings.amountWidget.defaultValue + 1);
      })
    }
  }