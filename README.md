# pure-native

Wrapper for React-Native to write code in more elegant, functional style and speed up development.

![](https://media.giphy.com/media/3eQeRJL6h0aIfsdNXy/giphy.gif)

## Installation

```
npm install pure-native --save
```

## Basic usage

```javascript
  import {view, text} from 'pure-native'

  let style = {...}

  const app = () =>
    view(style.wrap,
      text('hello', style.text)
    )
```

## Documentation

  ### Updates
  Controls app state

  ```javascript
    import {updates, view, button, text} from 'pure-native'

    let store = {
      update : updates()
      counter: 0
    }

    const app = () =>
      view({}, {
        update: store.update, id: 'app', from: 'counter'
      },
        () => text(store.counter)(), //updatable component must be a function
        button('+', {}, {
          onPress: () => {
            store.counter++
            store.update.do('app')
          }
        })

      )
  ```
  Life-cycle:
  ```javascript
    view({}, {
      willmount  : () => {}, // component will mount
      didmount   : () => {}, // component did mount
      willupdate : () => {}, // component will update
      didupdate  : () => {}, // component did update
      willunmount: () => {}  // component will unmount
    })
  ```

  `update.do(id, [from])`
  ```javascript
    update.do('app') //update full group
    update.do('app', ['counter', 'name']) // update some of group
  ```

  `update.sub(id, [from])`
  ```javascript
    update.sub('app', ['counter']) // sub component
  ```

  `update.unsub(id, [from])`
  ```javascript
    update.unsub('app', ['counter']) // unsub component
  ```

  `update.list`
  ```javascript
    console.log(update.list) // Array of subscribers
  ```


  ### Animation
  To make animated component add `animated` to component props
  ```javascript
    import {view, animated} from 'pure-native'

    const app = () =>
      view({}, {animated})
  ```

  `newanimatedx(x)` for single values

  `newanimatedxy({x, y})` for vectors

  ```javascript
    import {newanimatex, newanimatedxy} from 'pure-native'

    let value = newanimatex(0)
    let vector = newanimatedxy({x: 0, y: 0})
  ```

  `interpolate(id, inputrange, outputrange, extrapolate)` Interpolating with Animated
  ```javascript
    import {interpolate} from 'pure-native-native'

    let style = {
      wrap: (active1, active2) => ({
        opacity: interpolate(active1),
        borderColor: interpolate(active2, [0, 1, 5], ['gray', 'blue', 'lime'])
      })
    }
  ```


  `easing` Animated Easing

  `animate(id, value, duration, cb, props)` start animation (Animated.timing)

  `parallel(arr, cb)`  starts an array of animations at the same time

  `sequence(arr, cb)` starts the animations in order, waiting for each to complete before starting the next

  `stagger(delay, arr, cb)` starts animations in order and in parallel, but with successive delays

  ```javascript
    import {animate, parallel, sequence, stagger, easing} from 'pure-native'

    let arr = [
      [active1, 1, 800, {easing: easing.bounce}],
      [active2, 0, 300]
    ]

    animate(active3, 1, 800, () => console.log('done'))

    parallel(arr, () => console.log('done'))

    sequence(arr)

    stagger(200, arr)
  ```

  ### Components

  `view(style, props, children)`  if you haven't props, just use `view(style, children)`

  `scrollview(style, props, children)` if you haven't props, just use `scrollview(style, children)`

  `flatlist(style, props)`

  `button(children, style, props)` or `button(style, props, children)`

  `text(children, style, props)`

  `textinput(style, props)`

  `image(style, props)`

  `toggle(props)` component Switch

  `component(style, props)` or `component(props)` if component don't have style

  All React apis and components available in lowercase


  ## Example
  ```javascript

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
  ```
