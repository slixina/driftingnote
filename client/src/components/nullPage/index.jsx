import React, { Component } from 'react'
import { Image, View } from '@tarojs/components'
import img from '../../assets/icon-notfound.png';
import './index.scss';

function nullPage() {
    return <View className="wrap">
        <Image className="icon" src={img} mode="widthFix"></Image>
    </View>
}
export default nullPage