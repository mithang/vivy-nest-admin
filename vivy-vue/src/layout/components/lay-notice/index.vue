<script setup lang="ts">
import { ref, computed } from 'vue'
import NoticeList from './components/NoticeList.vue'
import { noticesData } from './data'
import BellIcon from '~icons/ep/bell'

const noticesNum = ref(0)
const notices = ref(noticesData)
const activeKey = ref(noticesData[0]?.key)

notices.value.map((v) => (noticesNum.value += v.list.length))

const getLabel = computed(() => (item) => item.name + (item.list.length > 0 ? `(${item.list.length})` : ''))
</script>

<template>
  <ElDropdown trigger="click" placement="bottom-end">
    <span :class="['dropdown-badge', 'navbar-bg-hover', 'select-none', Number(noticesNum) !== 0 && 'mr-[10px]']">
      <ElBadge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="BellIcon" />
        </span>
      </ElBadge>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElTabs
          v-model="activeKey"
          :stretch="true"
          class="dropdown-tabs"
          :style="{ width: notices.length === 0 ? '200px' : '330px' }"
        >
          <ElEmpty v-if="notices.length === 0" description="暂无消息" :image-size="60" />
          <span v-else>
            <template v-for="item in notices" :key="item.key">
              <ElTabPane :label="getLabel(item)" :name="`${item.key}`">
                <ElScrollbar max-height="330px">
                  <div class="noticeList-container">
                    <NoticeList :list="item.list" :empty-text="item.emptyText" />
                  </div>
                </ElScrollbar>
              </ElTabPane>
            </template>
          </span>
        </ElTabs>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}
</style>
