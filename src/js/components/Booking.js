import { select, settings, templates } from "../settings.js";
import AmountWidgets from "./AmountWidget.js"
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
import utils from "../utils.js";

class Booking {
    constructor(element){
        const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();
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
        thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
    }

    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidgets(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidgets(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        //thisBooking.peopleAmount.addEventListener('updated', function(){});
        //thisBooking.hoursAmount.addEventListener('updated', function(){});
    }

    getData(){
        const thisBooking = this;
        const startStateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endStateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
        const params = {
            booking: [
                startStateParam, endStateParam
            ],
            eventsCurrent: [
                settings.db.notRepeatParam, startStateParam, endStateParam
            ],
            eventsRepeat: [
                settings.db.repeatParam, endStateParam

            ]
        };
        console.log('getData params: ', params);

        const urls = {
            booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
            eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
        }
        console.log('urls: ', urls);

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function(allResponses){
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]) 
            })
            .then(function([bookings, eventsCurrent, eventsRepeat]){
                //console.log('bookings: ', bookings);
                console.log('eventsCurrent: ', eventsCurrent);
                //console.log('eventsRepeat: ', eventsRepeat);
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            })
    }
    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;
        thisBooking.booked = {};
        for(let item of eventsCurrent){

            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }
        console.log('thisBooking.booked: ', thisBooking.booked);
    }

    makeBooked(date, hour, duration, table){
        const thisBooking = this;
        if(typeof thisBooking.booked[date] == 'undefined'){
            thisBooking.booked[date] = {};
        }
        
        const startHour = utils.hourToNumber(hour);

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
            if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
                thisBooking.booked[date][hourBlock] = [];
            }
            thisBooking.booked[date][hourBlock].push(table);
        }
    }

}

export default Booking;