import { select, templates } from "../settings.js";
import AmountWidgets from "./AmountWidget.js"

class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        console.log('generatedHTMLBook', thisBooking.dom.wrapper);
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    }

    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidgets(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidgets(thisBooking.dom.hoursAmount);
        //thisBooking.peopleAmount.addEventListener('updated', function(){});
        //thisBooking.hoursAmount.addEventListener('updated', function(){});
    }
}

export default Booking;