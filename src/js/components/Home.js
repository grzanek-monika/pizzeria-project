import utils from "../utils.js";
import { select, templates } from "./../settings.js";

class Home {
    constructor(element){
        const thisHome = this;
        thisHome.render(element);
        thisHome.getElements(element);
        thisHome.initCarousel();
        
    }

    render(element){
        const generatedHTML = templates.homePage();
        const generatedDOM  = utils.createDOMFromHTML(generatedHTML);
        element.appendChild(generatedDOM);
        console.log('homeElement:', element);
    }

    getElements(element){
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.carousel = element.querySelector(select.home.carousel);
        console.log('carousel:', thisHome.dom.carousel);
    }

    initCarousel(){     
        const thisHome = this;
        const options = {
            cellAlign: 'left',
            contain: true,
            autoPlay: true,
            wrapAround: true
        };
        // eslint-disable-next-line no-undef
        new Flickity(thisHome.dom.carousel, options);
    }
}


export default Home;