import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import './app.scss'

class App extends Component {

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        // env: 'drifting-release-cgtfe',
        env: 'drifting-dev-n4ip7',
        traceUser: true,
      })

    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
