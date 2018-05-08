
import {appregistry, react, updates, dimensions, view, button, text, animated, animate, parallel, newanimatedx, easing, interpolate} from 'pure-native'

const {width, height} = dimensions

const style = {
  wrap: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scenes: {
    flexDirection: 'row'
  },
  scene: (active, backgroundColor, position) => ({
    width: 150,
    height: 240,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    transform: [{translateY: interpolate(active, [0, 1], [0, position])}]
  }),
  button: {
    margin: 5
  }
}


const counter = (state) =>
  text(`${state.counter}`)

const scene = (id, color, position, state, store) =>
  view(style.scene(state[id], color, position), {animated,
    update: store.update, id: 'counter',
  },
    () => counter(state)()
  )

const scenes = (state, store) =>
  view(style.scenes,
    scene('scene1', 'whitesmoke', -100, state, store),
    scene('scene2', 'pink', 100, state, store)
  )

const movescene = (id, state) =>
  button(`move ${id}`, style.button, {
    onPress: () => animate(state[id], state[id]._value ? 0 : 1)
  })

const parallelmove = (state) =>
  button('parallel move', style.button, {
    onPress: () => parallel([
      [state.scene1, state.scene1._value ? 0 : 1, 500, {easing: easing.bounce}],
      [state.scene2, state.scene2._value ? 0 : 1, 500, {easing: easing.bounce}]
    ])
  })

const handle = (id, i, state, store) =>
  button(id, style.button, {
    onPress: () => {
      state.counter += i
      store.update.do('counter')
    }
  })


const testapp = (store) => {
  let state = {
    counter: 0,
    scene1 : newanimatedx(0),
    scene2 : newanimatedx(0)
  }

  return view(style.wrap,
    scenes(state, store),
    handle('counter++', 1, state, store),
    handle('counter--', -1, state, store),
    movescene('scene1', state),
    movescene('scene2', state),
    parallelmove(state)
  )
}


let store = {
  update: updates()
}


let application = class App extends react.Component {
  render = () => testapp(store)()
}

appregistry.registerComponent('TestApp', () => application) 
