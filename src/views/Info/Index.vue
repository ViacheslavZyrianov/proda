<script setup>
const infoList = [
  {
    title: 'Databases',
    list: [
      {
        label: 'Test',
        link: 'https://docs.google.com/spreadsheets/d/1R_yyCWukQcesn2T8oHrsZ-6OLdHsgxuMygwC8UagX-k/edit'
      },
      {
        label: 'Prod',
        link: 'https://docs.google.com/spreadsheets/d/1iBVTQ2-6kU7lGEQ2zfKwyHJ6uXWMsfiekqn2Zt4URcs/edit'
      }
    ]
  },
  {
    title: 'Development',
    list: [
      {
        label: 'Trello',
        link: 'https://trello.com/b/vJjxSOPb/pidpeklo-development'
      },
      {
        label: 'Swagger',
        link: 'https://pidpeklo.herokuapp.com/'
      }
    ]
  }
]

</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
  </header>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card
        v-for="{ title, icon, list } in infoList"
        :key="title"
        shadow="hover"
      >
        <template #header>
          <h3>
            <el-icon :size="15">
              <component :is="icon"/>
            </el-icon>
            {{ title }}
          </h3>
        </template>
        <el-row
          v-for="{ label, link } in list"
          :key="label"
        >
          {{ label }} –&nbsp;<el-link
            :href="link"
            target="_blank"
          >
            {{ link }}
          </el-link>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 24px;
}
</style>