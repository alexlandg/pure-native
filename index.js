
import React from 'react'
import {
  AccessibilityInfo, ActivityIndicator, Alert, Animated, AppRegistry,
  AppState, AsyncStorage, Button, CameraRoll, Clipboard, Dimensions,
  Easing, FlatList, Geolocation, Image, ImageEditor, ImageStore,
  InputAccessoryView, InteractionManager, Keyboard, KeyboardAvoidingView,
  LayoutAnimation, Linking, ListViewDataSource, Modal, NetInfo,
  PanResponder, Picker, PixelRatio, Platform, RefreshControl,
  ScrollView, SectionList, Settings, Share, Slider, StatusBar, StyleSheet,
  Switch, Systrace, Text, TextInput, TouchableHighlight, TouchableNativeFeedback,
  TouchableOpacity, TouchableWithoutFeedback, Vibration, View, VirtualizedList, WebView,

  BackHandler, DatePickerAndroid, DrawerLayoutAndroid, PermissionsAndroid,
  ProgressBarAndroid, TimePickerAndroid, ToastAndroid, ToolbarAndroid, ViewPagerAndroid,

  ActionSheetIOS, AlertIOS, DatePickerIOS, ImagePickerIOS, MaskedViewIOS, NavigatorIOS,
  PickerIOS, ProgressViewIOS, SafeAreaView, SegmentedControlIOS,
  SnapshotViewIOS, StatusBarIOS, TabBarIOS, VibrationIOS,

  NativeModules
} from 'react-native'

import Component from './component'


const updates = (arr = []) => ({
  list: arr,
  do: (id, from) =>
    from instanceof Array
      ? arr[id] && arr[id].forEach(item => from.forEach(itemfrom => item.from == itemfrom && item.cb()))
      : arr[id] && arr[id].forEach(item => item.cb()),
  sub: (id, from, cb) =>
    arr[id]
      ? arr[id].push({from, cb})
      : arr[id] = [{from, cb}],
  unsub: (id, from) =>
    from
      ? arr[id] && arr[id].some((item, i) => item.from == from && arr[id].splice(i, 1))
      : arr[id] = []
})

const update = updates()

async function astorage(id, props, cb) {
  try {
    let result = await asyncstorage[id](...props)
    cb && cb(result)
  }
  catch (e) {console.log(`Async Storage ${id} Error: `, e)}
}

const store = {}

const storage = {
  get: (id, cb) => astorage('getItem', [id], cb),
  set: (id, data, cb) => astorage('setItem', [id, data], cb),
  merge: (id, value, cb) => astorage('mergeItem', [id, value], cb),
  remove: (id, cb) => astorage('removeItem', [id], cb),
  multiget: (arr, cb) => astorage('multiGet', [arr], cb),
  multiset: (arr, cb) => astorage('multiSet', [arr], cb),
  multimerge: (arr, cb) => astorage('multiMerge', [arr], cb),
  multiremove: (arr, cb) => astorage('multiRemove', [arr], cb),
  getkeys: (cb) => astorage('getAllKeys', [], cb),
  clear: (cb) => astorage('clear', [], cb),
  flush: (cb) => astorage('flushGetRequests', [], cb)
}


const carry = arr =>
  arr instanceof Array
    ? arr.map(item => carry(item))
    : arr instanceof Function
      ? arr()
      : arr

const split = props =>
  props[0] instanceof Function
    ? ({props: {}, children: props})
    : ({props: props.shift(), children: props})

const swapbutton = (children, style, props) => {
  if (children.title) return component(Button, {}, {props})

  let flag = false

  if (typeof children !== 'string') {
    flag = true

    let _ = style

    style = children
    children = props
    props = _
  }

  return flag
    ? component(TouchableOpacity, style, {props, children})
    : component(TouchableOpacity, {}, {props: props[0], children: component(Text, style, {children})})
}

const swapimage = (style, {props, children}) =>
  children.length
    ? component(ImageBackground, style, {props, children})
    : component(Image, style, {props})


