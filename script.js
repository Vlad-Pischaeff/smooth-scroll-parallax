const math = {
    // map number x from range [a, b] to [c, d]
    map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
    // linear interpolation
    lerp: (a, b, n) => (1 - n) * a + n * b
}

const config = {}

class Item {
  constructor(el) {

    this.DOM = {
      el: el,
      wrap: el.querySelector('.item__img-wrap'),
      img: el.querySelector('.item__img'),
    }

    this.scale = 0
    this.isVisible
  
    this.init()
  }
  
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0)
    })
    this.observer.observe(this.DOM.el);
  }
}


class SmoothScroll {

  constructor() {
    this.bindMethods()
    
    this.data = {
      ease: 0.05,
      current: 0,
      last: 0
    }

    this.DOM = {
      main: document.querySelector('main'),
      content: document.querySelector('.content'),
    }

    this.items = []
    this.trigger = false
    this.rAF

    this.init()
  }
  
  run() {
    this.data.last = math.lerp(this.data.last, this.data.current, this.data.ease)
    const diff = this.data.current - this.data.last
    let backlash = diff > 0 ? diff : -diff
    
    this.items.forEach(item => {
      if (item.isVisible) 
        item.scale += diff/300
        item.DOM.img.style.transform = `translateY(${item.scale}px)`
    })

    this.DOM.content.style.top = `-${this.data.last}px`
    
    if (backlash < 0.05) {
       this.trigger = false
    }

    if (this.trigger) {
      this.rAF = requestAnimationFrame(this.run)
    }
  }
  
  bindMethods() {
    ['scroll', 'resize', 'run']
    .forEach((fn) => this[fn] = this[fn].bind(this))
  }
  
  setHeight() {
    document.body.style.height = `${this.DOM.content.offsetHeight}px`
    config.height = window.innerHeight
    config.width = window.innerWidth
  }

  resize() {
    this.setHeight()
    this.scroll()
  }
  
  scroll() {
    this.data.current = window.scrollY
    if (!this.trigger) {
      this.trigger = true
      this.run()
    }
  }
  
  selectItems() {
    document.querySelectorAll('.item')
      .forEach(item => this.items.push(new Item(item)))
  }
  
  init() {
    this.addEvents()
    this.setHeight()
    this.selectItems()
  }
  
  addEvents() {
    window.addEventListener('resize', this.resize, { passive: true })
    window.addEventListener('scroll', this.scroll, { passive: true })
  }
}

new SmoothScroll()