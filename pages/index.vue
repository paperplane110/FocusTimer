<template>
  <div class="relative flex flex-col min-w-screen min-h-screen overflow-hidden">
    <!-- Panel -->
    <div class="absolute right-[2rem] top-[50vh] bg-light-100 border rounded-full px-4 py-4 grid grid-cols-1 gap-4 transform -translate-y-[50%]
      <lg:(right-[50vw] bottom-[2rem] top-auto flex translate-y-0 translate-x-[50%])
    ">
      <RoundBtn @click="switchFocus" :isActivated="isFocus"><Icon name="uil:focus-target" class="text-md dark:text-600" /></RoundBtn>
      <RoundBtn @click="switchLanguage" :isActivated="isChinese()"><Icon name="uil:english-to-chinese" class="text-md dark:text-600" /></RoundBtn>
      <RoundBtn @click="switchConsoleShow" :isActivated="isConsoleShow"><Icon name="uil:brackets-curly" class="text-md dark:text-600" /></RoundBtn>
      <hr />
      <RoundBtn :isActivated="false"><NuxtLink to="/about">
        <Icon name="uil:lightbulb-alt" class="text-md dark:text-600" /></NuxtLink>
      </RoundBtn>
      <RoundBtn :isActivated="false"><NuxtLink to="https://github.com/paperplane110/FocusTimer" target="_blank">
        <Icon name="uil:github-alt" class="text-md dark:text-600" /></NuxtLink>
      </RoundBtn>
    </div>

    <div v-show="isConsoleShow" class="absolute right-[8rem] top-[50vh] bg-light-100 border rounded-2xl px-8 py-4 transform -translate-y-[50%]">
      <p class="text-4xl">Console</p>
      <br />
      <p class="text-2xl">Language: {{ lang }}</p>
      <br />
      <p class="text-2xl">Timer state</p>
      <p>isCounting: {{ isCounting }}</p>
      <p>isPause: {{ isPause }}</p>
      <p>isTomato: {{ isTomato }}</p>
      <br />
      <p class="text-2xl">Timestamps</p>
      <p>startTimeStamp: {{ startTimeStamp }}</p>
      <p>pauseTimeStamp: {{ pauseTimeStamp }}</p>
      <p>dt: {{ dt }}</p>
      <br />
      <p class="text-2xl">Elapse</p>
      <p>elapse ms: {{ elapseMs }}</p>
      <p>elapse sec: {{ elapseSec }}</p>
      <p>elapse min: {{ elapseMin }}</p>
      <p>accumulate sec: {{ accumSec }}</p>
      <p>accumulate min: {{ accumMin }}</p>
      <br />
    </div>

    <!-- Knob -->
    <div
      ref="knob"
      class="absolute z-10 left-[50vw] top-[50vh]
      flex flex-col justify-center items-center
      border rounded-1
      w-200px h-200px
      transform -translate-x-[50%] -translate-y-[50%] transition-shadow"
      :class="[isTomato ? 'shadow-xlc-red' : isPause? 'shadow-xlc-orange' : 'shadow-xlc-green']"
    >
      <p class="text-gray-400 text-3xl font-thin select-none">{{ formatCountdown().min }}:{{ formatCountdown().sec }}</p>
      <div class="flex">
        <button
          class="w-12 h-12 flex-center rounded-1 text-gray-400 transition-colors hover:(text-gray-600 dark:text-gray-200) disabled:(text-gray-400 cursor-not-allowed)"
          @click="startTimer">
          <Icon name="fa6-solid:play" class="text-xl dark:text-600" />
        </button>
        <button
          class="w-12 h-12 flex-center rounded-1 text-gray-400 transition-colors hover:(text-gray-600 dark:text-gray-200) disabled:(text-gray-400 cursor-not-allowed)"
          @click="pauseTimer" :disabled="isPause || !isCounting">
          <Icon name="fa6-solid:pause" class="text-xl dark:text-600" />
        </button>
        <button
          class="w-12 h-12 flex-center rounded-1 text-gray-400 transition-colors hover:(text-gray-600 dark:text-gray-200) disabled:(text-gray-400 cursor-not-allowed)"
          @click="resetTimer" :disabled="!isCounting">
          <Icon name="fa6-solid:rotate-left" class="text-xl dark:text-600" />
        </button>
      </div>
    </div>

    <!-- Minute -->
    <div ref="minDial"
      class="absolute -z-10 left-[50vw] top-[50vh] w-100px h-100px transform -translate-x-[50%] -translate-y-[50%]">
      <div v-for="(num, idx) in zeroToSixty.slice(TOMATO, TOMATO+1).concat(zeroToSixty.slice(0, TOMATO))" :key="idx"
        class="absolute left-[50%] top-[50%] w-55 text-gray-300 text-right select-none transition transform -translate-y-[50%] origin-left rotate-6"
        :class="isMinuteDivActive(idx) ? 'font-bold text-black dark:text-gray-200' : 'text-gray-200 dark:text-gray-600'"
        :style="`--tw-rotate: ${(idx) * minTomatoDeg()}deg`">
        {{ num }}
      </div>
    </div>
    <div ref="minText" class="absolute left-[50vw] top-[50vh] w-100px h-100px transform -translate-x-[50%] -translate-y-[50%]">
      <div class="relative left-[280%] top-[50%] select-none transform -translate-y-[50%]">{{ lang === "en" ? minuteOrMinutes : "分鐘" }}</div>
    </div>

    <!-- Second -->
    <div ref="secDial"
      class="absolute -z-10 left-[50vw] top-[50vh] w-100px h-100px transform -translate-x-[50%] -translate-y-[50%]">
      <div v-for="(num, idx) in zeroToSixty" :key="idx"
        class="absolute left-[50%] top-[50%] w-110 <lg:w-99 text-gray-300 text-right select-none transition transform -translate-y-[50%] origin-left rotate-6"
        :class="isSecondDivAcitve(idx) ? 'font-bold text-black dark:text-gray-200' : 'text-gray-200 dark:text-gray-600'"
        :style="`--tw-rotate: ${idx * 6}deg`">
        {{ num }}
      </div>
    </div>
    <div ref="secText" class="absolute left-[50vw] top-[50vh] w-100px h-100px transform -translate-x-[50%] -translate-y-[50%]">
      <div class="relative left-[510%] <lg:left-[450%] top-[50%] select-none transform -translate-y-[50%]">{{ lang === "en" ? secondOrSeconds : "秒鐘" }}</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { gsap } from "gsap"

