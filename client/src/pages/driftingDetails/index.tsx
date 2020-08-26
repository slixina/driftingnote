import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtInput, AtForm, AtTimeline, AtImagePicker, AtButton, AtTextarea } from 'taro-ui'
import server from '../../utils/server'
import { getDate, uploadImage, getOpenerEventChannel } from '../../utils/utils'
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      participantFlag: false,        // 参与者是否完成
      details: {
        createTime: '',
        instructions: '',
        participant: [],
        status: false,
        title: '',
        authorContent: {},
        authorMsg: {}
      },
      files: [],
      leaveMessage: '', // 留言
      courierNumber: '',  // 快递单号

      authorLeaveMessage: ''    // 所有者留言
    }
  }

  // 刷新列表
  refreshList() {
    Taro.eventCenter.trigger('refreshList')
  }

  componentDidMount() {
    this.setState({ userInfo: Taro.getStorageSync('userInfo') })
    let eventChannel = getOpenerEventChannel()
    eventChannel.once('acceptDriftingDetail', (res) => {
      console.log(res)
      this.setState({ details: res, participantFlag: (res.participant.filter(ele => ele.openId === this.state.userInfo.openId).[0] || {}).flag })
    })
  }

  handleInvitation() {
    Taro.navigateTo({
      url: `/pages/driftingInvitation/index`,
      success: (res) => {
        res.eventChannel.emit('acceptDriftingId', { id: this.state.details._id })
      }
    })
  }

  onHandleConfirm() {
    const _this = this
    Taro.showModal({
      title: '提示',
      content: '确认完成之后将无法再修改',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.participantsConfirm()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  onHandleAuthorConfirm() {
    const _this = this
    Taro.showModal({
      title: '提示',
      content: '确认完成结束此次漂流活动',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.authonConfirm()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  // 参与者确认完成
  async participantsConfirm() {
    const { leaveMessage, courierNumber, details: { _id } } = this.state
    if (!leaveMessage || !courierNumber) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    Taro.showLoading()
    let response = await server.participantOver({ _id, leaveMessage, courierNumber, overTime: (new Date()).getTime() })
    Taro.hideLoading()
    console.log(response)
    if(response.errMsg === 'cloud.callFunction:ok') {
      Taro.showToast({
        title: '已确认',
      })
      this.setState({participantFlag: false})
      this.refresh()
    }
  }

  // 所有者确认完成
  async authonConfirm() {
    const { authorLeaveMessage,  details: { _id } } = this.state
    if (!authorLeaveMessage) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }

    // 确认完成
    Taro.showLoading()
    let response = await server.authorOver({ _id, authorLeaveMessage, overTime: (new Date()).getTime() })
    Taro.hideLoading()
    console.log(response)
    if(response.errMsg === 'cloud.callFunction:ok') {
      Taro.showToast({
        title: '已确认',
      })
      this.refresh()
    }
  }

  async refresh() {
    const { details: { _id } } = this.state
    let result = await server.getDriftingById(_id)
    console.log('refresh: ',result)
    this.setState({ details: result.result })
    this.refreshList()   // 刷新列表
  }

  _disposeTimeLine() {
    const { participant = [] } = this.state.details
    const list = []
    participant.forEach(element => {
      list.push({
        icon: 'clock',
        title: `${getDate(element.createTime)} ${element.nickName} in ${element.city}`,
        content: [
          <Image className="avatar" src={element.avatarUrl} />,
          `*邮寄地址：${element.address}`,
          `*手机号码：${element.phone}`,
          element.courierNumber && `*快递单号：${element.courierNumber}`,
          element.leaveMessage && `*留言：${element.leaveMessage}`,
        ]
      })
    });
    return list
  }

  onHandleCourierNumberChange(courierNumber) {
    this.setState({ courierNumber })
  }

  onHandleImageChange(files) {
    this.setState({ files })
  }

  handleLeaveMessageChange(leaveMessage) {
    this.setState({ leaveMessage })
  }
  handleAuthorLeaveMessageChange(authorLeaveMessage) {
    this.setState({ authorLeaveMessage })
  }

  onShareAppMessage() {
    return {
      title: '流浪之书',
      path: '/pages/drifting/index',
    }
  }


  render() {
    const { createTime, instructions, participant, status, images, title, authorContent, authorMsg, authorOpenId, flag, authorLeaveMessage } = this.state.details


    return (
      <View className='index' >
        <View className='at-article'>
          <View className='at-article__h1'>
            {title}
          </View>
          <View className='at-article__info'>
            {getDate(createTime)}&nbsp;&nbsp;&nbsp;{authorMsg.nickName}
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__p'>
                活动详情：{instructions}
              </View>
              <View className='at-article__p'>
                {
                (images || []).length > 0
                &&
                images.map(ele => <Image style="width:100%;" src={ele} mode="widthFix" />)
                }
              </View>
              {
                authorLeaveMessage 
                && 
                <View className='at-article__p'>
                  结束留言：{authorLeaveMessage}
              </View>
              }
            </View>
          </View>
          { (authorOpenId === this.state.userInfo.openId) && flag && <View className="btn-invitation" onClick={this.handleInvitation.bind(this)}>邀请成员</View>}
          <View className="line"></View>
          { participant.length > 0 && <View className="p-title">参与成员</View>}
          <AtTimeline
            className="AtTimeline"
            pending
            items={this._disposeTimeLine()}
          >
          </AtTimeline>
          <View className="line"></View>
          {
            this.state.participantFlag
            &&
            <View>
              <View className="p-title">填写信息确认完成</View>
              <AtForm>
                <AtInput
                  name='courierNumber'
                  title='快递单号'
                  type='text'
                  placeholder='ZJS888888888'
                  value={this.state.courierNumber}
                  onChange={this.onHandleCourierNumberChange.bind(this)}
                  onBlur={(e) => {
                    Taro.pageScrollTo({
                      scrollTop: 0,
                    })
                  }}
                />
              </AtForm>
              <View className="line"></View>
              <AtTextarea
                count={true}
                value={this.state.leaveMessage}
                onChange={this.handleLeaveMessageChange.bind(this)}
                maxLength={500}
                height={500}
                placeholder='留言： 醉后不知天在水，满船清梦压星河......'
                onBlur={(e) => {
                  Taro.pageScrollTo({
                    scrollTop: 0,
                  })
                }}
              />
              <View className="line"></View>
              <AtButton type='secondary' onClick={this.onHandleConfirm.bind(this)}>完成</AtButton>
            </View>
          }
          {
            (authorOpenId === this.state.userInfo.openId) && flag
            &&
            <View>
              <AtTextarea
                count={true}
                value={this.state.authorLeaveMessage}
                onChange={this.handleAuthorLeaveMessageChange.bind(this)}
                maxLength={500}
                height={500}
                placeholder='留言： 醉后不知天在水，满船清梦压星河......'
              />
              <View className="line"></View>
              <AtButton type='secondary' onClick={this.onHandleAuthorConfirm.bind(this)}>完成</AtButton>
            </View>
          }
        </View>
      </View>
    )
  }
}
