import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtInput, AtForm, AtTextarea, AtButton, AtImagePicker  } from 'taro-ui'
import { uploadImage, uploadImageList } from '../../utils/utils'

import server from '../../utils/server'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',    // 标题
      instructions: '',   // 说明
      images: []
    }
  }

  componentDidMount() {
    
  }



  handleTitleChange(title) {
    this.setState({
      title
    })
    return title
  }
  handleInstructioInsChange(instructions) {
    this.setState({
      instructions
    })
    return instructions
  }

  async uploadImageList() {
    const list = this.state.images.reduce((pre, ele) => {
      return [ ...pre, ele.url ]
    }, [])
    return await uploadImageList('drifting', list)
  }

  handleSubmit() {
    const { title, instructions } = this.state
    if(!title) {
      Taro.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      return
    }
    if(!instructions) {
      Taro.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      return
    }

    let payload = {
      title,
      instructions,
      createTime: (new Date()).getTime(),
      authorMsg: Taro.getStorageSync('userInfo'),
      participant: [],
      status: true,  //  状态： true进行中  false 已完成
      flag: true, // true正常  false 废弃/删除
    }
    this.createDrifting(payload)
  }

  async createDrifting(payload) {
    try {
      Taro.showLoading({
        title: '图片上传中'
      })
      const images = await this.uploadImageList()
      Taro.hideLoading()
      Taro.showLoading({
        title: '活动创建中'
      })
      let res = await server.createDrifting({
        ...payload,
        images
      })
      console.log('创建活动：',res)
      Taro.hideLoading()
      if(res.errMsg === 'cloud.callFunction:ok') {
        Taro.showToast({
          title: '创建成功',
        })
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/drifting/index'
          })
        }, 2000);
      } else {
        Taro.showToast({
          title: '创建失败，请稍后重试',
          icon: 'none'
        })
      }
    } catch (error) {
      console.log('catch error: ', error)
      Taro.hideLoading()
      Taro.showToast({
        title: '创建失败，请稍后重试',
        icon: 'none'
      })
    }
  }

  onHandleImageChange(images) {
    if(images.length > 4) {
      Taro.showToast({
        title: '最多只能上传四张照片',
        icon: 'none'
      })
      return
    }
    this.setState({ images })
  }

  onShareAppMessage() {
    return {
      title: '流浪之书',
      path: '/pages/drifting/index',
    }
  }


  render() {
    // const { list } = this.state
    return (
      <View className='index' >
        <AtForm>
          <AtInput
            name='title'
            title='标题'
            type='text'
            placeholder='阿乐の漂流本之旅'
            value={this.state.title}
            onChange={this.handleTitleChange.bind(this)}
          />
        </AtForm>
          <View className="line"></View>
          <AtTextarea
            count={true}
            value={this.state.instructions}
            onChange={this.handleInstructioInsChange.bind(this)}
            maxLength={800}
            height={500}
            placeholder='关于：1、发起人介绍；2、本子内容；3、漂流计划；4、注意事项......'
          />
          <View className="line"></View>
          <View className="AtImagePicker-wrap">
            <AtImagePicker
              count={4}
              files={this.state.images}
              onChange={this.onHandleImageChange.bind(this)}
            />
          </View>
          <AtButton className="submit" type='secondary' onClick={this.handleSubmit.bind(this)}>提交</AtButton>
      </View>
    )
  }
}
