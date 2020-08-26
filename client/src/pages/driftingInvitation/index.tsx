import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtInput, AtForm, AtTextarea, AtButton  } from 'taro-ui'
import server from '../../utils/server'
import { getDate, getOpenerEventChannel } from '../../utils/utils'


export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,    // 是否有效， 未超时 true   超时 false
      isMine: false,  // 是我创建的活动吗？ false: 不是  true: 是
      name: '',    // 姓名或者昵称
      address: '',   // 地址
      phone: '',
      driftingId: '',
      invitationDetails: {},
    }
  }

  componentDidMount() {
    const eventChannel = getOpenerEventChannel()
    if(JSON.stringify(eventChannel) === '{}') {       // 从分享入口进来
      console.log('---------分享入口----------')
      let param = JSON.parse(this.props.tid.split('=')[1].split('&')[0])
      this.setState({
        invitationDetails: param,
        name: param.name,
        address: param.address,
        phone: param.phone
      })
      console.log(param)
    } else {    // 从详情进来，发起邀请
      console.log('---------邀请入口----------')
      eventChannel.once('acceptDriftingId', (res) => {
        this.setState({driftingId: res.id, isMine: true})
        console.log('id: ', res.id)
      })
    }
  }
  componentDidShow() {
    let valid = this.haveValid(this.state.invitationDetails.createTime)
      this.setState({valid},() => {
        console.log(this.state.valid)
      })
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

  // 判断有效，是否超时
  haveValid(time) {
    if (!time) return false
    let now = new Date().getTime()
    if(now - time > 3*60*1000) {
      Taro.showToast({
        title: '邀请三分钟内有效，已超时',
        icon: 'none',
        duration: 5000
      })
      return false
    }
    return true
  }

  jumpLogin() {
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }
  async onHandleConfirm() {
    if(!this.haveLogin()) return
    Taro.showModal({
      title: '提示',
      content: '请您确认信息是否正确',
      confirmText: '确认',
      success: (res) => {
        if(res.confirm) {
          console.log('点击确认')
          this.joinDrifting()
        } else {
          console.log('点击取消')
        }
      }
    })
    
  }

  async joinDrifting() {
    Taro.showLoading()
    const userInfo = Taro.getStorageSync('userInfo')
    const param = {
      ...this.state.invitationDetails,
      ...userInfo,
      images: [],
      content: '',
      courierNumber: '',  // 快递单号
    }
    const response = await server.joinDrifting(param)
    console.log('joinDrifting: ',response)
    Taro.hideLoading()
    Taro.showToast({
      title: '加入活动成功'
    })
    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/drifting/index'
      })
    }, 1500);
  }

  handleNameChange(name) {
    this.setState({
      name
    })
    return name
  }

  handleAddressChange(address) {
    this.setState({
      address
    })
    return address
  }
  handlePhoneChange(phone) {
    this.setState({
      phone
    })
    return phone
  }

  onShareAppMessage() {
    const { name, address, phone, driftingId } = this.state
    let userInfo = Taro.getStorageSync('userInfo')
    let option = {
      driftingId,
      name,
      address,
      phone,
      createTime: (new Date()).getTime(),
      authorOpenId: userInfo.openId,
      flag: true, 
    }
    return {
      title: `${userInfo.nickName}邀请您加入漂流本活动`,
      path: `/pages/driftingInvitation/index?option=${JSON.stringify(option)}`,
    }
  }


  render() {
    const { name, address, phone, isMine, valid } = this.state
    return (
      <View className='index' >
        <AtForm>
          <AtInput
            disabled={!isMine}
            name='name'
            title='姓名/昵称'
            type='text'
            placeholder='阿甘'
            value={name}
            onChange={this.handleNameChange.bind(this)}
          />
          <AtInput
            disabled={!isMine}
            name='phone'
            title='手机号'
            type='number'
            placeholder='18888888888'
            value={phone}
            onChange={this.handlePhoneChange.bind(this)}
          />
        </AtForm>
          <View className="line"></View>
          <AtTextarea
            disabled={!isMine}
            count={true}
            value={address}
            onChange={this.handleAddressChange.bind(this)}
            maxLength={200}
            height={300}
            placeholder='详细收件地址：xxx省xxx市xxx区xxx街道xxx小区xxx栋xxx号'
          />
          <View className="line"></View>
          {
            isMine
            ? 
            (
              (!name || !address || !phone)
              ?
              <AtButton className="submit-none" type='secondary'>发送邀请</AtButton>
              :
              <AtButton className="submit" type='secondary' openType="share">发送邀请</AtButton>
            )
              :
            (
              valid 
              ?
              <AtButton className="submit" type='secondary' onClick={this.onHandleConfirm.bind(this)}>确认信息，加入活动</AtButton>
              :
              <AtButton className="submit-none" type='secondary'>确认信息，加入活动</AtButton>
            )
          }
      </View>
    )
  }
}
