/*
 *  Copyright (c) 2013 Funny or Die, Inc.
 *  http://www.funnyordie.com
 *  https://github.com/funnyordie/videojs-relatedCarousel/blob/master/LICENSE.md
 */

(function(vjs) {
  var extend = function(obj) {
      var arg, i, k;
      for (i = 1; i < arguments.length; i++) {
        arg = arguments[i];
        for (k in arg) {
          if (arg.hasOwnProperty(k)) {
            obj[k] = arg[k];
          }
        }
      }
      return obj;
    },
    defaults = [
      {
        imageSrc: '',
        title: '',
        url: ''
      }
    ];

  vjs.plugin('relatedCarousel', function(options) {
    var player = this,
      settings = extend([], defaults, options || []);

    var carousel = {
      controlBarButton: document.createElement('div'),

      holderDiv: document.createElement('div'),
      title: document.createElement('h5'),

      viewport: document.createElement('div'),
      items: document.createElement('ul'),

      leftButton: document.createElement('div'),
      leftButtonContent: document.createElement('div'),

      rightButton: document.createElement('div'),
      rightButtonContent: document.createElement('div'),

      config: null,
      currentPosition: 0,
      maxPosition: 0,
      currentVideoIndex: -1,
      isOpen: false,
      open: function() {
        if (!carousel.holderDiv.className.match(/active/)) {
          carousel.holderDiv.className = carousel.holderDiv.className + " active";
        }
        this.isOpen = true;
      },
      close: function() {
        if (carousel.holderDiv.className.match(/active/)) {
          carousel.holderDiv.className = carousel.holderDiv.className.replace(/\s*active\s*/, '');
        }
        this.isOpen = false;
      },
      toggle: function() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      },

      initiateVideo: function(index, config, trigger) {
        currentVideoIndex = index;
        if (config.callback !== undefined) {
          config.callback(player, config, {
            trigger: trigger,
            newIndex: currentVideoIndex
          });
        } else {
          carousel.close();
          if (config.url !== undefined) {
            player.src(config.url);
            player.play();
          } else {
            window.location = config.url;
          }
        }
      },

      onItemClick: function(index, element, config) {
        element.onclick = function(e) {
          e.preventDefault();
          carousel.initiateVideo(index, config, e);
        };
      },

      buildCarousel: function(config) {
        this.config = config;
        this.items.innerHTML = '';
        this.maxPosition = (-176) * (this.config.length - 1)

        // Initialize carousel items
        for (var i = 0; i < this.config.length; i++) {
          var item = document.createElement('li');
          item.className = 'carousel-item';

          var img = document.createElement('img');
          img.src = this.config[i].imageSrc;
          img.className = 'vjs-carousel-thumbnail';
          img.alt = this.config[i].title;
          img.style.width = '100%';

          var anchor = document.createElement('a');

          if (!this.config[i].url) {
            this.config[i].url = '#';
          }

          anchor.href = this.config[i].url;
          anchor.title = this.config[i].title;
          anchor.appendChild(img);

          this.onItemClick(i, anchor, this.config[i]);

          var title = document.createElement('span');
          title.innerHTML = this.config[i].title;
          anchor.appendChild(title);

          item.appendChild(anchor);
          this.items.appendChild(item);
        }
      }
    };

    /* Menu Button */
    carousel.controlBarButton.className = 'vjs-button vjs-control vjs-related-carousel-button icon-videojs-carousel-toggle';

    carousel.holderDiv.className = 'vjs-related-carousel-holder';
    carousel.title.innerHTML = 'More Videos';
    carousel.viewport.className = 'vjs-carousel-viewport';
    carousel.items.className = 'carousel-items';
    carousel.leftButton.className = 'vjs-carousel-left-button';
    carousel.leftButtonContent.className = 'icon-videojs-carousel-left';
    carousel.rightButton.className = 'vjs-carousel-right-button';
    carousel.rightButtonContent.className = 'icon-videojs-carousel-right';

    // Add all items to DOM
    player.controlBar.el().appendChild(carousel.controlBarButton);
    carousel.holderDiv.appendChild(carousel.title);
    player.el().appendChild(carousel.holderDiv);
    carousel.holderDiv.appendChild(carousel.viewport);
    carousel.viewport.appendChild(carousel.items);
    carousel.leftButton.appendChild(carousel.leftButtonContent);
    carousel.holderDiv.appendChild(carousel.leftButton);
    carousel.rightButton.appendChild(carousel.rightButtonContent);
    carousel.holderDiv.appendChild(carousel.rightButton);

    // Add event handlers
    carousel.controlBarButton.onclick = function(e) {
      carousel.toggle();
    };
    carousel.leftButton.onclick = function() {
      if (carousel.currentPosition === 0) {
        return;
      }
      carousel.currentPosition = carousel.currentPosition + 176;
      carousel.items.style.left = carousel.currentPosition + 'px';
    };

    carousel.rightButton.onclick = function() {
      if (carousel.currentPosition <= carousel.maxPosition) {
        return;
      }
      carousel.currentPosition = carousel.currentPosition - 176;
      carousel.items.style.left = carousel.currentPosition + 'px';
    };

    carousel.buildCarousel(settings);

    player.carousel = carousel;

    // Player events
    player.on('mouseout', function() {
      if (!carousel.holderDiv.className.match(/vjs-fade-out/)) {
        carousel.holderDiv.className = carousel.holderDiv.className + " vjs-fade-out";
      }
    });
    player.on('mouseover', function() {
      carousel.holderDiv.className = carousel.holderDiv.className.replace(/\s*vjs-fade-out\s*/g, '');
    });
    player.on('timeupdate', function() {
      if (player.ended()) {
        if (carousel.currentVideoIndex === carousel.config.length) {
          return;
        }

        carousel.currentVideoIndex++;
        carousel.initiateVideo(carousel.currentVideoIndex, carousel.config[carousel.currentVideoIndex], player);
      }
    });
  });
}(window.videojs));