const updatekeys = ['id', 'from', 'update', 'willmount', 'didmount', 'willupdate', 'didupdate', 'willunmount']

const justcomponent = (id, style, props, children) => {
  let element = props.animated ? Animated.createAnimatedComponent(id) : id
  let haschild = children && ((children instanceof Array && children.length > 0) || children instanceof Function || typeof children == 'string' || children.type && true)

  return React.createElement(element, {style, ...props, ...haschild ? {children} : {}})
}

const component = (id, style, {props = {}, children}) => {
  if (props.id || props.update || props.willmount || props.didmount || props.willunmount) {
    let updateprops = {}

    updatekeys.forEach(key => {
      if (props[key]) {
        updateprops[key] = props[key]
        delete props[key]
      }
    })

    if (!updateprops.update) updateprops.update = update

    return <Component {...updateprops} children={() => justcomponent(id, style, props, carry(children))}/>
  }
  else return justcomponent(id, style, props, carry(children))
}


const accessibilityinfo = AccessibilityInfo

const activityindicator = (props) => component(ActivityIndicator, {}, {props})

const alert = (...props) => Alert.alert(...props)

const appregistry = AppRegistry

const appstate = AppState

const asyncstorage = AsyncStorage

const cameraroll = CameraRoll

const clipboard = Clipboard

const dimensions = {
  width : Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  //...Dimensions
  get   : (id) => Dimensions.get(id),
  set   : (obj) => Dimensions.set(obj),
  addEventListener   : (type, handle) => Dimensions.addEventListener(type, handle),
  removeEventListener: (type, handler) => Dimensions.removeEventListener(type, handle)
}

const geolocation = Geolocation

const imageeditor = ImageEditor

const imagestore = ImageStore

const inputaccessoryview = (style, props) => () => component(InputAccessoryView, style, {props})

const interactionmanager = InteractionManager

const keyboard = Keyboard

const keyboardavoidingview = (style, ...props) => component(KeyboardAvoidingView, style, split(props))

const layoutanimation = LayoutAnimation

const linking = Linking

const listviewdatasource = ListViewDataSource

const modal = (props) => () => component(Modal, {props})

const nativemodules = NativeModules

const netinfo = NetInfo

const panresponder = PanResponder

const picker = (style, ...props) => () => component(Picker, style, split(props))

const pickeritem = (props) => () => component(Picker.Item, {}, {props})

const pixelratio = PixelRatio

const platform = Platform

const react = React

const refreshcontrol = (props) => component(RefreshControl, {}, {props})

const settings = Settings

const share = Share

const slider = (style, props) => () => component(Slider, style, {props})

const statusbar = (props) => () => component(StatusBar, {}, {props})

const stylesheet = StyleSheet

const systrace = Systrace

const toggle = (props) => () => component(Switch, {}, {props})

const touchablehighlight = (style, ...props) => () => component(TouchableHighlight, style, split(props))

const touchablenativefeedback = (...props) => () => component(TouchableNativeFeedback, {}, split(props))

const touchableopacity = (...props) => () => component(TouchableOpacity, {}, split(props))

const touchablewithoutfeedback = (...props) => () => component(TouchableWithoutFeedback, {}, split(props))

const vibration = Vibration

const webview = (style, props) => () => component(WebView, style, {props})


const actionsheetios = ActionSheetIOS

const alertios = AlertIOS

const datepickerios = (props) => () => component(DatePickerIOS, {}, {props})

const imagepickerios = ImagePickerIOS

const maskedviewios = (style, ...props) => () => component(MaskedViewIOS, style, split(props))

const navigatorios = (style, props) => () => component(NavigatorIOS, style, {props})

const pickerios = (props) => () => component(PickerIOS, {}, {props})

const progressviewios = (style, props) => () => component(ProgressViewIOS, style, {props})

const safeareaview = (style, ...props) => () => component(SafeAreaView, style, split(props))

const segmentedcontrolios = (props) => () => component(SegmentedControlIOS, {}, {props})

const snapshotviewios = (props) => () => component(SnapshotViewIOS, {}, {props})

