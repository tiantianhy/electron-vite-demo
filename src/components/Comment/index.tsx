import React, { MouseEvent, TouchEvent, useEffect, useRef, useState, useMemo } from 'react'
import { Checkbox } from 'antd';
import defaultStar from '@/assets/image/icon_star_default@2x.png'
import activeStar from '@/assets/image/icon_star_pre@2x.png'
import { starDataList} from './data'
import './index.css'

interface IProps {
  isLandscape: boolean;
}

interface Icomment {
  optionId: number;
  optionContent: string;
}
export default function Comment(props: IProps) {

  const {isLandscape} = props;
  const [mark, useMark] = useState(0); // 几颗星星
  let [remark, setRemark] = useState('您对本次学习满意吗?');
  let evaluationStarId = 0;
  let evaluationStarIdArr: any[] = []; // 星值id数组
  let starPositionArray = useRef<Array<number>>([]);
  let checkbox = false;
  let commentIds: any[] = [];
  let comments: string[] = []; // 评论内容
  let commentsText = ''; // 其他的话
  let commentItems1 = useRef<Array<Icomment>>([]);
  let commentItems2 = useRef<Array<Icomment>>([]);
  let commentItems3 = useRef<Array<Icomment>>([]);
  let commentItems4= useRef<Array<Icomment>>([]);
  let commentItems5 = useRef<Array<Icomment>>([]);
  let [commentItems, setCom] = useState<Array<Icomment>>([]);
  let oldMark: number;
  let startPos = {
    x:0,
    y:0
  }

  const getStar = () => {
    for (const index in starDataList) {
      const item = starDataList[index]
      switch (item.starValue) {
        case 1:
          commentItems1.current = item.dataList
          break
        case 2:
          commentItems2.current = item.dataList
          break
        case 3:
          commentItems3.current = item.dataList
          break
        case 4:
          commentItems4.current = item.dataList
          break
        case 5:
          commentItems5.current = item.dataList
          break
      }
      evaluationStarIdArr.push(item.evaluationStarId)
    }
    //  evaluationStarIdArr排个序
    evaluationStarIdArr = evaluationStarIdArr.sort()
  }

  const starDistance = () => {
    const starIconFirst:HTMLDivElement = document.getElementById('starIconFirst') as HTMLDivElement
    const starItemFirst: HTMLDivElement = document.getElementById('starItemFirst') as HTMLDivElement
      //  计算第一个星星左侧到屏幕左边的距离
      let starIconFirstX = 50;
      //  计算一个星星到另一个星星的距离
      let starItemFirstX = 20;
      if(starIconFirst != null) {
        starIconFirstX = isLandscape
        ? Number(starIconFirst.getBoundingClientRect().right -(starIconFirst.clientWidth + starItemFirst.clientWidth / 2))
        : Number(starIconFirst.getBoundingClientRect().right);

        starItemFirstX = starItemFirst.clientWidth
        for (let i = 0; i < 5; i++) {
          const starPosition = starIconFirstX + i * starItemFirstX
          starPositionArray.current.push(starPosition)
        }
      }



  }

  const touchstartStar = (event: MouseEvent) => {
    // 判断默认行为是否可以被禁用
    if (event.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!event.defaultPrevented) {
        event.preventDefault()
      }
    }

    //  记下旧mark值
    // let oldMark = mark
    // const touch = event.target //  touches数组对象获得屏幕上所有的touch，取第一个touch

    startPos = {
      x: event.pageX,
      y: event.pageY,
    } //  取第一个touch的坐标值
    for (let index = 0; index < starPositionArray.current.length; index++) {
      if (startPos.x > starPositionArray.current[index]) {
        useMark(index + 1)
        evaluationStarId = evaluationStarIdArr[index]
      }
    }
  }

  const touchmoveStar = (event: MouseEvent) => {
    // 判断默认行为是否可以被禁用
    if (event.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!event.defaultPrevented) {
        event.preventDefault()
      }
    }

    //  当屏幕有多个touch或者页面被缩放过，就不执行move操作
    // if (event.targetTouches.length > 1) {
    //   return
    // }

    // const touch = event.targetTouches[0]
    const endPos = {
      x: event.pageX - startPos.x,
      y: event.pageY - startPos.y,
    }

    const isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0 // isScrolling为1时，表示纵向滑动，0为横向滑动
    if (isScrolling === 0) {
      event.preventDefault() //  阻止触摸事件的默认行为，即阻止滚屏
      for (let index = 0; index < starPositionArray.current.length; index++) {
        if (endPos.x > starPositionArray.current[index]) {
          useMark(index + 1)
          evaluationStarId = evaluationStarIdArr[index]
        }
      }
    }
  }

  const touchendStar = (event: MouseEvent) => {
    // 判断默认行为是否可以被禁用
    // if (event.cancelable) {
    //   // 判断默认行为是否已经被禁用
    //   if (!event.defaultPrevented) {
    //     event.preventDefault()
    //   }
    // }
    if (mark === 5 && oldMark < 5) {
      comments = []
      commentIds = []
    }
    if (mark < 5 && oldMark === 5) {
      comments = []
      commentIds = []
    }
    switch (mark) {
      case 0:
        setRemark('您对本次学习满意吗')
        break
      case 1:
        setRemark('非常不满意，各方面很差')
        setCom(commentItems1.current.concat())
        break
      case 2:
        setRemark('不满意，比较差')
        setCom(commentItems2.current.concat())
        break
      case 3:
        setRemark('一般，需改善')
        setCom(commentItems3.current.concat())
        break
      case 4:
        setRemark('比较满意，仍可改善')
        setCom(commentItems4.current.concat())
        break
      case 5:
        setRemark('非常满意，无可挑剔')
        setCom(commentItems5.current.concat())
        break
    }
    console.log(commentItems, '----')
  }

  const clickComentItem = (item: Icomment) => {
    if (commentIds.indexOf(item.optionId) !== -1) {
      const index = commentIds.indexOf(item.optionId)
      commentIds.splice(index, 1)
      comments.splice(index, 1)
    } else {
      commentIds.push(item.optionId)
      comments.push(item.optionContent)
    }
  }


  useEffect(() => { // useEffect执行两次，解决办法：1.取消react18的严格模式；2.增加判断是否为null
    getStar();
    starDistance()
  }, [])
  return (
    <>
    <div className={isLandscape ? 'star-contain-compont-isLandscape' : 'star-contain-compont'}>
      <div id="starContainer" className="star-contain"
      onMouseEnter={(e:MouseEvent<HTMLDivElement>) => touchstartStar(e)}
      onMouseMove={(e:MouseEvent<HTMLDivElement>) => touchmoveStar(e)}
      onMouseLeave={(e:MouseEvent<HTMLDivElement>) => touchendStar(e)}
      >
        <div id="starItemFirst" className="star-item">
          <img
            id="starIconFirst"
            className="star-icon"
            src={mark > 0 ? activeStar : defaultStar}
          />
        </div>
        <div className="star-item">
          <img className="star-icon" src={mark > 1 ? activeStar : defaultStar} />
        </div>
        <div className="star-item">
          <img className="star-icon" src={mark > 2 ? activeStar : defaultStar} />
        </div>
        <div className="star-item">
          <img className="star-icon" src={mark > 3 ? activeStar : defaultStar} />
        </div>
        <div className="star-item">
          <img className="star-icon" src={mark > 4 ? activeStar : defaultStar} />
        </div>
      </div>
      <p className={mark > 0 ? 'active remark-landscape remark footer' : 'remark-landscape remark footer'}>{remark}</p>

      {
        mark > 0 ? (
          <div className="comment-contain" v-if="">
            <div className="comment">
              <div className="coment-column">
                 {
                  commentItems.map((item) => {
                     return <div className="coment-item" key={item.optionId}
                      onClick={() => clickComentItem(item)}
                     >{ item.optionContent }</div>
                  })
                 }
              </div>
            </div>

            <div className='describe'>
              <textarea className='field-class' placeholder='在这里可以描述你的其他评价' maxLength={300} id="textArea"></textarea>
            </div>

          </div>
        ) : ''
      }

      {
        mark <= 2 && mark !== 0 ? (
          <div className="checkbox-div">
            <Checkbox> 同意我们工作人员后续与您电话联系了解具体情况</Checkbox>
          </div>
        ) : ""

      }
    </div>
    </>
  )
}
