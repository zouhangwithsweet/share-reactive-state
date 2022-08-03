---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: public/bg.jpeg
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
---

# 响应式管理状态

<div>Vue <carbon:train-heart class="text-[#fff8dc]"/> React </div>

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 p-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    <carbon:arrow-right class="inline"/>
  </span>
</div>


<a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub" class="abs-br m-6 text-xl icon-btn opacity-50 !border-none !hover:text-white">
  <carbon-logo-github />
</a>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

# 现代前端框架似乎离不开状态管理

<p>无论是 <logos:vue />Vue/<logos:react />React/<logos:svelte-icon />Svelte/<logos:angular-icon />Angular/<logos:solidjs-icon />Solid.js 都有对应的状态管理工具</p>

- 📝 解决组件化之后的组件之间的通信问题
- 🎨 规范共享数据的使用方式
- 与调试工具挂钩，方便debug 如：**vue-devtool / react-devtool**

<br>
<br>

## 常见的状态管理工具 <sup class="text-sm">~~🙄：window.xx 也能用~~</sup>

<div grid="~ cols-2 gap-4">
<div>


- Vue
  - Vuex
  - <p class="flex items-center gap-2"><img src="https://pinia.vuejs.org/logo.svg" class="w-4 h-4" /> Pinia</p>


</div>
<div>

- React
  - jotai
  - Recoil
  - MobX
  - Redux ~~👊我劝你别用~~
  - Dva ~~🐶都不用~~


</div>
</div>

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/guide/syntax#embedded-styles
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---

# 响应式状态流派

@vue/reactivity / ~~Vue2.x~~ / ~~MobX~~

```ts{all|3-6|8}
import { reactive, ref, effect } from '@vue/reactivity'

const state = reactive({
  account: '',
  id: '',
})

const show = ref(false)

// 会立即执行一次
effect(() => {
  console.log(show.value) // false
})
```

@vue/reactivity 是一个框架无关(framework agnostic)的包，只包含响应式的核心。与此类似的还有流式数据管理 Rxjs/Xstream；他们都可以在任何应用中使用。  

---

# 在 React 中使用 @vue/reactivity 管理状态<sup>1</sup>

部分代码参考 reactivue

<div grid="~ cols-2 gap-4">
<div class="transform scale-85 origin-top-left">

```tsx{all|6}
import { useEffect, useState } from 'react'
import { ref, effect } from '@vue/reactivity'

function App() {
  const [count, setCount] = useState(0)
  const _count = ref(0)

  useEffect(() => {
    const stop = effect(() => {
      setCount(_count)

      return () => stop()
    })
  }, [])
  

  return (
    <div>
      <span>count is: {count}</span>
      <button  type="button" onClick={() => _count.value++}>
        +
      </button>
    </div>
  )
}
```

</div>
<div v-click class="transform scale-85 origin-top-left">

```tsx{4}
import { useEffect, useState } from 'react'
import { ref, effect } from '@vue/reactivity'

const _count = ref(0)

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const stop = effect(() => {
      setCount(_count)

      return () => stop()
    })
  }, [])
  

  return (
    <div>
      <span>count is: {count}</span>
      <button  type="button" onClick={() => _count.value++}>
        +
      </button>
    </div>
  )
}
```

</div>
</div>

---

# 在 React 中使用 @vue/reactivity 管理状态<sup>2</sup>

封装一个简单 store

```ts
import { ref, Ref, effect } from '@vue/reactivity'
import { useState } from 'react'

export const useAtom = <T>(config: T ) => ref(config)

export const useAtomValue = <T>(atom: ReturnType<typeof useAtom>, select?: (value: T) => T) => {
  const [_atom, setAtom] = useState<T>(atom.value)

  effect(() => {
    setAtom(atom.value)
  })

  return select ? select(_atom) : _atom
}

export const useSetAtom = <T>(atom: ReturnType<typeof useAtom<T>>) => {
  return (value: T) => atom.value = value
}
```
---

# 在 React 中使用 @vue/reactivity 管理状态<sup>3</sup>

使用 watch

```ts
const watch = (source: unknown, fn: (value?: unknown) => void) => {
  const stop = effect(() => fn(source), {
    lazy: true,
  })
  return () => stop()
}
```

---

# 使用 @vue/reactivity 管理 JSbridge 状态<sup>1</sup>

硬编码期

```ts
import { onBeforeUnmount } from 'vue'

export default {
  setup() {
    window!.jsBridge!.onPullDown = () => {
      // do something
      fetch('www.baidu.com').then(res => {
        res.json().then(data => console.log(data))
      })
    }

    onBeforeUnmount(() => {
      window!.jsBridge!.onPullDown = null
    })
  }
}
```

---

# 使用 @vue/reactivity 管理 JSbridge 状态<sup>2</sup>

流式调用

<div grid="~ cols-2 gap-4">
<div>

```ts
import xs, { listener } from 'xstream'

const pullDownProducer = {
  start: (listener: Listener<undefined>) => {
    window!.jsBridge!.onPullDown = () => {
      listener.next(undefined)
    }
  },
  stop: () => {},
}

export const pullDownStream = xs.create(pullDownProducer)
```

</div>
<div v-click>

```ts
import { onBeforeUnmount } from 'vue'
import { pullDownStream } from './streams'
import { fetchApi } from 'api'

export default {
  setup() {
    const sub = pullDownStream.subscribe(fetchApi)

    onBeforeUnmount(() => {
      sub.unsubscribe()
    })
  }
}
```

</div>
</div>

---

# 使用 @vue/reactivity 管理 JSbridge 状态<sup>3</sup>

响应式管理

<div grid="~ cols-2 gap-4">
<div>

```ts
import { ref, watch, onBeforeUnmount } from 'vue'

const pullDownStatus = ref(false)

const window!.jsBridge!.onPullDown = () => {
  pullDownStatus.value = true
  Promise.resolve().then(() => {
    pullDownStatus.value = false
  })
}

export const usePullDown = (cb) => {
  const stop = watch(pullDownStatus, (val) => {
    val && cb()
  })
  return () => stop()
}
```

</div>
<div v-click>

```ts
import { onBeforeUnmount } from 'vue'
import { usePullDown } from './usePullDown'
import { fetchApi } from 'api'

export default {
  setup() {
    const stop = usePullDown(fetchApi)

    return {
      stop,
    }
  }
}
```

</div>
</div>

---

# 使用 @vue/reactivity 处理请求<sup>1</sup>

抄一抄 SWR

<div grid="~ cols-2 gap-4">
<div v-click>


```ts
import { reactive, toRefs } from '@vue/reactivity'

const useFetch = <D = {}, Error = any>(url: string, fetcher?: (url: string) => Promise<D>) => {
  const stateRef = reactive<{
    data: undefined | D,
    error: undefined | Error,
    loading: boolean,
  }>({
    data: undefined,
    error: undefined,
    loading: false,
  })
  const startFetch = async () => {
    //
  }

  startFetch()

  return toRefs(stateRef)
}
```

</div>
<div  v-click>

```ts
const startFetch = async () => {
  try {
    if (fetcher) {
      stateRef.loading = true
      stateRef.data = await fetcher(url)
      stateRef.loading = false
    } else {
      stateRef.loading = true
      const res = await fetch(key)
      stateRef.data = await res.json()
      stateRef.loading = false
    }
  } catch (error) {
    stateRef.error = error
  }
}
```

```vue
<!-- 使用 -->
<script lang="ts" setup>
const { data } = useFetch('/api/test')
</script>
```

</div>
</div>

---

# 如何选择框架？

<img v-click src="/drake.png"  class="mt-10 block m-auto h-5/6" />