const statusbarios = StatusBarIOS

const tabbarios = (props) => () => component(TabBarIOS, {}, {props})

const tabbariositem = (props) => () => component(TabBarIOS.item, {}, {props})

const vibrationios = VibrationIOS


const backhandler = BackHandler

const datepickerandroid = DatePickerAndroid

const drawerlayoutandroid = (...props) => () => component(DrawerLayoutAndroid, {}, split(props))

const permissionsandroid = PermissionsAndroid

const progressbarandroid = (props) => () => component(ProgressBarAndroid, {}, {props})

const timepickerandroid = TimePickerAndroid

const toastandroid = ToastAndroid

const toolbarandroid = (style, ...props) => () => component(ToolbarAndroid, style, split(props))

const viewpagerandroid = (style, ...props) => () => component(ViewPagerAndroid, style, split(props))


const animated = true

const easing = Easing

const newanimatedx = (x) => new Animated.Value(x)

const newanimatedxy = ({x, y}) => new Animated.ValueXY({x, y})

const interpolate = (id, inputRange = [0, 1], outputRange = inputRange, extrapolate) =>
  id.interpolate({inputRange, outputRange, extrapolate})

const animate = (id, toValue = 1, duration = 500, cb, props) =>
  Animated.timing(id, {toValue, duration, ...props}).start(e => e.finished && cb && cb())

const parallel = (arr, cb) =>
  Animated.parallel(arr.map(([active, toValue = 1, duration = 500, props]) =>
    Animated.timing(active, {toValue, duration, ...props})
  )).start(e => e.finished && cb && cb())

const sequence = (arr, cb) =>
  Animated.sequence(arr.map(([active, toValue = 1, duration = 500, props]) =>
    Animated.timing(active, {toValue, duration, ...props})
  )).start(e => e.finished && cb && cb())

const stagger = (delay, arr, cb) =>
  Animated.stagger(delay, arr.map(([active, toValue = 1, duration = 500, props]) =>
    Animated.timing(active, {toValue, duration, ...props})
  )).start(e => e.finished && cb && cb())


const button = (children, style, ...props) => () => swapbutton(children, style, props)

const flatlist = (style, props) => () => component(FlatList, style, {props})

const image = (style, ...props) => () => swapimage(style, split(props))

const scrollview = (style, ...props) => () => component(ScrollView, style, split(props))

const sectionlist = (props) => () => component(SectionList, {}, {props})

const text = (children, style, props) => () => component(Text, style, {props, children})

const textinput = (style, ...props) => () => component(TextInput, style, split(props))

const view = (style, ...props) => () => component(View, style, split(props))

const virtualizedlist = (style, props) => () => component(VirtualizedList, {}, {props})


module.exports = {
  update, store, storage,

  accessibilityinfo, activityindicator, alert, appregistry,
  appstate, asyncstorage, cameraroll, clipboard, dimensions,
  geolocation, imageeditor, imagestore, inputaccessoryview,
  interactionmanager, keyboard, keyboardavoidingview,
  layoutanimation, linking, listviewdatasource, modal, nativemodules, netinfo,
  panresponder, picker, pixelratio, platform, react, refreshcontrol,
  settings, share, slider, statusbar, stylesheet, systrace,
  toggle, touchablehighlight, touchablenativefeedback, touchableopacity,
  touchablewithoutfeedback, vibration, virtualizedlist, webview,

  backhandler, datepickerandroid, drawerlayoutandroid, permissionsandroid,
  progressbarandroid, timepickerandroid, toastandroid, toolbarandroid, viewpagerandroid,

  actionsheetios, alertios, datepickerios, imagepickerios, maskedviewios, navigatorios,
  pickerios, progressviewios, safeareaview, segmentedcontrolios,
  snapshotviewios, statusbarios, tabbarios, vibrationios,

  animate, animated, easing, interpolate, newanimatedx, newanimatedxy, parallel, sequence, stagger,

  button, flatlist, image, scrollview, sectionlist, text, textinput, view, virtualizedlist
}
