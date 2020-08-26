import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtCard } from "taro-ui"
import { getDate } from '../../utils/utils'
import server from '../../utils/server'
import NullPage from '../../components/nullPage/index';
import ICON_ADD from '../../assets/add.png'
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    if(this.haveLogin()) {
      this.init()
    }
    Taro.eventCenter.on('refreshList', () => {
      this.refresh()
    })
  }


  async init() {
    Taro.showLoading()
    await this.refresh()
    Taro.hideLoading()
    
  }

  async refresh() {
    try {
      let res = await server.getDriftingListByOpenId()
      this.setState({ list: [ ...res.result[0], ...res.result[1]] })
    } catch (error) {
      console.log(error)
    }
  }


  // 判断是否登录
  haveLogin() {
    if(Taro.getStorageSync('userInfo')) {
      return true
    }
    Taro.showModal({
      title: '提示',
      content: '您还未授权登录，请先登录',
      confirmText: '立即登录',
      success: (res) => {
        if(res.confirm) {
          console.log('点击确认')
          this.jumpLogin()
        } else {
          console.log('点击取消')
        }
      }
    })
    return false
  }

  
  jumpLogin() {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  shareApp() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  }

  onShareAppMessage() {
    return {
      title: '流浪之书',
      path: '/pages/drifting/index',
    }
  }

  handleItem(item) {
    console.log(item)
    Taro.navigateTo({
      url: `/pages/driftingDetails/index?details=${JSON.stringify(item)}`,
      success: (res) => {
        res.eventChannel.emit('acceptDriftingDetail', item )
      }
    })
  }

  handleAdd() {
    Taro.navigateTo({
      url: '/pages/driftingCreate/index'
    })
  }

  render() {
    const { list } = this.state
    return (
      <View className='index' >
        <View className="content">
          {
            list.map(item => <AtCard
              className="item"
              note={`发起时间：${getDate(item.createTime)} 发起人：${item.authorMsg.nickName}`}
              extra={item.flag ? '进行中' : '已结束'}
              title={item.title}
              thumb={item.authorMsg.avatarUrl}
              onClick={() => { this.handleItem(item) }}
            >
              {item.instructions.slice(0,80)}...
              </AtCard>
            )
          }
          { list.length === 0 
            &&
            <NullPage></NullPage>
          }
        </View>
        <Image className="icon-add" onClick={this.handleAdd} src={ICON_ADD} />
      </View>
    )
  }
}
