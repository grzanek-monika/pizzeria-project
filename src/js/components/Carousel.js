class Carousel{
    constructor(element){
        const thisCarousel = this;
        thisCarousel.render(element);
        thisCarousel.initPlugin();
    }

    render(element){
        const thisCarousel = this;
        console.log(element)
        console.log(thisCarousel)
        // save element ref to this obj
    }

    initPlugin(){
        const thisCarousel = this;
        console.log(thisCarousel)
        // use plugin to create carousel on thisCarousel.element
    }
}

export default Carousel;