import phrases from './phrases.json' assert { type: 'json' }

const ACCENT = '\u0301'

function show (container, phrase) {
  const fragment = document.createDocumentFragment()
  let wordCounter = 0
  for (const word of phrase) {
    const characters = word.split('')
    const wordElement = document.createElement('div')
    wordElement.id = `word${wordCounter}`
    wordElement.className = 'word'
    fragment.appendChild(wordElement)
    const characterCount = characters.length
    const vowelCount = characters.filter(isVowel).length
    if (vowelCount < 2) {
      wordElement.appendChild(document.createTextNode(word))
    } else {
      for (let index = 0; index < characterCount; index++) {
        const character = characters[index]
        if (character === ACCENT) continue
        if (!isVowel(character)) {
          wordElement.appendChild(document.createTextNode(character))
        } else {
          const stressed = (
            index < characterCount &&
            characters[index + 1] === ACCENT
          )
          const label = document.createElement('label')
          wordElement.appendChild(label)
          label.appendChild(document.createTextNode(character))
          const radio = document.createElement('input')
          radio.required = true
          label.appendChild(radio)
          radio.name = `word${wordCounter}`
          radio.type = 'radio'
          radio.value = index
          radio.dataset.stressed = stressed
        }
      }
    }
    wordCounter++
  }
  container.replaceChildren()
  container.appendChild(fragment)
}

const VOWELS = 'аеиоуыэюя'
function isVowel (character) {
  return VOWELS.includes(character.toLowerCase())
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form')
  document.body.appendChild(form)

  const container = document.createElement('div')
  form.appendChild(container)

  const checkButton = document.createElement('button')
  form.appendChild(checkButton)
  checkButton.type = 'submit'
  checkButton.appendChild(document.createTextNode('Проверить'))
  form.addEventListener('submit', event => {
    event.preventDefault()
    event.stopPropagation()
    for (const element of form.elements) {
      if (!element.checked) continue
      const parent = element.parentNode
      if (element.dataset.stressed === 'true') {
        parent.classList.add('right')
      } else {
        parent.classList.add('wrong')
      }
    }
  })

  const nextButton = document.createElement('button')
  form.appendChild(nextButton)
  nextButton.type = 'button'
  nextButton.appendChild(document.createTextNode('Следующее'))
  nextButton.addEventListener('click', () => {
    show(container, randomPhrase())
  })

  show(container, randomPhrase())
}, { once: true })

function randomPhrase () {
  return phrases[Math.floor(Math.random() * phrases.length)]
}
