import { TextSplitter } from './textSplitter.js';

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Select all (fixed) elements on the page with a specific data attribute ('data-fixed').
const fixedElements = document.querySelectorAll('[data-fixed]');
const blocks = document.querySelectorAll('.content__inner'); // Content blocks that trigger the animations

// Default animation properties
const defaultAnimationProps = {
  duration: 0.6,
  ease: 'power4'
};

// Store original HTML content and styles for each fixed element for restoring later
const originalHTMLContent = new Map();
const originalStyles = new Map();
fixedElements.forEach(el => {
  originalHTMLContent.set(el, el.innerHTML);
  originalStyles.set(el, el.getAttribute('style') || ''); // Store initial inline styles if any
});

// Function to reset an element to its original state
function resetElement(target) {
  // Restore original HTML content
  target.innerHTML = originalHTMLContent.get(target);
  // Remove any transformations and set properties back to default values
  gsap.set(target, {
    clearProps: 'all', // Clear all GSAP-applied properties
    rotation: 0,
    xPercent: 0,
    yPercent: 0,
    x: 0,
    y: 0,
    scale: 1,
    autoAlpha: 1,
  });
  // Restore any initial inline styles if present
  target.setAttribute('style', originalStyles.get(target));
}

// Function to get the fixed element's position from the top of the viewport
function getElementTopOffset(element) {
  const elementRect = element.getBoundingClientRect();
  return elementRect.top; // Returns the distance of the element from the top of the viewport
}

