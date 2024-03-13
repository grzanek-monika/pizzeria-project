import { select, templates } from "./../settings.js";
import utils from "../utils.js";

class Home {
    constructor(element){
        const thisHome = this;
        thisHome.getElements(element);
        thisHome.render(element);
        thisHome.initWidgets();
        thisHome.initCarousel();
        
    }

    getElements(element){
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.carousel = element.querySelector(select.home.carousel);
    }

    render(element){
        const thisHome = this;
        const generatedHTML = templates.homePage(element);
        const generatedDOM = utils.generatedDOM(generatedHTML);
        thisHome.dom.wrapper.appendChild(generatedDOM);
        

    }

    initCarousel(){
        const thisHome = this;
        console.log(thisHome);
        // eslint-disable-next-line no-undef
        const options = {
            cellAlign: 'left',
            contain: true,
            autoPlay: true
          };

          // eslint-disable-next-line no-undef
          return new Flickity('.main-carousel', options);

    }
}

export default Home;