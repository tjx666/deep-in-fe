const selectors = ['.slider', '.arrow-left', '.arrow-right'];
const [slider, leftArrow, rightArrow] = selectors.map((selector) =>
    document.querySelector(selector),
);
const slicks = slider.children;

let currentIndex = 0;
rightArrow.addEventListener('click', function next() {
    if (currentIndex === slicks.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    slider.style.left = `${-currentIndex * 800}px`;
});

leftArrow.addEventListener('click', function previous() {
    if (currentIndex === 0) {
        currentIndex = slicks.length - 1;
    } else {
        currentIndex--;
    }
    slider.style.left = `${-currentIndex * 800}px`;
});
