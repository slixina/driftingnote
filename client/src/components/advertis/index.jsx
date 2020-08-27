import React from 'react'
import { Swiper, SwiperItem, View, Image } from '@tarojs/components'

function advertis(props) {

    const { 
        indicatorColor = '#999',
        indicatorActiveColor = '#333',
        autoplay = true,
        circular = true,
        indicatorDots = true,
        url,
        imageList = []
    } = props

    return (
        <Swiper
            className='swiper'
            indicatorColor
            indicatorActiveColor
            circular
            indicatorDots
            autoplay>
            {
                imageList.map(ele => (
                    <SwiperItem className="swiperItem" key={ele}>
                        <View className='image-wrap'>
                            <Image className="img" src={ele} mode="widthFix" />
                        </View>
                    </SwiperItem>
                ))
            }
        </Swiper>
    )
}

export default advertis