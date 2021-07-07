import { keys, maxBy, some } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import API from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';

Vue.use(Vuex);

const preloadAttachments = (brewLog) => {
  if (brewLog.attachments) {
    // transform attachments for attachments-grid
    brewLog.attachments = brewLog.attachments.map((key) => {
      const attachment = {
        key,
        progress: 100,
        url: '',
      };
      Storage.vault.get(key)
        .then((url) => {
          attachment.url = url;
        });

      return attachment;
    });
  }
};

export default new Vuex.Store({
  modules: {
    // TODO don't lose new brew values while navigating around
    // newBrew,
  },
  state: {
    userId: null,
    userIsAuthenticated: null,
    brewLogs: {},
    brewLogListIds: [],
    lastBrewLogId: null,
    listFilters: {
      startDate: null,
    },
    loading: {
      brewSubmitting: false,
      fetchingList: false,
    },
  },
  getters: {
    lastBrewLog: (state) => {
      return state.lastBrewLogId && state.brewLogs[state.lastBrewLogId] || null;
    },
    brewLogList: (state) => {
      return state.brewLogListIds.map(id => state.brewLogs[id]);
    },
    oneBrewExists: (state) => {
      return some(state.brewLogs);
    },
  },
  mutations: {
    LOGIN(state, { attributes }) {
      if (attributes && attributes.sub) {
        state.userId = attributes.sub;
        state.userIsAuthenticated = true;
      }
    },
    LOGOUT(state) {
      state.userId = null;
      state.userIsAuthenticated = false;
    },
    SET_BREW_LOG_LIST(state, brewLogs) {
      brewLogs.forEach(preloadAttachments);
      state.brewLogListIds = brewLogs.map(item => item.id);
      brewLogs.forEach(log => Vue.set(state.brewLogs, log.id, log));
    },
    SET_LAST_BREW(state, brewLog) {
      preloadAttachments(brewLog);
      state.lastBrewLogId = brewLog.id;
      Vue.set(state.brewLogs, brewLog.id, brewLog);
    },
    ADD_BREW_LOG(state, brewLog) {
      preloadAttachments(brewLog);
      Vue.set(state.brewLogs, brewLog.id, brewLog);
      state.brewLogListIds.unshift(brewLog.id);
      state.lastBrewLogId = brewLog.id;
    },
    UPDATE_BREW_LOG(state, brewLog) {
      state.brewLogs[brewLog.id] = brewLog;
    },
    DELETE_BREW_LOG(state, brewLogId) {
      Vue.delete(state.brewLogs, brewLogId);
      state.brewLogListIds = state.brewLogListIds.filter(id => id !== brewLogId);
      state.lastBrewLogId = maxBy(keys(state.brewLogs), key => state.brewLogs[key].createdAt);
    },
    SET_LIST_FILTERS(state, filters) {
      state.listFilters = filters;
    },
    SET_LOADING(state, { item, value }) {
      state.loading[item] = value;
    },
  },
  actions: {
    async logout({ commit }) {
      commit('LOGOUT');
      await Auth.signOut();
    },
    login({ commit, dispatch }, user) {
      commit('LOGIN', user);
      return Promise.all([
        dispatch('getBrewLogList'),
        dispatch('getLastBrew'),
      ]);
    },
    async getBrewLogList({ commit, state }, afterDate) {
      var options = {};

      if (afterDate) options.queryStringParameters = { startDate: afterDate };
      else if (state.listFilters.startDate) options.queryStringParameters = { startDate: state.listFilters.startDate };

      try {
        commit('SET_LOADING', { item: 'fetchingList', value: true });
        const brewLogs = await API.get('coffee', `/users/${state.userId}/logs`, options);
        commit('SET_LOADING', { item: 'fetchingList', value: false });
        commit('SET_BREW_LOG_LIST', brewLogs);
      } catch (error) {
        console.error(error); // eslint-disable-line
        commit('SET_LOADING', { item: 'fetchingList', value: false });
      }
    },
    async getLastBrew({ commit, state }) {
      // TODO update with query options
      try {
        const brewLogs = await API.get('coffee', `/users/${state.userId}/logs`);
        if (brewLogs.length) commit('SET_LAST_BREW', brewLogs[0]);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    async createBrew({ commit, state }, brew) {
      commit('SET_LOADING', { item: 'brewSubmitting', value: true });
      try {
        const data = await API.post('coffee', `/users/${state.userId}/logs`, {
          body: brew,
        });

        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
        commit('ADD_BREW_LOG', data);
      } catch (error) {
        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
          console.error(error); // eslint-disable-line
      }
    },
    async updateBrew({ commit, state }, brew) {
      commit('SET_LOADING', { item: 'brewSubmitting', value: true });
      try {
        const data = await API.put('coffee', `/users/${state.userId}/logs`, {
          body: brew,
        });

        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
        commit('UPDATE_BREW_LOG', data.Attributes);
      } catch (error) {
        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
          console.error(error); // eslint-disable-line
      }
    },
    async deleteBrew({ commit, dispatch, state }, { userId, createdAt, id }) {
      commit('SET_LOADING', { item: 'brewSubmitting', value: true });
      try {
        await API.del('coffee', `/users/${state.userId}/logs`, {
          body: { userId, createdAt },
        });

        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
        commit('DELETE_BREW_LOG', id);
        if (state.brewLogListIds.length === 0 && some(keys(state.brewLogs))) {
          await dispatch('getBrewLogList');
        }
      } catch (error) {
        commit('SET_LOADING', { item: 'brewSubmitting', value: false });
          console.error(error); // eslint-disable-line
      }
    },
  },
});
