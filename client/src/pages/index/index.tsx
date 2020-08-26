import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtGrid } from '@tarojs/components'
import Advertis from '../../components/advertis/index';
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

    let imageList = [
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/波妞.jpg',
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/岁月的童话.png',
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/波妞&宗介.jpg	',
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/TIM截图20191204221104.png'
    ]

    return (
      <View className='index'>
        <Advertis
          imageList={imageList}
        ></Advertis>
        {/* <AtGrid data={list} columnNum="2" onClick={this.handleItem.bind(this)} /> */}
      </View>
    )
  }
}
