import React, { createContext, useEffect, useRef, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Button } from 'antd';
import style from './index.module.scss'
// import data from '../../data/gaokao/list.json'
export default function Sort() {
  const [wordList, setWordList]= useState<Array<Array<string>>>([]);
  useEffect(() => {
    // const data  = require('../../data/gaokao/list.json');
    // console.log(data);
    fetch('http://localhost/admin/gaokao', {
      method: 'get',
    }).then((response) => response.json())
    .then((res) => {
      handlerWordList(res.data.list)
    }).catch((err) => {
      console.log(err, 'error');
    })
  }, [])

  const handlerWordList = (list: Array<string>) => {
    let ans:Array<Array<string>> = [];

    list.forEach((item: string) => {
      let firstWord: string = item.slice(0, 1).toUpperCase();
      if(ans[firstWord.charCodeAt(0) - 65]) {
        ans[firstWord.charCodeAt(0) - 65].push(item);
      }
      else {
        ans[firstWord.charCodeAt(0) - 65] = [item];
      }
    })
    setWordList(ans);
  }

  return (
    <>
      <div className={style.contianer}>
        <h1>单词本</h1>

        {
          wordList.map((item: Array<string>, index) => {
            return (
              <div className={style.sides} key={index}>
                <p id={'tt' + String.fromCharCode(index + 65)}>{String.fromCharCode(index + 65)}</p>
                {item.map((nItem) => <div className={style.line} key={nItem}>{nItem}</div> )}
              </div>
            )
          })
        }

        <div className={style.rightBox}>
          <div className={style.lis}>
            <ul>
            {
              wordList.map((item: Array<string>, index) => {
                return <li className={style.word} key={index}>
                  <a href={'#tt' + String.fromCharCode(index + 65)}>
                    {String.fromCharCode(index + 65)}
                  </a>
                </li>
              })
            }
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
