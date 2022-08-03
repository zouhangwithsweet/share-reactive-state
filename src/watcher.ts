import { effect, isReactive, isRef } from "@vue/reactivity"

function traverse(value, seen = new Set()) {
  if (!isObject(value) || seen.has(value))
    return value

  seen.add(value) // prevent circular reference 
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++)
      traverse(value[i], seen)
  }
  else {
    for (const key of Object.keys(value))
      traverse(value[key], seen)
  }
  return value
}

const watch = (source: unknown, fn, { deep, lazy = true }) => {
  let getter = isRef(source)
    ? () => source.value
    : isReactive(source) 
      ? () => source
      : source
    
  if (deep)
    getter = () => traverse(getter())
    
  const runner = effect(getter, {
    lazy,
    scheduler: fn
  })

  return () => stop(runner)
}
