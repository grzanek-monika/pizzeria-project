import { select, settings, templates, classNames } from "../settings.js";
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
        thisBooking.selectedTables = {};
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = [];
        thisBooking.dom.wrapper = element;
        console.log('generatedHTMLBook', thisBooking.dom.wrapper);
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);
        thisBooking.dom.tablesWrapper = element.querySelector(select.containerOf.tableWrapper);
    }

    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidgets(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidgets(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        //thisBooking.peopleAmount.addEventListener('updated', function(){});
        //thisBooking.hoursAmount.addEventListener('updated', function(){});
        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.removeTables();
            thisBooking.updateDOM();
        });
        thisBooking.dom.tablesWrapper.addEventListener('click', function(event){
            event.preventDefault();
            console.log('event:', event);
            
            thisBooking.initTables(event);
        });
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
        for(let item of bookings){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }
        for(let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }
        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;
        for(let item of eventsRepeat){
            if(item.repeat == 'daily'){
                for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }
        console.log('thisBooking.booked: ', thisBooking.booked);
        thisBooking.updateDOM();    
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

    updateDOM(){
        const thisBooking = this;
        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
        let allAvailable = false;

        if(
            typeof thisBooking.booked[thisBooking.date] == 'undefined' 
            || 
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
            allAvailable = true;
        }
        for(let table of thisBooking.dom.tables) {
            let tableId  = table.getAttribute(settings.booking.tableIdAttribute);
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }
            if(!allAvailable
            && 
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    initTables(event) {
        const thisBooking = this;
        const clickedElement = event.target;
        console.log('clickedElement:', clickedElement);
        const attribute = clickedElement.getAttribute(settings.booking.tableIdAttribute);
        const isBooked = clickedElement.classList.contains(classNames.booking.tableBooked);
        const isSelected = clickedElement.classList.contains(classNames.booking.selected);

        if(attribute){
            if(isBooked){
                alert('This table is booked!');
            } else if(isSelected){
                //thisBooking.removeTables();
                clickedElement.classList.remove(classNames.booking.selected);
                thisBooking.selectedTables = {};
            } else if(!isSelected){
                clickedElement.classList.toggle(classNames.booking.selected);
                thisBooking.selectedTables = attribute;
            }
        }
        console.log('selectedTable',this.selectedTables);
    }

    removeTables(){
        const selectedTables = document.querySelectorAll(select.booking.selectedTable);
    
        for(let selectedTable of selectedTables){
          selectedTable.classList.remove(classNames.booking.selected);
        }
    }
}

export default Booking;