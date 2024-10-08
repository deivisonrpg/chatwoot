<script>
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import { useCampaign } from 'shared/composables/useCampaign';
import CampaignsTable from './CampaignsTable.vue';
import EditCampaign from './EditCampaign.vue';
export default {
  components: {
    CampaignsTable,
    EditCampaign,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { campaignType } = useCampaign();
    return { campaignType };
  },
  data() {
    return {
      showEditPopup: false,
      selectedCampaign: {},
      showDeleteConfirmationPopup: false,
    };
  },
  computed: {
    ...mapGetters({
      uiFlags: 'campaigns/getUIFlags',
    }),
    campaigns() {
      return this.$store.getters['campaigns/getCampaigns'](this.campaignType);
    },
    showEmptyResult() {
      const hasEmptyResults =
        !this.uiFlags.isFetching && this.campaigns.length === 0;
      return hasEmptyResults;
    },
  },
  methods: {
    openEditPopup(campaign) {
      this.selectedCampaign = campaign;
      this.showEditPopup = true;
    },
    hideEditPopup() {
      this.showEditPopup = false;
    },
    openDeletePopup(campaign) {
      this.showDeleteConfirmationPopup = true;
      this.selectedCampaign = campaign;
    },
    closeDeletePopup() {
      this.showDeleteConfirmationPopup = false;
    },
    confirmDeletion() {
      this.closeDeletePopup();
      const { id } = this.selectedCampaign;
      this.deleteCampaign(id);
    },
    async deleteCampaign(id) {
      try {
        await this.$store.dispatch('campaigns/delete', id);
        useAlert(this.$t('CAMPAIGN.DELETE.API.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('CAMPAIGN.DELETE.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>

<template>
  <div class="flex-1 overflow-auto">
    <CampaignsTable
      :campaigns="campaigns"
      :show-empty-result="showEmptyResult"
      :is-loading="uiFlags.isFetching"
      :campaign-type="type"
      @edit="openEditPopup"
      @delete="openDeletePopup"
    />
    <woot-modal v-model:show="showEditPopup" :on-close="hideEditPopup">
      <EditCampaign
        :selected-campaign="selectedCampaign"
        @on-close="hideEditPopup"
      />
    </woot-modal>
    <woot-delete-modal
      v-model:show="showDeleteConfirmationPopup"
      :on-close="closeDeletePopup"
      :on-confirm="confirmDeletion"
      :title="$t('CAMPAIGN.DELETE.CONFIRM.TITLE')"
      :message="$t('CAMPAIGN.DELETE.CONFIRM.MESSAGE')"
      :confirm-text="$t('CAMPAIGN.DELETE.CONFIRM.YES')"
      :reject-text="$t('CAMPAIGN.DELETE.CONFIRM.NO')"
    />
  </div>
</template>

<style scoped lang="scss">
.button-wrapper {
  @apply flex justify-end pb-2.5;
}
</style>