// Grouped animation effects, each with optional offsetStartAmount and offsetEndAmount (offset to add to the ScrollTrigger's start/end properties)
const effects = [
  // Effect 1: Scale down and hide, then scale up and show
  {
    offsetStartAmount: 30, 
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      gsap.set(target, { transformOrigin: '0% 50%' });
      target.currentTween = gsap.to(target, { 
        scale: 0, 
        autoAlpha: 0, 
        ...defaultAnimationProps, 
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      target.currentTween = gsap.to(target, { 
        scale: 1, 
        autoAlpha: 1, 
        ...defaultAnimationProps, 
        onComplete: () => {
          resetElement(target); // Reset element state
          target.currentTween = null;
        }
      });
    }
  },

  // Effect 2: Blur effect and scale change
  {
    offsetStartAmount: 30,
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      gsap.set(target, { transformOrigin: '0% 50%' });
      target.currentTween = gsap.to(target, {
        startAt: { filter: 'blur(0px)' },
        filter: 'blur(5px)',
        scale: 0.9,
        duration: 0.2,
        ease: 'sine',
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      target.currentTween = gsap.to(target, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.6,
        ease: 'expo',
        onComplete: () => {
          resetElement(target); // Reset element state
          target.currentTween = null;
        }
      });
    }
  },

  // Effect 3: Slide text up effect
  {
    offsetStartAmount: 30,
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      const innerContent = target.innerHTML; 
      target.innerHTML = `<div class="oh__inner">${innerContent}</div>`;
      target.classList.add('oh'); 
      gsap.set(target, { transformOrigin: '50% 50%' });
      target.currentTween = gsap.to(target.querySelector('.oh__inner'), {
        yPercent: -102,
        ...defaultAnimationProps,
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      target.currentTween = gsap.to(target.querySelector('.oh__inner'), {
        startAt: { yPercent: 102 },
        yPercent: 0,
        ...defaultAnimationProps,
        onComplete: () => {
          target.innerHTML = originalHTMLContent.get(target);
          target.classList.remove('oh');
          resetElement(target); // Reset element state
          target.currentTween = null;
        }
      });
    }
  },

  // Effect 4: using TextSplitter
  {
    offsetStartAmount: 30,
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      target.textSplitter = new TextSplitter(target, { splitTypeTypes: 'chars' });
      target.currentTween = gsap.to(target.textSplitter.getChars(), {
        x: () => gsap.utils.random(-50, 50),
        y: () => gsap.utils.random(-40, 0),
        autoAlpha: 0,
        stagger: {
          amount: 0.03,
          from: 'random'
        },
        ...defaultAnimationProps,
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      target.currentTween = gsap.to(target.textSplitter.getChars(), {
        x: 0,
        y: 0,
        autoAlpha: 1,
        stagger: {
          amount: 0.03,
          from: 'random'
        },
        onComplete: () => {
          target.innerHTML = originalHTMLContent.get(target);
          resetElement(target); // Reset element state
          target.currentTween = null;
        },
        ...defaultAnimationProps
      });
    }
  },

  // Effect 5: Split characters and animate with stagger direction control and shuffle effect
  {
    offsetStartAmount: 30,
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      target.textSplitter = new TextSplitter(target, { splitTypeTypes: 'chars' });
            
      target.currentTween = gsap.to(target.textSplitter.getChars(), {
        duration: 0.02,
        ease: 'none',
        autoAlpha: 0,
        stagger: {
          amount: 0.25,
          from: 'end'
        },
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      const chars = target.textSplitter.getChars();
      const getRandomChar = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return letters.charAt(Math.floor(Math.random() * letters.length));
      };
  
      // Create a GSAP timeline to animate character shuffling and restore original content
      const tl = gsap.timeline({
        onComplete: () => {
          resetElement(target); // Reset element state after entire animation completes
          target.currentTween = null; // Clear the reference to the tween
        }
      });
  
      // Iterate through each character and add shuffling effect to timeline
      chars.forEach((char, index) => {
        const originalChar = char.innerHTML;
  
        // Perform 2 shuffling iterations
        for (let i = 0; i < 2; i++) {
          tl.to(char, {
            duration: 0.03,
            textContent: getRandomChar(),
            autoAlpha: 1,
            ease: 'none'
          });
        }
  
        // Restore original character content
        tl.to(char, {
          duration: 0.02,
          textContent: originalChar,
          autoAlpha: 1,
          ease: 'none'
        });
  
        // Delay the start of each character's timeline based on index
        tl.add('', index * 0.03);
      });
  
      // Store reference to the timeline
      target.currentTween = tl;
    }
  },

  // Effect 6: Move and rotate simultaneously
  {
    offsetStartAmount: 90,
    offsetEndAmount: 40,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      gsap.set(target, { transformOrigin: '0% 100%' });
      target.currentTween = gsap.to(target, {
        xPercent: -5,
        rotation: -90,
        y: () => target.offsetWidth - target.offsetHeight,
        duration: 0.6,
        ease: 'power4',
        onComplete: () => {
          target.currentTween = null;
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      target.currentTween = gsap.to(target, {
        rotation: 0,
        xPercent: 0,
        y: 0,
        ...defaultAnimationProps,
        onComplete: () => {
          resetElement(target); // Reset element state
          target.currentTween = null;
        },
      });
    }
  },

  // Effect 7: move away
  {
    offsetStartAmount: 30,
    offsetEndAmount: 10,
    onEnter: (target) => {
      if (target.currentTween) target.currentTween.kill();
      resetElement(target); // Reset element state before animation starts
      target.currentTween = gsap.to(target, {
        x: () => -1* (target.offsetWidth + target.offsetLeft),
        ...defaultAnimationProps,
        onComplete: () => {
          target.currentTween = null; // Clear the reference to the tween
        }
      });
    },
    onLeave: (target) => {
      if (target.currentTween) target.currentTween.kill();
      
      target.currentTween = gsap.to(target, {
        x: 0,
        ...defaultAnimationProps,
        onComplete: () => {
          resetElement(target); // Reset element state
          target.currentTween = null; // Clear the reference to the tween
        },
      })
    }
  }
];

// Function to create ScrollTriggers for each content block and fixed element
function createScrollTriggers() {
  blocks.forEach((block, index) => {
    const effect = effects[index % effects.length]; // Select the effect for the current block
    fixedElements.forEach((fixedElement) => {
      let elementOffsetTop = getElementTopOffset(fixedElement); // Calculate offset for the fixed element

      ScrollTrigger.create({
        trigger: block, // Element to observe (content block)
        start: () => `top ${elementOffsetTop + effect.offsetStartAmount}px`, // Use effect-specific offset
        end: () => `bottom ${elementOffsetTop - effect.offsetEndAmount}px`, // Use effect-specific offset

        onEnter: () => effect.onEnter(fixedElement),
        onLeaveBack: () => effect.onLeaveBack ? effect.onLeaveBack(fixedElement) : effect.onLeave(fixedElement),
        onLeave: () => effect.onLeave(fixedElement),
        onEnterBack: () => effect.onEnterBack ? effect.onEnterBack(fixedElement) : effect.onEnter(fixedElement)
      });
    });
  });
}

// Wait until the page is fully loaded to create the ScrollTriggers
window.addEventListener('load', () => {
  createScrollTriggers();
});

// Update position dynamically on resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh(); // Refresh ScrollTrigger to apply new start/end positions
});
