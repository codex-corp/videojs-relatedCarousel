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

  // direction = boolean value: true or false. If true, go to NEXT slide; otherwise go to PREV slide
  function toggleSlide(direction) {
    var elements = document.getElementsByClassName("hideable"); // gets all the "slides" in our slideshow
    // Find the LI that's currently displayed
    var visibleID = getVisible(elements);
    elements[visibleID].style.display = "none"; // hide the currently visible LI
    if (!direction) {
      var makeVisible = prev(visibleID, elements.length); // get the previous slide
    } else {
      var makeVisible = next(visibleID, elements.length); // get the next slide
    }
    elements[makeVisible].style.display = "block"; // show the previous or next slide
  }

  function getVisible(elements) {
    var visibleID = -1;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].style.display == "block") {
        visibleID = i;
      }
    }
    return visibleID;
  }

  function prev(num, arrayLength) {
    if (num == 0) return arrayLength - 1;
    else return num - 1;
  }

  function next(num, arrayLength) {
    if (num == arrayLength - 1) return 0;
    else return num + 1;
  }

  vjs.plugin('relatedCarousel', function(options) {
    var player = this,
      settings = extend([], defaults, options || []);

    var holderDiv = document.createElement('div');
    holderDiv.className = 'vjs-related-carousel-holder';

    var background = document.createElement('div');
    background.className = 'carousel-background';
    holderDiv.appendChild(background);

    var title = document.createElement('h5');
    title.innerHTML = 'More Videos';
    holderDiv.appendChild(title);

    player.el().appendChild(holderDiv);

    var carouselViewport = document.createElement('div');
    carouselViewport.className = 'vjs-carousel-viewport';
    holderDiv.appendChild(carouselViewport);

    var carouselItems = document.createElement('ul');
    carouselItems.className = 'carousel-items';
    carouselViewport.appendChild(carouselItems);

    var numItems = settings.length;
    var imageWidthPercentage = 90 / numItems;

    // Render carousel buttons
    var leftButton = document.createElement('div');
    leftButton.className = 'vjs-carousel-left-button';
    var leftButtonContent = document.createElement('div');
    leftButtonContent.innerHTML = '❬';
    leftButton.appendChild(leftButtonContent);
    holderDiv.appendChild(leftButton);

    var rightButton = document.createElement('div');
    rightButton.className = 'vjs-carousel-right-button';
    var rightButtonContent = document.createElement('div');
    rightButtonContent.innerHTML = '❭';
    rightButton.appendChild(rightButtonContent);
    holderDiv.appendChild(rightButton);

    var currentPosition = 0;
    var maxPosition = (-176) * (settings.length - 1);
    leftButton.onclick = function() {
      if (currentPosition === 0) {
        return;
      }
      currentPosition = currentPosition + 176;
      carouselItems.style.left = currentPosition + 'px';
    };

    rightButton.onclick = function() {
      if (currentPosition <= maxPosition) {
        return;
      }
      currentPosition = currentPosition - 176;
      carouselItems.style.left = currentPosition + 'px';
    };

    for (var i = 0; i < numItems; i++) {
      var item = document.createElement('li');
      item.className = 'carousel-item';

      var img = document.createElement('img');
      img.src = settings[i].imageSrc;
      img.className = 'vjs-carousel-thumbnail';
      img.alt = settings[i].title;
      img.style.width = '100%';

      var anchor = document.createElement('a');
      anchor.href = settings[i].url;
      anchor.appendChild(img);
      anchor.title = settings[i].title;

      var title = document.createElement('span');
      title.innerHTML = settings[i].title;
      anchor.appendChild(title);

      item.appendChild(anchor);
      carouselItems.appendChild(item);

      player.on('mouseout', function() {
        if (!holderDiv.className.match(/vjs-fade-out/)) {
          holderDiv.className = holderDiv.className + " vjs-fade-out";
        }
      });
      player.on('mouseover', function() {
        holderDiv.className = holderDiv.className.replace(/\s*vjs-fade-out\s*/g, '');
      });
    }

    /* Menu Button */
    var RelatedCarouselButton = document.createElement('div');
    RelatedCarouselButton.className = 'vjs-button vjs-control vjs-related-carousel-button';
    RelatedCarouselButton.onclick = function(e) {
      if (holderDiv.className.match(/active/)) {
        holderDiv.className = holderDiv.className.replace(/\s*active\s*/, '');
      } else {
        holderDiv.className = holderDiv.className + " active";
      }
    };

    player.controlBar.el().appendChild(RelatedCarouselButton);
  });
}(window.videojs));