// Tomatos
const TOMATO = ref(25)
const tomatoNum = ref(1)
const totalMs = TOMATO.value * tomatoNum.value * 60 * 1000

// Dial Array
const lang = ref("en")
const zeroToSixty = computed(() => {
  if (lang.value == "en") {
    return [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
      "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine",
      "thirty", "thirty-one", "thirty-two", "thirty-three", "thirty-four", "thirty-five", "thirty-six", "thirty-seven", "thirty-eight", "thirty-nine",
      "forty", "forty-one", "forty-two", "forty-three", "forty-four", "forty-five", "forty-six", "forty-seven", "forty-eight", "forty-nine",
      "fifty", "fifty-one", "fifty-two", "fifty-three", "fifty-four", "fifty-five", "fifty-six", "fifty-seven", "fifty-eight", "fifty-nine",
    ]
  } else {
    return [
      "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖",
      "壹拾", "拾壹", "拾贰", "拾叁", "拾肆", "拾伍", "拾陆", "拾柒", "拾捌", "拾玖",
      "贰拾", "贰拾壹", "贰拾贰", "贰拾叁", "贰拾肆", "贰拾伍", "贰拾陆", "贰拾柒", "贰拾捌", "贰拾玖",
      "叁拾", "叁拾壹", "叁拾贰", "叁拾叁", "叁拾肆", "叁拾伍", "叁拾陆", "叁拾柒", "叁拾捌", "叁拾玖",
      "肆拾", "肆拾壹", "肆拾贰", "肆拾叁", "肆拾肆", "肆拾伍", "肆拾陆", "肆拾柒", "肆拾捌", "肆拾玖",
      "伍拾", "伍拾壹", "伍拾贰", "伍拾叁", "伍拾肆", "伍拾伍", "伍拾陆", "伍拾柒", "伍拾捌", "伍拾玖",
    ]
  }
})

// Refs and degrees
const knob = ref()
const minText = ref()
const secText = ref()
const minDial = ref()
const minDeg = 6
const minTomatoDeg = () => 360/(TOMATO.value+1)
const secDial = ref()
const secDeg = 6

// timer state
const isCounting = ref(false)
const isPause = ref(false)
const isTomato = ref(false)

// Time
const nowTimeStamp = ref(0)
const pauseTimeStamp = ref(0)
const dt = ref(0) // to store the delta time while the timer has been paused
const startTimeStamp = ref(0)

const elapseMs = ref(0)
const elapseSec = ref(0)
const elapseMin = ref(0)
const accumSec = ref(0)
const accumMin = ref(0)
let lastAccumSec = ref(0)
let lastAccumMin = ref(0)


// Update elapse time
const checkOverFlow = () => {
  if (totalMs <= elapseMs.value) {
    elapseMs.value = totalMs
    isTomato.value = true
    pauseTimer()
  }
}

const updateElapse = watch(nowTimeStamp, () => {
  checkOverFlow()
  if (isCounting.value && !isPause.value) {
    elapseMs.value = nowTimeStamp.value - startTimeStamp.value - dt.value
  }
})

