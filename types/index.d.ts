import type { LaunchParams } from '@tma.js/sdk'

declare module '#app' {
  interface NuxtApp {
    $lp: LaunchParams | undefined
    $debugSource: string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $lp: LaunchParams | undefined
    $debugSource: string
  }
}

export {}
