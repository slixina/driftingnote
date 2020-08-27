import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
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
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/波妞&宗介.jpg',
      'cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/TIM截图20191204221104.png'
    ]

    return (
      <View className='index'>
        <View className="advertis-wrap" >
          <Image className="banner" src="cloud://drifting-release-cgtfe.6472-drifting-release-cgtfe-1302968885/advertis/岁月的童话.png" mode="widthFix" />
        </View>

        <View className="content-wrap">
          {
            `最近漂流本有些火✨\n
            漂流本就是大家一起做一本手帐📕\n
            规则就是我搞一个手帐本👒\n
            大家一起在本本上写下自己的故事🌸\n
            或者自己喜欢的人🌼\n
            再装上一些想给下一个的小礼物🍄\n
            然后把他转寄给下一个人🌰\n
            最后本本回到我这里它就会充满了故事✨
            `
          }
        </View>
        <View className="btn" onClick={() => {
          Taro.navigateTo({
            url: '/pages/drifting/index'
          })
        }}>我的活动</View>
        {/* <AtGrid data={list} columnNum="2" onClick={this.handleItem.bind(this)} /> */}
      </View>
    )
  }
}