watch(elapseMs, () => {
  elapseSec.value = Math.ceil(elapseMs.value / 1000) % 60
  elapseMin.value = Math.ceil(elapseMs.value / 1000 / 60)
  accumSec.value = Math.ceil(elapseMs.value / 1000)
  accumMin.value = Math.ceil(elapseMs.value / 1000 / 60)

  let dSec, dMin
  let ease = "back.out(1.3)"
  if (elapseMs.value < lastAccumSec.value) {
    // when reset the timer, rotating longer
    dSec = (lastAccumSec.value * secDeg) / 360 * 3
    dMin = (lastAccumMin.value * minTomatoDeg()) / 360 * 2
    if (dSec < 1) dSec = 1
    else if (dSec > 5) dSec = 5
    ease = "power3.inOut"
  } else {
    dSec = 0.2
    dMin = 0.2
  }

  rDial(secDial, secDeg, accumSec.value, dSec, ease)
  rDial(minDial, minTomatoDeg(), accumMin.value, dSec, ease)
  lastAccumSec.value = accumSec.value
  lastAccumMin.value = accumMin.value
})

const rDial = (dialRef: Ref, per: number, accum: number, d: number, ease = "power1.out") => {
  gsap.to(dialRef.value, {
    rotation: per * accum,
    duration: d,
    ease: ease,
  })
}

const isSecondDivAcitve = (idx: number) => (elapseSec.value === 0) ? idx === 0 : idx === (60 - elapseSec.value)
const isMinuteDivActive = (idx: number) => (elapseMin.value === 0) ? idx === 0 : idx === (TOMATO.value +1 - elapseMin.value)


// Timer Functions
const startTimer = () => {
  // time is stopped, start counting
  if (!isCounting.value) {
    startTimeStamp.value = nowTimeStamp.value
  }

  // timer is paused, need continue
  if (isPause.value) {
    dt.value += nowTimeStamp.value - pauseTimeStamp.value
    pauseTimeStamp.value = 0
    isPause.value = false
  }

  isCounting.value = true
}

const pauseTimer = () => {
  isPause.value = true
  pauseTimeStamp.value = nowTimeStamp.value
}

const resetTimer = () => {
  if (!isPause.value) {
    pauseTimer()
  }
  // wait for the last tick
  setTimeout(() => {
    startTimeStamp.value = 0
    pauseTimeStamp.value = 0
    isPause.value = false
    isCounting.value = false
    isTomato.value = false
    dt.value = 0
    elapseMs.value = 0
  }, 200)
}


// Countdown Display
const secondOrSeconds = ref("second")
const minuteOrMinutes = ref("minute")
const formatCountdown = () => {
  const countdown = (totalMs - elapseMs.value) / 1000
  const min = Math.floor(countdown / 60)
  const sec = Math.floor(countdown % 60)

  if (min <= 1) minuteOrMinutes.value = "minute"
  else minuteOrMinutes.value = "minutes"
  if (sec <= 1) secondOrSeconds.value = "second"
  else secondOrSeconds.value = "seconds"

  return {
    min: min >= 10 ? min.toString() : "0" + min.toString(),
    sec: sec >= 10 ? sec.toString() : "0" + sec.toString(),
  }
}


// Notification
const permission = ref<NotificationPermission>()

watch(isTomato, (newTomato) => {
  if (newTomato) {
    console.log("Time is out")
    const notification = new Notification("Focus Timer", {
      body: "Time is up! Take some rest ☕️",
      vibrate: [200, 100, 200],
      tag: "FocusTimer",
      renotify: true,
    })
  }
})


// Panel state
const isConsoleShow = ref(false)
const switchConsoleShow = () => isConsoleShow.value = !isConsoleShow.value
const isChinese = () => lang.value === "zh" ? true : false
const switchLanguage = () => {
  if (lang.value === "zh") lang.value = "en"
  else lang.value = "zh"
}


// Focus
const isFocus = ref(false)
let tween: GSAPAnimation

const switchFocus = () => {
  console.log(isFocus.value)
  if (!isFocus.value) {
    console.log("focus")
    tween.play()
  } else {
    console.log("un-focus")
    tween.reverse()
  }
  isFocus.value = !isFocus.value
}



onMounted(() => {
  const timerRefGroup = [
    knob.value,
    minDial.value, minText.value,
    secDial.value, secText.value,
  ]
  tween = gsap.to(timerRefGroup, {
    x: "-35vw",
    scale: 1.5,
    ease: "power3.inOut",
    paused: true,
  })

  const timer = setInterval(() => {
    nowTimeStamp.value = Date.now() * 1
  }, 100)

  if (!("Notification" in window)) {
    // TODO add toast
    console.log("This browser does not support notifications.");
  }
  Notification.requestPermission().then((perm) => permission.value = perm)
})
</script>

<style scoped>
.shadow-xlc-green {
  box-shadow: none
}

.shadow-xlc-green:hover {
  box-shadow: 0 0 34px 6px rgba(46, 210, 9, 0.25)
}

.shadow-xlc-red {
  box-shadow: 0 0 34px 6px rgba(210, 9, 9, 0.2)
}

.shadow-xlc-orange {
  box-shadow: 0 0 34px 6px rgba(255, 204, 35, 0.2)}
</style>
