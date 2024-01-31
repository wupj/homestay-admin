<template>
  <div class="container">
    <Overview />
    <div class="flex flex-row mt-4">
      <div class="flex-left flex flex-row grid-item mr-2">
        <OrderStatus class="grid-item mr-2" />
        <CapitalIncome class="grid-item ml-2" />
      </div>
      <div class="flex-right grid-item ml-2">
        <VisitsTrend />
      </div>
    </div>
    <div class="flex flex-row mt-4">
      <div class="flex-left flex flex-row grid-item mr-2">
        <UserProfile class="w-full" />
      </div>
      <div class="flex-right flex flex-row grid-item ml-2">
        <OrderRank class="grid-item mr-2" />
        <SalesRank class="grid-item ml-2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Overview from './widgets/overview'
import OrderStatus from './widgets/order-status'
import CapitalIncome from './widgets/capital-income'
import VisitsTrend from './widgets/visits-trend'
import UserProfile from './widgets/user-profile'
import OrderRank from './widgets/order-rank'
import SalesRank from './widgets/sales-rank'

</script>

<style lang="scss" scoped>
  .container {
    .grid-item {
      width: calc(50% - 0.5rem);
    }
  }
</style>
