<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('APP Launch')
})

onShow(() => {
  console.log('APP Show')
})

onHide(() => {
  console.log('APP Hide')
})
</script>

<style lang="scss">
@import './styles/index.scss';
</style>