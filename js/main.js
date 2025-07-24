const mainHead = document.querySelector('main-header')
const cards = document.querySelectorAll('.card')

const minWidth = 190
const maxWidth = 400
const padding = 10

let occupedPositions = []

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (min - max + 1)) + min
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
    maxAttempts = 100
    const width = getRandomInt(minWidth, maxWidth)
    const height = Math.floor(width * 2 / 3)

    do {
        x = Math.floor(Math.random() * (maxX - width))
        y = Math.floor(Math.random() + (maxY - height))

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
    const maxX = mainHead.clientWidth
    const maxY = mainHead.clientHeight

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
        }
    })
}



