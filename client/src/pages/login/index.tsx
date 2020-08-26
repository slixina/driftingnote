import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.scss'
import server from '../../utils/server'
import AVATAR from '../../assets/default-avatar.png'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {}
    }
  }


  // async locolGetUserInfo() {
  //   let getSettingRes = await Taro.getSetting()
  //   // 已经授权
  //   if(getSettingRes.authSetting['scope.userInfo']) {
  //     let getUserInfoRes = await Taro.getUserInfo()
  //     console.log(getUserInfoRes)
  //     const { userInfo } = getUserInfoRes
  //     this.setState({userInfo})
  //     this.setUser(userInfo)
  //   } else {  // 没有授权
      
  //   }
  // }

  async setUser(userInfo) {
    let response = await server.setUser(userInfo)
    console.log({response})
  }

  async getOpenId() {
    let response = await server.getOpenId()
    console.log({response})
    return response.result
  }

  async getUserInfo(e){
    if(e.detail.errMsg === 'getUserInfo:ok') {
      const { userInfo } = e.target
      this.setUser(userInfo)
      const openId = await this.getOpenId()
      Taro.setStorageSync('userInfo', { ...userInfo, openId})
      Taro.showToast({
        title: '授权成功',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000);
    } else {
      Taro.showToast({
        title: '授权失败，请重试',
        icon: 'none'
      })
    }
  }

  render() {

    return (
      <View className='index'>
        <View className="content">
          <Image className="avatar" src={this.state.userInfo.avatarUrl || AVATAR} />
          <Button className="getUserInfo" openType="getUserInfo" onGetUserInfo={this.getUserInfo.bind(this)}>点击授权获取头像</Button>
        </View>
      </View>
    )
  }
}
