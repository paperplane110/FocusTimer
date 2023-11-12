<template>
  <div class="relative grid grid-rows-[auto,1fr,auto] min-h-screen text-left justify-center overflow-hidden">
    <div class="w-640px <sm:max-w-95vw border rounded-2xl my-8 px-8 py-4">
      <div class="mb-8 text-gray-400">
        <NuxtLink class="underline" to="/">Back to timer</NuxtLink>
      </div>

      <!-- Title -->
      <div class="flex justify-between items-end">
        <div class="text-4xl mb-2">Focus Timer v1.0</div>
        <div class="text-gray-400 text-sm">Coded by Tianyu</div>
      </div>
      <hr />
      <br />

      <!-- Built with -->
      <div class="flex items-center gap-2 mb-8">
        <RoundBtn><NuxtLink to="https://nuxt.com/">
          <Icon name="logos:nuxt-icon" class="text-lg dark:text-600" />
        </NuxtLink></RoundBtn>
        <RoundBtn><NuxtLink to="https://vuejs.org/">
          <Icon name="logos:vue" class="text-lg dark:text-600" />
        </NuxtLink></RoundBtn>
        <RoundBtn><NuxtLink to="https://windicss.org/">
          <Icon name="logos:windi-css" class="text-lg dark:text-600" />
        </NuxtLink></RoundBtn>
        <RoundBtn><NuxtLink to="https://gsap.com/">
          <Icon name="logos:greensock-icon" class="text-lg dark:text-600" />
        </NuxtLink></RoundBtn>
      </div>

      <!-- Contents -->
      <div class="grid grid-cols-1 gap-6">
        <div>Focus Timer，一个极简、专注、美观的番茄计时器</div>
        <div>
          做这么一个计时器的想法最初是在 2023.08.04 的晚上，
          当时我刚下班坐在公交车上，感觉工作了一天腰酸背痛，经常忘记站立和喝水。
        </div>
        <div>
          于是便想到似乎可以用番茄时钟的方法让自己的工作生活更加健康。
          那几天的晚上，我迅速在我的个人网站上实现了一般倒计时的原型，十分的简单粗暴，只有几个按钮和大大的数字，类似下图这样👇。
        </div>
        <div class="border rounded-xl flex flex-col justify-center items-center p-2">
          <div class="text-6xl">24:39</div>
          <div class="grid grid-cols-3">
            <div>start</div><div>stop</div><div>restart</div>
          </div>
        </div>
        <div>
          作为一个喜欢各种视觉设计的程序员🧑‍💻，显然这个样子我是不满意的。
          于是乎，在某天突然想到，以前同事的屏幕保护是一个非常极简主义的时钟。
          整个时钟只有文字，只有黑白灰，非常的干净利落。
        </div>
        <div>
          在网上冲浪一翻后，我找到了那个屏幕保护的出处：
          <NuxtLink class="text-emerald-500 underline" to="https://www.simonheys.com/portfolio/wordclock" target="_blank"><code>`wordclock`</code></NuxtLink>。
        </div>
        <div>
          其中旋转的那个时钟我看了十分的喜欢，由文字组成的时钟逆时针旋转，通过高亮来突出当前时刻，我只需要将这个时钟逻辑逆转，不就是倒计时了吗。
          可以说我这个 <code>`FocusTimer`</code> 的视觉方案完全是照抄了 Simon 大佬的创意。
        </div>
        <!-- <div>
          将这个 <code>`wordclock`</code> 变成我的 <code>`FocusTimer`</code>。
          但是事情不总是一帆风顺的，我此前从没写过这样环形布局、又能正转反转运动的组件。
        </div> -->
        <div>
          我十分兴奋的打算大干一场，花了一个周末的时间，搞出来一个歪歪扭扭原型。
          不出意外，由于<code>`CSS`</code>学到并不牢固，连查带写花了许多时间，但也写出了许多 bug，
          问题主要有四：
        </div>
        <div>
          <ul>
            <li> - 绝对定位、相对定位、位移写的有问题，导致不同圆环的单词有时不在同一直线</li>
            <li> - 布局不稳定，表盘会将固定高度的视窗撑出滚动条</li>
            <li> - 功能代码逻辑混乱，没想清楚计时器的几个状态转化</li>
            <li> - 动画鬼畜，旋转动画写的有瑕疵</li>
          </ul>
        </div>
        <div>
          毫无意外，这个小项目被搁置了几周。直到有天我突然看到
          <code>
            `<Icon name="logos:greensock-icon" class="text-lg dark:text-600" />GSAP`
          </code>
          更新官网的消息，
          便想着重拾此项目，顺便克服一下一直没学进去的 <code>`GSAP`</code>
        </div>
        <div>
          经过一个周五晚上和一整个周六的 coding，就有了现在这个小工具。
          魔鬼藏在细节里，很多的东西是写之前所没有考虑到的，因此趁着热乎劲，总结一下这个应用的实现思路
        </div>
        <hr />
        <div class="text-xl">🕒 布局：表盘</div>
        <div>
          表盘分为四大部分：分针表盘（蓝）、分种单位（m）、秒针表盘（绿）、秒种单位（s）。
          每一个环状的表盘的中心对齐整个窗口的正中心（红）
        </div>
        <div class="relative rounded-xl w-full h-200px border p-4">
          <div>window</div>
          <div class="absolute left-[50%] top-[50%] w-6px h-6px border-2 border-red-400 rounded-1 transform -translate-x-[50%] -translate-y-[50%]"></div>
          <div class="absolute left-[50%] top-[50%] w-150px h-150px border-4 border-green-400 rounded-1 transform -translate-x-[50%] -translate-y-[50%]"></div>
          <div class="absolute left-[50%] top-[50%] w-35 h-35 rounded-1 transform -translate-x-[50%] -translate-y-[50%]">
            <div class="relative left-[110%] top-[50%] select-none transform -translate-y-[50%]">s</div>
          </div>
          <div class="absolute left-[50%] top-[50%] w-80px h-80px border-4 border-blue-400 rounded-1 transform -translate-x-[50%] -translate-y-[50%]"></div>
          <div class="absolute left-[50%] top-[50%] w-15 h-15 rounded-1 transform -translate-x-[50%] -translate-y-[50%]">
            <div class="relative left-[130%] top-[50%] select-none transform -translate-y-[50%]">m</div>
          </div>
        </div>
        <div>
          对齐主要用到了相对位置（relative）、绝对位置（absolute）、位移（translate）等CSS；
          环状排列主要是用到了 v-for 和元素旋转（rotation）、旋转中心（origin-left）的配置等；
          最终等一切旋转起来后，还要保证元素不能撑开 window，这里又涉及到了 overflow- hidden 的作用范围。
        </div>
        <hr />
        <div class="text-xl">⏰ 倒计时：开始、暂停、继续、复位</div>
        <div>
          这一部分是倒计时功能代码，涉及到计时部分的功能：setInterval()、Date()等；
          而计时器状态的维护又大量使用到了 ref、watch()、compute() 等 vue 的 API；
          在实现过程中我遇到两个有点难度的问题。
        </div>
        <div>
          第一个问题是之前第一次尝试实现时遇到的，当页面在后台运行时，setInterval 似乎并没有工作，
          如果使用 setInterval 来累加经历的时长，那么这个‘时长’很可能会因为页面在后台而暂停。
          我的解决方法是把’累加‘变成’相减‘，setInterval 只用来更新一个’当前时刻‘。我点击开始时记录一个时间戳，
          不断的和当前时刻对比，这样子只要一更新当前时刻，我就能算出我所经历的时长了
        </div>
        <div class="border rounded-xl flex flex-col justify-center items-center p-4 gap-4">
          <div class="flex items-center">累加方法：
            <pre>Elapse = 1 + 1 + 1 + …</pre>
          </div>
          <div class="flex items-center">相减方法：
            <pre>Elapse = Now - Start</pre>
          </div>
        </div>
        <div>
          第二个是如何实现暂停后继续的逻辑，其实上面的 Now - Start 没有考虑暂停、继续的问题。
          一旦有了暂停，Now - Start 就会把暂停的部分也算进去。
        </div>
        <div>
          我最后的实现方法是，在暂停后记录一个暂停的总时长 dt。
          每次继续时，为了计算倒计时还剩多久，除了当前时刻减去开始时刻之外，再减去一个刚才记录的 dt。
          如果涉及多次暂停的话，就在之前 dt 的基础上不断的累加暂停时长即可。
          这样子就完美解决了暂停时长如何从倒计时中排除，以及多次暂停的问题。
        </div>
        <div class="border rounded-xl flex flex-col justify-center items-center p-4">
          <pre>Elapse = Now - Start - dt1 - dt2 - ... - dtn</pre>
        </div>
        <hr />
        <div class="text-xl">🌀 动起来：表盘旋转动画</div>
        <div>
          这一部分主要是用到了 gsap.to()，以及通过 vue 的 ref() 方法拿到文档元素。
          虽然只是不断旋转一个同样的角度，但是里面细节颇多。
        </div>
        <div>
          比如，如何模拟时钟秒针的那种‘tick-tock’的感觉，
          这里就涉及到动态曲线、以及动画时长的的配置。
        </div>
        <div>
          再有就是当表盘复位的时候，动画时长肯定不能是固定的，
          因为用户既可能在第10s复位，也可能在25分钟过完后再复位。
          而两者的复位旋转角度差距极大
        </div>
        <div>
          一开始我打算用一个线性函数来计算复位时间，但是还是不妥，
          因为线性函数还是会导致复位时间过长或过短的问题。
        </div>
        <div>
          最后我写了个 linear + clip 函数，如果线性函数计算出的复位时间小于 1s，那么我就补足到 1s；
          相应的，如果复位时间超过了 5s，就直接设置复位时间为 5s，
          从而保证在小角度复位时动画不会过快，而在大角度复位时也不会让用户一直等待。
        </div>
        <hr />
        <div class="text-xl">🔔 到点了：消息提示</div>
        <div>
          关于如何通过浏览器发消息这对我完全是新的领域，我目前只是用 Notification 接口写了简单的到点提醒。
          后续打算探索一下如何播放声音，或者直接使用系统提示音。
        </div>
        <hr />
        <br />
        <div class="text-xl">
          ……到这里似乎一个倒计时所需要的一切都已经写完了，但是等等，事情似乎没那么简单🤔……
        </div>
        <br />
        <hr />
        <div class="text-xl">再加点细节：魔鬼藏在细节里😈</div>
        <div class="text-lg">👀25？不对是26个数字</div>
        <div>
          请问25分钟的倒计时，分针的表盘有多少刻度？
        </div>
        <div>
          “25个！”即答。其实这样就忽视了开始时指针指向25而非24，
          并且当倒计时结束时指针指向0，所以分针表盘共26个数字。
          这个问题时我在写完整个应用后才发现，初始时刻时我的分针一直指向0，而非25，
          于是发现了这个小bug。
        </div>
        <div class="text-lg">💡高亮当前时刻的单词</div>
        <div>
          如果你留意的话，你会发现为了更好的突出当前的指针，
          会对当前时刻的单词进行<b>字体加粗</b>和颜色加深。
          同时还得保证高亮与熄灭的过渡动画和指针的旋转动画配合默契。
        </div>
        <div class="text-lg">✌️英文单复数</div>
        <div>
          请注意，表盘的时针和分针的单位不仅仅是 minute 和 second，
          而是应该根据指针的数字不断的变化单复数形式，好在这个判断比较简单，
          当指针是0、1时用单数，此外都是复数形式就行了。
        </div>
        <div class="text-lg">🚦状态指示、按键禁用、文本选择禁用</div>
        <div>
          首先为了弥补到点提示没提示音的先天不足，我在计时停止后通过彩色阴影的方式来展示状态：
          比如正在计时（绿色）、暂停（黄色）、计时结束（红色）。
          其中，正在计时时，为了遵循极简主义，只有 hover 才会展示绿色阴影。
          除此之外，整个界面维持黑白简洁的整体感。
        </div>
        <div>
          再有就是，播放、暂停、重置这几个按钮并不是全部时候都能按下的。
          比如暂停时，再按暂停键也没意义，需要通过设置 disable 和 cursor 的样式来明确提示用户才行。
        </div>
        <div>
          此外，我也不希望出现用户无意中选中表盘文字的情况，这会导致页面出现一堆没有意义的高亮文本。
          因此对于表盘上的文字需要禁用‘select’功能。
        </div>
        <div class="text-lg">🀄️ 语言切换</div>
        <div>
          在 `wordclock` 中有一种日语模式，可以看到中文字体在这种极简设计中效果也是不错。
          于是我尝试着把所有的英文都换成了繁体字，这样能更多的展示汉字的繁复、结构之美，
          试过之后感觉效果不错便留了下来，为此还得多写一套表盘的语言切换小逻辑。
        </div>
        <div class="text-lg">🧘 专注模式</div>
        <div>
          在写代码时，发现页面放大后的视角也是非常不错，
          因此在原版全局视角的基础上加上了‘专注模式’，即 Focus 模式，也算是一种点题了。
          这个功能主要是通过 gsap + scale + position 来实现的。
          放大视角后便能看到旋转动画与字母高亮的种种细节了。
        </div>
        <hr />
        <div class="text-xl">
          还能做什么：总结与展望
        </div>
        <div>
          上面就是这个计时器实现过程中我遇到的问题、思考过程和解决方法了。
          在这个过程中我学习了如下新知识
        </div>
        <div>
          <ul>
            <li> - 巩固了 CSS 布局、动画相关知识</li>
            <li> - GSAP 动画的基本使用方法</li>
            <li> - Notification API 发消息的基本使用方法</li>
            <li> - 如何写一个倒计时器</li>
          </ul>
        </div>
        <div>
          现在，一个番茄时钟的基本功能都已经实现了，我还能做些什么呢？
          我立刻想到了以下几个 feature：
        </div>
        <div>
          <ul>
            <li> - 🌓 Dark Mode</li>
            <li> - 🔙 更好的复位动画</li>
            <li> - 📱 响应式布局，如何适配移动端</li>
            <li> - 🍅 自定义多个番茄时长</li>
            <li> - 🎵 消息提示音</li>
          </ul>
        </div>
        <div>
          但是，现在我打算稍作休息，睡上一觉，享受只剩一半的周末了😎
        </div>
        <hr />
        <div class="text-right text-gray-400">2023-11-12 00:56</div>
        <div class="text-2xl text-center mb-8">
          周末愉快🎉
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang='ts'>

</script>

<style scoped>

</style>
