import Taro from '@tarojs/taro'
Taro.cloud.init()
const server = {
    

    // 创建用户
    setUser: async (payload) => {
        return await Taro.cloud
            .callFunction({
                name: "usercontroller",
                data: {
                    api:'setUser',
                    payload: payload
                }
            })
    },
    //获取openId
    getOpenId: async () => {
        return await Taro.cloud.callFunction({
            name: "usercontroller",
            data: {
                api:'getOpenId',
                payload: {}
            }
        })
    },

    //获取舔狗日记列表
    getDogDiaryList: async () => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'getDogDiaryList',
                    payload: {}
                }
            })
    },

    //获取真心话大冒险列表
    getTruthOrDareList: async () => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'getTruthOrDareList',
                    payload: {}
                }
            })
    },

    //获取毒鸡汤列表
    getPoisoneSoupList: async () => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'getPoisoneSoupList',
                    payload: {}
                }
            })
    },

    // 通过openid获取漂流本列表
    getDriftingListByOpenId: async (payload = {}) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'getDriftingListByOpenId',
                    payload
                }
            })
    },
    // 通过id获取漂流本列表
    getDriftingById: async (payload) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'getDriftingById',
                    payload
                }
            })
    },

    // 创建漂流本活动
    createDrifting: async (payload = {}) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'createDrifting',
                    payload
                }
            })
    },

    // 被邀请者加入漂流本活动
    joinDrifting: async (payload = {}) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'joinDrifting',
                    payload
                }
            })
    },
    // 漂流本参与者完成
    participantOver: async (payload = {}) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'participantOver',
                    payload
                }
            })
    },
    // 漂流本所有者完成
    authorOver: async (payload = {}) => {
        return await Taro.cloud
            .callFunction({
                name: "controller",
                data: {
                    api:'authorOver',
                    payload
                }
            })
    },
  

}

export default server