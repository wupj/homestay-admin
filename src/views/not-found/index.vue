<template>
  <div class="container">
    <div class="h-full flex flex-column justify-content-center align-items-center">
      <SvgIcon iconName="notfound" className="notfound" />
      <Button label="返回首页" @click="handleReturn" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const handleReturn = () => {
    router.push('/home')
  }
</script>

<style lang="scss" scoped>
  .notfound {
    width: 50rem;
    height: 50rem;
  }
</style>
