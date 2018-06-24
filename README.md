# pure-native

Wrapper for React-Native to write code in more elegant, functional style and speed up development.

Built-in State Control, so you don’t need redux/mobx anymore.

![](https://media.giphy.com/media/3eQeRJL6h0aIfsdNXy/giphy.gif)

## Installation

```
yarn add pure-native
```
or
```
npm i pure-native --save
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
  Controls app state.
  
  All you need is add ```{id: '...'}``` to component props and then ```update.do(id)``` to make update.  

  ```javascript
    import {update, view, button, text} from 'pure-native'

    const app = () => {
      let state = {
        counter: 0
      }

      return view({}, {id: 'app'}, //or view({}, {update, id: 'app'})
        () => text(`${state.counter}`)(), //updatable component must be a function
        button('+', {}, {
          onPress: () => {
            state.counter++
            update.do('app')
          }
        })
      )
    }
  ```

  Add prop ```{from: '...'}``` for partial updates.
  
  For example, you have component 'header' with childs 'name', 'ready', 'score', 'notification', etc.
  
  ```javascript
    const header = () =>
      view({},
        view({}, {id: 'header', from: 'name'})
        view({}, {id: 'header', from: 'ready'})
        view({}, {id: 'header', from: 'score'})     
        view({}, {id: 'header', from: 'notification'})
      )
  ```
    
  Now, you can update full group by ```update.do('header')``` or partially ```update.do('header', ['ready', 'score'])```

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

  `update.list`
  ```javascript
    console.log(update.list) // Array of subscribers
  ```


  ### Store
  Global object for your application.
  ```
    import {store, text} from 'pure-native'

    store.settings = {...}
    store.user = {...}
    store.version = {...}

    const app = () =>
      text(store.settings.value)
  ```


  ### Storage
  Easy way to use Async Storage

  ```
    import {storage} from 'pure-native'

    storage.set('msg', 'hello', () =>
      storage.get('msg', result => {
        console.log(result)
        storage.remove('msg')
      })
    )
  ```
  ```javascript
    get(id, cb)          // get item
    set(id, value, cb)   // set item
    merge(id, value, cb) // merge item
    remove(id, cb)       // remove item
    multiget(arr, cb)    // get arr of items
    multiset(arr, cb)    // set arr of items
    multimerge(arr, cb)  // merge arr of items
    multiremove(arr, cb) // remove arr of items
    getkeys(cb)          // gets all keys known to your app
    clear(cb)            // erases all storage
    flush(cb)            // flushes any pending requests using a single batch call to get the data
  ```


  ### Animation
  To make animated component add `animated` to component props
  ```javascript
    import {view, text, animated} from 'pure-native'

    const app = () =>
      view({}, {animated},
        text('', {}, {animated})
      )
  ```

  `newanimatedx(x)` for single values

  `newanimatedxy({x, y})` for vectors

  `interpolate(id, inputrange, outputrange, extrapolate)` Interpolating with Animated *//default inputrange = [0, 1], outputrange = inputrange*

  `easing` Animated Easing

  `animate(id, value, duration, cb, props)` start animation (Animated.timing) *//default value = 1, duration = 500*

  `parallel(arr, cb)`  starts an array of animations at the same time

  `sequence(arr, cb)` starts the animations in order, waiting for each to complete before starting the next

  `stagger(delay, arr, cb)` starts animations in order and in parallel, but with successive delays


  ```javascript
    import {newanimatedx, newanimatedxy, interpolate, easing, animate, parallel, sequence, stagger} from 'pure-native'

    let style = {
      wrap: (active1, active2) => ({
        opacity: interpolate(active1),
        borderColor: interpolate(active2, [0, 1, 5], ['gray', 'blue', 'lime'])
      })
    }

    let value = newanimatedx(0)
    let vector = newanimatedxy({x: 0, y: 0})

    let arr = [
      [value, 1, 800, {easing: easing.bounce}],
      [vector, {x: 1, y: 1}, 300]
    ]

    animate(value, 1, 800, () => console.log('done'))

    parallel(arr, () => console.log('done'))
    sequence(arr)
    stagger(200, arr)
  ```


  ### Components
  All React components and apis available in lowercase. *// toggle === Switch*

  `view(style, props, children)`  if you haven't props, just use `view(style, children)`
  
  `scrollview(style, props, children)` or `scrollview(style, children)`
  
  `toggle(props)` component Switch *//!!*
  
  `flatlist(style, props)`
  
  `sectionlist(props)`
  
  `button(children, style, props)` or `button(style, props, children)`
  
  `text(children, style, props)`
  
  `textinput(style, props)`
  
  `image(style, props)`
  
  `geolocation.getCurrentPosition(props)`  
  
  `share.share(props)`
  
   `...`
   
  `component(style, props, children)` or `component(props)`



  ### Example
  ```javascript

  import {appregistry, react, update, dimensions, view, button, text, animated, animate, parallel, newanimatedx, easing, interpolate} from 'pure-native'

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

  const scene = (id, color, position, state) =>
    view(style.scene(state[id], color, position), {animated, id: 'counter'},
      () => counter(state)()
    )

  const scenes = (state) =>
    view(style.scenes,
      scene('scene1', 'whitesmoke', -100, state),
      scene('scene2', 'pink', 100, state)
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

  const handle = (id, i, state) =>
    button(id, style.button, {
      onPress: () => {
        state.counter += i
        update.do('counter')
      }
    })


  const testapp = () => {
    let state = {
      counter: 0,
      scene1 : newanimatedx(0),
      scene2 : newanimatedx(0)
    }

    return view(style.wrap,
      scenes(state),
      handle('counter++', 1, state),
      handle('counter--', -1, state),
      movescene('scene1', state),
      movescene('scene2', state),
      parallelmove(state)
    )
  }

  let application = class App extends react.Component {
    render = () => testapp()()
  }

  appregistry.registerComponent('TestApp', () => application)
  ```
