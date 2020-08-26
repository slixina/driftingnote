import { uploadFile } from "@tarojs/taro";
import Taro from '@tarojs/taro'
import md5 from './md5'

export async function uploadImage(directory ,file) {
    try {
        let res = await Taro.cloud.uploadFile({
            cloudPath: `${directory}/${md5(file)}.png`, // 上传至云端的路径
            filePath: file, // 小程序临时文件路径
        })
        console.log(res)
        if(res.statusCode === 204){
            return res.fileID
        } else {
            return res
        }
    } catch (error) {
        console.error(error)
        return res
    }
} 

export async function uploadImageList(directory ,fileList) {
    const tasks = []
    fileList.forEach(element => {
      const promise = uploadImage(directory, element)
      tasks.push(promise)
    });
    return (await Promise.all(tasks)).reduce((acc, ele) => {
      return [ ...acc, ele ]
    }, []) 
  }


export function getDate(time = (new Date()).getTime()) {
    let date = new Date(time)
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let mm = date.getMinutes();
    let s = date.getSeconds();

    function add0(num) {
        return num > 9 ? num : ('0'+num)
    }
    return y + '-' + add0(m) + '-' + add0(d);
}

export function getOpenerEventChannel() {
    const pages = Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
     return eventChannel
  }
