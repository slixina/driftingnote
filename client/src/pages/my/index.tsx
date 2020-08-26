import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.scss'
import server from '../../utils/server'
import AVATAR from '../../assets/default-avatar.png'

export default class My extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {}
    }
  }



  componentDidShow() {
    if(!this.judgeLoginStatus()) {
      this.ShowTips()
    }
  }

  ShowTips() {
    Taro.showModal({
      title: '提示',
      content: '请登录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          Taro.navigateTo({
            url: '/pages/login/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  // 获取登录状态
  judgeLoginStatus() {
    let userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      this.setState({userInfo})
      return true
    }
    return false
  }

  // 本地授权获取个人信息
  // async locolGetUserInfo() {
  //   let getSettingRes = await Taro.getSetting()
  //   // 已经授权
  //   if(getSettingRes.authSetting['scope.userInfo']) {
  //     let getUserInfoRes = await Taro.getUserInfo()
  //     const { userInfo } = getUserInfoRes
  //     this.setState({userInfo})
  //     Taro.setStorage({key: 'userInfo', data: userInfo})
  //     this.setUser(userInfo)
  //   } else {  // 没有授权
  //     setTimeout(() => {
  //       Taro.showToast({
  //         title: '请点击按钮授权登录',
  //         icon: 'none'
  //       })
  //     }, 1000)
  //   }
  // }

  // async setUser(userInfo) {
  //   let response = await server.setUser(userInfo)
  //   console.log({response})
  // }

  render() {

    return (
      <View className='index'>
        <View className="content">
          <Image className="avatar" src={this.state.userInfo.avatarUrl || AVATAR} />
        </View>
      </View>
    )
  }
}
