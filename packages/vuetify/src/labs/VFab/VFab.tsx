// Styles
import './VFab.sass'

// Components
import { makeVBtnProps, VBtn } from '@/components/VBtn/VBtn'

// Composables
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'
import { makeLocationProps, useLocation } from '@/composables/location'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, onMounted, ref, shallowRef, toRef, toRefs, watch, watchEffect } from 'vue'
import { useRtl } from '../entry-bundler'
import { convertToUnit, genericComponent, propsFactory, toPhysical, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

const locations = ['start', 'end', 'left', 'right', 'top', 'bottom'] as const

export const makeVFabProps = propsFactory({
  app: Boolean,
  extended: Boolean,
  modelValue: {
    type: Boolean,
    default: true,
  },

  ...makeVBtnProps(),
  ...makeLayoutItemProps(),

  location: {
    type: String as PropType<typeof locations[number]>,
    default: 'bottom',
    validator: (value: any) => locations.includes(value),
  },
}, 'VFab')

export const VFab = genericComponent()({
  name: 'VFab',

  props: makeVFabProps(),

  emits: {
    'update:modelValue': (value: boolean) => true,
  },

  setup (props, { slots }) {
    const isActive = useProxiedModel(props, 'modelValue')
    const { isRtl } = useRtl()
    const { locationStyles } = useLocation(props)

    const location = computed(() => {
      return toPhysical(props.location, isRtl.value) as 'left' | 'right' | 'bottom'
    })
    const { layoutItemStyles } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: computed(() => 'top'),
      layoutSize: ref(56),
      elementSize: shallowRef(16),
      active: computed(() => props.app),
      absolute: toRef(props, 'absolute'),
    })

    const vFabRef = ref()

    useRender(() => {
      const btnProps = VBtn.filterProps(props)

      return (
        <div
          ref={ vFabRef }
          class={[
            'v-fab',
            {
              'v-fab--extended': props.extended,
            },
            props.class,
          ]}
          style={[
            props.app ? {
              ...layoutItemStyles.value,
              ...locationStyles.value,
            } : {
              height: undefined,
            },
            props.style,
          ]}
        >
          <VBtn
            { ...btnProps }
            location={ undefined }
            v-slots={ slots }
          />
        </div>
      )
    })

    return {}
  },
})
