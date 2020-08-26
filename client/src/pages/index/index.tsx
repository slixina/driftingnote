import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtGrid } from 'taro-ui'

import ICON_PLB from '../../assets/icon_piaoliuben.png'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          image: ICON_PLB,
          value: '漂流本',
          id: 'PLB',
          url: '/pages/drifting/index'
        },
      ]
    }
  }

  componentWillMount() { }

  handleItem(item) {
    console.log(item)
    Taro.navigateTo({
      url: item.url
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { list } = this.state

    return (
      <View className='index'>
        <AtGrid data={list} columnNum="2" onClick={this.handleItem.bind(this)} />
      </View>
    )
  }
}
