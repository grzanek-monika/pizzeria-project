import utils from "../utils.js";
import { classNames, select, templates } from "./../settings.js";

class Home {
    constructor(element){
        const thisHome = this;
        thisHome.render(element);
        thisHome.getElements(element);
        thisHome.initCarousel();
        thisHome.initActions();
        
    }

    render(element){
        const generatedHTML = templates.homePage();
        const generatedDOM  = utils.createDOMFromHTML(generatedHTML);
        element.appendChild(generatedDOM);
        console.log('homeElement:', element);
    }

    getElements(element){
        const thisHome = this;
        thisHome.favoriteImages = [];
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.dom.carousel = element.querySelector(select.home.carousel);
        thisHome.dom.favorite = element.querySelectorAll(select.home.favoriteSign);
        thisHome.dom.share = element.querySelectorAll(select.home.shareSign);
        console.log('thisHome.dom.share', thisHome.dom.shareSign);
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

    initActions(){
        const thisHome = this;
        for(let favorite of thisHome.dom.favorite){
            favorite.addEventListener('click', function(event){
                thisHome.initFavoriteImage(event);
            })
        }     
        
        for(let share of thisHome.dom.share) {
            share.addEventListener('click', function(event){
                thisHome.initShare(event);
            })
        }
    }

    initFavoriteImage(event){
        const thisHome = this;
        event.preventDefault();
        const clickedElement = event.target;
        console.log('homeClickedElement', clickedElement);
        const attribute = clickedElement.getAttribute('data-id');
        console.log('attribute', attribute)
        if(thisHome.favoriteImages[attribute]){
            clickedElement.classList.remove(classNames.home.favorite);
            const attributeToRemove = thisHome.favoriteImages.indexOf(attribute);
            thisHome.favoriteImages.splice(attributeToRemove, 1);
        } else {
            clickedElement.classList.add(classNames.home.favorite);
            thisHome.favoriteImages.push(attribute);
        }
        console.log('favoriteImages', thisHome.favoriteImages)
    }

    initShare(event){
        event.preventDefault();
        alert('Thank you for sharing!')
    }
}

export default Home;