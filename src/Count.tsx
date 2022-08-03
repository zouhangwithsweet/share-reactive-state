import { useEffect, useRef, useState } from 'react'


/**
 * 解析毫秒为天、时、分、秒
 * @param milliseconds 毫秒
 */
const parseMs = (milliseconds: number) => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
  }
}

/**
 * 倒计时
 * @unit ms
 * @param endTimeStamp 结束时间的时间戳
 */
export const useCountDown = (endTimeStamp: number) => {
  const timer = useRef(0)
  const [state, setState] = useState(endTimeStamp)

  // 计算时间的差值
  const calcTimeDiff = () => {
    // 获取当前时间戳
    // const currentTime = +new Date()
    // 计算当前时间和结束时间的差值
    // const seconds = Math.floor((endTimeStamp || 0) - currentTime)
    // const seconds = Math.floor(endTimeStamp || 0)
    // 如果是负数 就清空定时器
    // console.log(state)
    if (state <= 0) {
      clearInterval(timer.current)
      return setState(0)
    }
    setState((seconds) => seconds - 1000)
  }

  useEffect(() => {
    calcTimeDiff()
    setState(endTimeStamp)
    timer.current = window.setInterval(() => {
      calcTimeDiff()
    }, 1000)
    return () => {
      clearInterval(timer.current)
    }
  }, [endTimeStamp])

  if (state <= 0) {
    clearInterval(timer.current)
    console.log('done')
  }
  const { days, hours, minutes, seconds } = parseMs(state)
  console.log(days, hours, minutes, seconds)
  return { days, hours, minutes, seconds }
}


export const CountDown = ({ date, disabled = true }: { date: number; disabled: boolean }) => {
  const { days, hours, minutes, seconds } = {days:0, hours: 0, minutes: 0, seconds:0}
  const cubeClasses =
    'relative w-76px h-76px bg-#cdffff bg-opacity-20 rounded-2xl flex-center text-secondary text-4xl font-bold lt-sm:w-52px lt-sm:h-52px lt-sm:text-xl'

  return (
    <div className="mt-3 flex items-center justify-between pb-6">
      <span className={cubeClasses}>
        {disabled ? '--' : days}{' '}
        <span className="absolute bottom-0 translate-y-full text-sm text-gray-secondary font-normal">Days</span>
      </span>
      {/* <Colon className="lt-sm:scale-80" /> */}
      <span className={cubeClasses}>
        {disabled ? '--' : hours}{' '}
        <span className="absolute bottom-0 translate-y-full text-sm text-gray-secondary font-normal">Hours</span>
      </span>
      {/* <Colon className="lt-sm:scale-80" /> */}
      <span className={cubeClasses}>
        {disabled ? '--' : minutes}{' '}
        <span className="absolute bottom-0 translate-y-full text-sm text-gray-secondary font-normal">Minutes</span>
      </span>
      {/* <Colon className="lt-sm:scale-80" /> */}
      <span className={cubeClasses}>
        {disabled ? '--' : seconds}{' '}
        <span className="absolute bottom-0 translate-y-full text-sm text-gray-secondary font-normal">Seconds</span>
      </span>
    </div>
  )
}
