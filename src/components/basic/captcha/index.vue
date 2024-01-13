<template>
  <canvas
    class="cursor-pointer"
    ref="canvasRef"
    :width="width"
    :height="height"
    @click="handleRefresh"
  />
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue'

  const props = defineProps({
    code: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 50,
    },
    fontSize: {
      type: Number,
      default: 24,
    },
    interfereLine: {
      type: Number,
      default: 2,
    },
  })

  const emit = defineEmits(['refresh'])

  const canvasRef = ref()

  const randomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const handleDraw = () => {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, props.width, props.height)
    const gradient = ctx.createLinearGradient(0, 0, props.width, 0)
    gradient.addColorStop(0, randomColor())
    gradient.addColorStop(1, randomColor())
    ctx.font = `${props.fontSize}px Inter var`
    ctx.textAlign = 'center'
    ctx.fillStyle = gradient
    ctx.fillText(props.code, props.width / 2, props.height / 1.4)

    for (let i = 0; i < props.interfereLine; i++) {
      const startX = Math.random() * props.width
      const startY = Math.random() * props.height
      const endX = Math.random() * props.width
      const endY = Math.random() * props.height

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
      gradient.addColorStop(0, randomColor())
      gradient.addColorStop(1, randomColor())

      ctx.beginPath()
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }
  }

  watch(
    () => props.code,
    () => {
      handleDraw()
    }
  )

  const handleRefresh = () => {
    emit('refresh')
  }

  onMounted(() => {
    handleDraw()
  })
</script>

<style scoped></style>
