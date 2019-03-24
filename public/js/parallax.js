
/**
 * Da chiamare con initParallax.call(document.querySelector('.parallax'));
 */
class Parallax {
  static initParallax() {
    let updateParallax = (initial = false) => {
      const windowWidth = window.innerWidth;
      let containerHeight;
      const elBcr = this.getBoundingClientRect();
      const img = this.querySelector('img');
  
      if (initial) {
        img.style.display = 'block';
      }
  
      const imgBcr = img.getBoundingClientRect();
    
      if (windowWidth < 601) {
        containerHeight = elBcr.height > 0 ? elBcr.height : imgBcr.height;
      } else {
        containerHeight = elBcr.height > 0 ? elBcr.height : 500;
      }
    
      const imgHeight = imgBcr.height;
      const parallaxDist = imgHeight - containerHeight;
      const {pageYOffset} = window;
      const top = elBcr.top + pageYOffset;
      const bottom = top + containerHeight;
      const windowHeight = window.innerHeight;
      const windowBottom = pageYOffset + windowHeight;
      const percentScrolled = (windowBottom - top) / (containerHeight + windowHeight);
      const parallax = Math.round((parallaxDist * percentScrolled));
    
      if ((bottom > pageYOffset) && (top < (pageYOffset + windowHeight))) {
        img.style.transform = `translate3D(-50%, ${parallax}px, 0)`;
      }
    };
    updateParallax = updateParallax.bind(this);
  
    const img = this.querySelector('img');
  
    img.addEventListener('load', () => {
      updateParallax(true);
    }, {once: true});
  
    if (img.complete) {
      const loadEvent = new Event('load');
      img.dispatchEvent(loadEvent);
    }
    
    window.addEventListener('scroll', () => {
      updateParallax();
    });
  
    window.addEventListener('resize', () => {
      updateParallax();
    });
  }
  
  static checkParallax() {
    const parallax = this.shadowRoot.querySelectorAll('.parallax');//document.querySelectorAll('.parallax') || 
    console.log(parallax);
  
    if (parallax) {
      parallax.forEach(prx => {
        Parallax.initParallax.call(prx);
      });
    }
  }
}

export default Parallax;
