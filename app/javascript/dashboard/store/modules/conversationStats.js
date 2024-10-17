import types from '../mutation-types';
import ConversationApi from '../../api/inbox/conversation';

const state = {
  mineCount: 0,
  unAssignedCount: 0,
  participatingCount: 0,
  allCount: 0,
};

export const getters = {
  getStats: $state => $state,
};

export const actions = {
  get: async ({ commit }, params) => {
    try {
      const response = await ConversationApi.meta(params);
      const {
        data: { meta },
      } = response;
      commit(types.SET_CONV_TAB_META, meta);
    } catch (error) {
      // Ignore error
    }
  },
  set({ commit }, meta) {
    commit(types.SET_CONV_TAB_META, meta);
  },
};

export const mutations = {
  [types.SET_CONV_TAB_META](
    $state,
    {
      mine_count: mineCount,
      unassigned_count: unAssignedCount,
      participating_count: participatingCount,
      all_count: allCount,
    } = {}
  ) {
    $state.mineCount = mineCount;
    $state.allCount = allCount;
    $state.unAssignedCount = unAssignedCount;
    $state.participating_count = participatingCount;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
