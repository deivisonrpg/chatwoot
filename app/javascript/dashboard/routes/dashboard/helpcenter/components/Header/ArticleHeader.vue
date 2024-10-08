<script>
import WootDropdownItem from 'shared/components/ui/dropdown/DropdownItem.vue';
import WootDropdownMenu from 'shared/components/ui/dropdown/DropdownMenu.vue';
import MultiselectDropdownItems from 'shared/components/ui/MultiselectDropdownItems.vue';

import FluentIcon from 'shared/components/FluentIcon/DashboardIcon.vue';
export default {
  components: {
    FluentIcon,
    WootDropdownItem,
    WootDropdownMenu,
    MultiselectDropdownItems,
  },
  props: {
    headerTitle: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    selectedValue: {
      type: String,
      default: '',
    },
    selectedLocale: {
      type: String,
      default: '',
    },
    shouldShowSettings: {
      type: Boolean,
      default: false,
    },
    allLocales: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['openModal', 'open', 'close', 'newArticlePage', 'changeLocale'],
  data() {
    return {
      showSortByDropdown: false,
      showLocaleDropdown: false,
    };
  },
  computed: {
    shouldShowLocaleDropdown() {
      return this.allLocales.length > 1;
    },
    switchableLocales() {
      return this.allLocales.filter(
        locale => locale.name !== this.selectedLocale
      );
    },
  },
  methods: {
    openFilterModal() {
      this.$emit('openModal');
    },
    openDropdown() {
      this.$emit('open');
      this.showSortByDropdown = true;
    },
    closeDropdown() {
      this.$emit('close');
      this.showSortByDropdown = false;
    },
    openLocaleDropdown() {
      this.showLocaleDropdown = true;
    },
    closeLocaleDropdown() {
      this.showLocaleDropdown = false;
    },
    onClickNewArticlePage() {
      this.$emit('newArticlePage');
    },
    onClickSelectItem(value) {
      const { name, code } = value;
      this.closeLocaleDropdown();
      if (!name || name === this.selectedLocale) {
        return;
      }
      this.$emit('changeLocale', code);
    },
  },
};
</script>

<template>
  <div
    class="sticky top-0 z-50 flex items-center justify-between w-full h-16 p-6 bg-white dark:bg-slate-900"
  >
    <div class="flex items-center">
      <woot-sidemenu-icon />
      <div class="flex items-center mx-2 my-0">
        <h3 class="mb-0 text-xl font-medium text-slate-800 dark:text-slate-100">
          {{ headerTitle }}
        </h3>
        <span class="text-sm text-slate-600 dark:text-slate-300 mx-2 mt-0.5">{{
          `(${count})`
        }}</span>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <woot-button
        v-if="shouldShowSettings"
        icon="filter"
        color-scheme="secondary"
        variant="hollow"
        size="small"
        @click="openFilterModal"
      >
        {{ $t('HELP_CENTER.HEADER.FILTER') }}
      </woot-button>
      <woot-button
        v-if="shouldShowSettings"
        icon="arrow-sort"
        color-scheme="secondary"
        size="small"
        variant="hollow"
        @click="openDropdown"
      >
        {{ $t('HELP_CENTER.HEADER.SORT') }}
        <span
          class="inline-flex items-center ml-1 rtl:ml-0 rtl:mr-1 text-slate-800 dark:text-slate-100"
        >
          {{ selectedValue }}
          <FluentIcon class="dropdown-arrow" icon="chevron-down" size="14" />
        </span>
      </woot-button>
      <div
        v-if="showSortByDropdown"
        v-on-clickaway="closeDropdown"
        class="dropdown-pane dropdown-pane--open"
      >
        <WootDropdownMenu>
          <WootDropdownItem>
            <woot-button
              variant="clear"
              color-scheme="secondary"
              size="small"
              icon="send-clock"
            >
              {{ $t('HELP_CENTER.HEADER.DROPDOWN_OPTIONS.PUBLISHED') }}
            </woot-button>
          </WootDropdownItem>
          <WootDropdownItem>
            <woot-button
              variant="clear"
              color-scheme="secondary"
              size="small"
              icon="dual-screen-clock"
            >
              {{ $t('HELP_CENTER.HEADER.DROPDOWN_OPTIONS.DRAFT') }}
            </woot-button>
          </WootDropdownItem>
          <WootDropdownItem>
            <woot-button
              variant="clear"
              color-scheme="secondary"
              size="small"
              icon="calendar-clock"
            >
              {{ $t('HELP_CENTER.HEADER.DROPDOWN_OPTIONS.ARCHIVED') }}
            </woot-button>
          </WootDropdownItem>
        </WootDropdownMenu>
      </div>
      <woot-button
        v-if="shouldShowSettings"
        v-tooltip.top-end="$t('HELP_CENTER.HEADER.SETTINGS_BUTTON')"
        icon="settings"
        variant="hollow"
        size="small"
        color-scheme="secondary"
      />
      <div class="relative">
        <woot-button
          v-if="shouldShowLocaleDropdown"
          icon="globe"
          color-scheme="secondary"
          size="small"
          variant="hollow"
          @click="openLocaleDropdown"
        >
          <div class="flex items-center justify-between w-full min-w-0">
            <span
              class="inline-flex items-center ml-1 rtl:ml-0 rtl:mr-1 text-slate-800 dark:text-slate-100"
            >
              {{ selectedLocale }}
              <FluentIcon
                class="dropdown-arrow"
                icon="chevron-down"
                size="14"
              />
            </span>
          </div>
        </woot-button>
        <div
          v-if="showLocaleDropdown"
          v-on-clickaway="closeLocaleDropdown"
          class="dropdown-pane dropdown-pane--open"
        >
          <MultiselectDropdownItems
            :options="switchableLocales"
            :has-thumbnail="false"
            :selected-items="[selectedLocale]"
            :input-placeholder="
              $t('HELP_CENTER.HEADER.LOCALE_SELECT.SEARCH_PLACEHOLDER')
            "
            :no-search-result="$t('HELP_CENTER.HEADER.LOCALE_SELECT.NO_RESULT')"
            @select="onClickSelectItem"
          />
        </div>
      </div>
      <woot-button
        size="small"
        icon="add"
        color-scheme="primary"
        @click="onClickNewArticlePage"
      >
        {{ $t('HELP_CENTER.HEADER.NEW_BUTTON') }}
      </woot-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-pane--open {
  @apply absolute top-10 right-0 z-50 min-w-[8rem];
}

.dropdown-arrow {
  @apply ml-1 rtl:ml-0 rtl:mr-1;
}
</style>
