
let cards = (function() {
  //The global options
  let opt = {
    cardSize: {
      width: 70,
      height: 95.5,
      padding: 30
    },
    animationSpeed: 500,
    table: 'body',
    cardback: 'red',
    cardsUrl: 'img/cards.png',
  };
  let zIndexCounter = 1;
  let all = []; //All the cards created.




  function mouseEvent(ev) {
    let card = $(this).data('card');
    if (card.container) {
      let handler = card.container._click;
      if (handler) {
        handler.func.call(handler.context || window, card, ev);
      }
    }
  }




  function init(options) {
    if (options) {
      for (let i in options) {
        if (opt.hasOwnProperty(i)) {
          opt[i] = options[i];
        }
      }
    }

    opt.table = $(opt.table)[0];

    if ($(opt.table).css('position') === 'static') {
      $(opt.table).css('position', 'relative');
    }



    // add 0 card (one each color)
    all.push(new Card('r', 0, opt.table));
    all.push(new Card('b', 0, opt.table));
    all.push(new Card('g', 0, opt.table));
    all.push(new Card('y', 0, opt.table));

    // add 1-9 card, +2, skip, reverse (two each color)
    for ( let t = 0; t < 2 ; t++){
      for (let i = 1; i <= 12; i++) {
        all.push(new Card('r', i, opt.table));
        all.push(new Card('b', i, opt.table));
        all.push(new Card('g', i, opt.table));
        all.push(new Card('y', i, opt.table));
      }
    }

    for ( let t = 0; t < 4; t++) {
      all.push (new Card('w', -1, opt.table));
      all.push (new Card('p4', -1, opt.table));
    }

    $('.card').click(mouseEvent);
    shuffle(all);
  }



  function shuffle(deck) {
    //Fisher yates shuffle
    let i = deck.length;
    if (i === 0) return;
    while (--i) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempi = deck[i];
      let tempj = deck[j];
      deck[i] = tempj;
      deck[j] = tempi;
    }
  }



  function Card(color, type, table) {
    this.init(color, type, table);
  }

  Card.prototype = {
    init: function(color, type, table) {
      this.shortName = color + type;
      this.color = color;
      this.type = type;
      this.name = color.toUpperCase() + type;
      this.faceUp = false;
      this.el = $('<div/>').css({
        width: opt.cardSize.width,
        height: opt.cardSize.height,
        "background-image": 'url(' + opt.cardsUrl + ')',
        position: 'absolute',
        cursor: 'pointer'
      }).addClass('card').data('card', this).appendTo($(table));
      this.showCard();
      this.moveToFront();
    },

    toString: function() {
      return this.name;
    },

    moveTo: function(x, y, speed, callback) {
      let props = {
        top: y - (opt.cardSize.height / 2),
        left: x - (opt.cardSize.width / 2)
      };
      $(this.el).animate(props, speed || opt.animationSpeed, callback);
    },

    rotate: function(angle) {
      $(this.el)
          .css('-webkit-transform', 'rotate(' + angle + 'deg)')
          .css('-moz-transform', 'rotate(' + angle + 'deg)')
          .css('-ms-transform', 'rotate(' + angle + 'deg)')
          .css('transform', 'rotate(' + angle + 'deg)')
          .css('-o-transform', 'rotate(' + angle + 'deg)');
    },

    showCard: function() {
      let offsets = {
        "r": 0,
        "b": 1,
        "g": 2,
        "y": 3,
        "w": 2,
        "p4": 3
      };
      let xpos, ypos;
      let type = this.type + 1;
      xpos = -type * opt.cardSize.width;
      ypos = -offsets[this.color] * opt.cardSize.height;
      this.rotate(0);
      $(this.el).css('background-position', xpos + 'px ' + ypos + 'px');
    },

    hideCard: function() {
      let y = opt.cardback === 'red' ? 0 : -1 * opt.cardSize.height;
      $(this.el).css('background-position', '0px ' + y + 'px');
      this.rotate(0);
    },

    moveToFront: function() {
      $(this.el).css('z-index', zIndexCounter++);
    }
  };





  function Container() {

  }

  Container.prototype = [];

  Container.prototype.extend = function(obj) {
    for (let prop in obj) {
      this[prop] = obj[prop];
    }
  }

  Container.prototype.extend({

    addCard: function(card) {
      this.addCards([card]);
    },

    addCards: function(cards) {
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (card.container) {
          card.container.removeCard(card);
        }
        this.push(card);
        card.container = this;
      }
    },

    removeCard: function(card) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === card) {
          this.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    init: function(options) {
      options = options || {};
      this.x = options.x || $(opt.table).width() / 2;
      this.y = options.y || $(opt.table).height() / 2;
      this.faceUp = options.faceUp;
    },

    click: function(func, context) {
      this._click = {
        func: func,
        context: context
      };
    },

    mousedown: function(func, context) {
      this._mousedown = {
        func: func,
        context: context
      };
    },

    mouseup: function(func, context) {
      this._mouseup = {
        func: func,
        context: context
      };
    },

    render: function(options) {
      options = options || {};
      let speed = options.speed || opt.animationSpeed;
      this.calcPosition(options);
      for (let i = 0; i < this.length; i++) {
        let card = this[i];
        zIndexCounter++;
        card.moveToFront();
        let top = parseInt($(card.el).css('top'));
        let left = parseInt($(card.el).css('left'));
        if (top !== card.targetTop || left !== card.targetLeft) {
          let props = {
            top: card.targetTop,
            left: card.targetLeft,
            queue: false
          };
          if (options.immediate) {
            $(card.el).css(props);
          } else {
            $(card.el).animate(props, speed);
          }
        }
      }

      let me = this;
      let flip = function() {
        for (let i = 0; i < me.length; i++) {
          if (me.faceUp) {
            me[i].showCard();
          } else {
            me[i].hideCard();
          }
        }
      }
      if (options.immediate) {
        flip();
      } else {
        setTimeout(flip, speed / 2);
      }

      if (options.callback) {
        setTimeout(options.callback, speed);
      }
    },

    topCard: function() {
      return this[this.length - 1];
    },

    toString: function() {
      return 'Container';
    }
  });

  function Deck(options) {
    this.init(options);
  }

  Deck.prototype = new Container();

  Deck.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
      let left = Math.round(this.x - opt.cardSize.width / 2, 0);
      let top = Math.round(this.y - opt.cardSize.height / 2, 0);
      let condenseCount = 6;
      for (let i = 0; i < this.length; i++) {
        if (i > 0 && i % condenseCount === 0) {
          top -= 1;
          left -= 1;
        }
        this[i].targetTop = top;
        this[i].targetLeft = left;
      }
    },

    toString: function() {
      return 'Deck';
    },

    deal: function(count, hands, speed, callback) {
      let me = this;
      let i = 0;
      let totalCount = count * hands.length;

      function dealOne() {
        if (me.length === 0 || i === totalCount) {
          if (callback) {
            callback();
          }
          return;
        }
        hands[i % hands.length].addCard(me.topCard());
        hands[i % hands.length].render({
          callback: dealOne,
          speed: speed
        });
        i++;
      }
      dealOne();
    }
  });

  function Hand(options) {
    this.init(options);
  }

  Hand.prototype = new Container();

  Hand.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
      let width = opt.cardSize.width + (this.length - 1) * opt.cardSize.padding;
      let left = Math.round(this.x - width / 2);
      let top = Math.round(this.y - opt.cardSize.height / 2, 0);
      for (let i = 0; i < this.length; i++) {
        this[i].targetTop = top;
        this[i].targetLeft = left + i * opt.cardSize.padding;
      }
    },

    toString: function() {
      return 'Hand';
    }
  });

  function Pile(options) {
    this.init(options);
  }

  Pile.prototype = new Container();

  Pile.prototype.extend({
    calcPosition: function(options) {
      options = options || {};
    },

    toString: function() {
      return 'Pile';
    },

    deal: function(count, hands) {
      if (!this.dealCounter) {
        this.dealCounter = count * hands.length;
      }
    }
  });


  function Player(options) {
    this.init(options);
  }




  return {
    init: init,
    all: all,
    options: opt,
    SIZE: opt.cardSize,
    Card: Card,
    Container: Container,
    Deck: Deck,
    Hand: Hand,
    Pile: Pile,
    shuffle: shuffle
  };
})();

if (typeof module !== 'undefined') {
  module.exports = cards;
}

