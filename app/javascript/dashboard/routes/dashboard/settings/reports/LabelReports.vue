<script>
import WootReports from './components/WootReports.vue';

export default {
  components: {
    WootReports,
  },
};
</script>

<template>
  <WootReports
    key="label-reports"
    type="label"
    getter-key="labels/getLabels"
    action-key="labels/get"
    :download-button-label="$t('LABEL_REPORTS.DOWNLOAD_LABEL_REPORTS')"
  />
</template>
