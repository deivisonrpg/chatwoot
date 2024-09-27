<script>
import { getInboxClassByType } from 'dashboard/helper/inbox';

export default {
  props: {
    inbox: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    computedInboxClass() {
      const { phone_number: phoneNumber, channel_type: type } = this.inbox;
      const classByType = getInboxClassByType(type, phoneNumber);
      return classByType;
    },
  },
};
</script>

<template>
  <div
    class="inbox--name items-center py-0.5 px-0 leading-3 font-medium bg-none text-slate-600 dark:text-slate-500 text-xs my-0 mx-2"
  >
    <div class="flex">
      <fluent-icon
        class="mr-0.5 rtl:ml-0.5 rtl:mr-0"
        :icon="computedInboxClass"
        size="12"
      />
      <span class="text-ellipsis overflow-hidden whitespace-nowrap">{{
        inbox.name
      }}</span>
    </div>
  </div>
</template>
