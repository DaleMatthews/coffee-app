import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.green.darken3,
    secondary: colors.brown.base,
    accent: colors.yellow.lighten1,
    info: colors.amber.darken3,
    warning: colors.orange.darken1,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
  },
});
