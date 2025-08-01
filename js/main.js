import ScrollSmoother from '../vendor/gsap/ScrollSmoother.min.js'
gsap.registerPlugin(ScrollSmoother)

ScrollSmoother.create({
    wrapper: '.wrapper',
    content: '.content',
    smooth: 1.5,
    effects: true
})

gsap.fromTo('.main-header', { opacity: 1}, {
    opacity: 0,
    scrollTrigger: {
        trigger: '.main-header',
        start: '300',
        end: '700',
        scrub: true
    }
})

const mainHeader = document.querySelector('.main-header')
const cards = document.querySelectorAll('.card')

const minWidth = 190
const maxWidth = 400
const padding = 10

let occupedPositions = []

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function isOverLapping(x, y, width, height, positions) {
 return positions.some(pos => {
    return (
        x < pos.x + pos.width + padding && 
        x + width > pos.x - padding && 
        y < pos.y + pos.height + padding && 
        y + height > pos.y - padding 
    )
 })
}

function getRandomPositionAndSize(maxX, maxY, card) {
    let x, y
    let attempts = 0
    const maxAttempts = 100
    const width = getRandomInt(minWidth, maxWidth)
    const height = Math.floor(width * 2 / 3)

    do {
        x = Math.floor(Math.random() * (maxX - width))
        y = Math.floor(Math.random() * (maxY - height))

        attempts++

        if(attempts > maxAttempts) {
            console.warn(`Невозможно разместить карточку ${card.textContent} без пересечения.`)
            return null
        }
    } while (isOverLapping(x, y, width, height, occupedPositions))

    let depth 

    const widthRatio = (width - minWidth) / (maxWidth - minWidth)

    if (widthRatio < .33) {
        depth = getRandomInt(1, 2)
    } else if (widthRatio < .66) {
        depth = getRandomInt(2, 3)
    } else {
        depth = getRandomInt(4, 5)
    }

    return {x, y, width, height, depth}
}

function placeCards() {
    const maxX = mainHeader.clientWidth
    const maxY = mainHeader.clientHeight

    occupedPositions = []

    cards.forEach(card => {
        const cardInfo = getRandomPositionAndSize(maxX, maxY, card)

        if (cardInfo) {
            const { x, y, width, height, depth } = cardInfo

            card.style.left = `${x}px`
            card.style.top = `${y}px`
            card.style.width = `${width}px`
            card.style.height = `${height}px`
            card.dataset.depth = depth

            occupedPositions.push({ x, y, width, height })
        } else {
            card.style.display = 'none'
        }
    })
}

mainHeader.addEventListener('mousemove', (e) => {
    const mainHeaderRect = mainHeader.getBoundingClientRect()
    const centerX = mainHeaderRect.width / 2
    const centerY = mainHeaderRect.height / 2
    const mouseX = (e.clientX - mainHeaderRect.left - centerX) / centerX
    const mouseY = (e.clientY - mainHeaderRect.top - centerY) / centerY

    mainHeader.style.setProperty('--mouse-x', mouseX)
    mainHeader.style.setProperty('--mouse-y', mouseY)
})

window.addEventListener('load', placeCards)
window.addEventListener('resize', placeCards)

window.addEventListener('load', function () {
    const loaderInner = document.querySelector('.loader_inner');
    const loader = document.querySelector('.loader');

        // Плавное скрытие .loader_inner
        loaderInner.style.opacity = '0';

        // После окончания анимации (примерно 300 мс), скрываем весь preloader
        setTimeout(() => {
            loader.style.transition = 'opacity 0.6s ease';
            loader.style.opacity = '0';

        // Полностью убираем элемент из DOM через 600 мс
        this.setTimeout(() => {
            loader.style.display = 'none';
        }, 600);
    }, 400);
});


