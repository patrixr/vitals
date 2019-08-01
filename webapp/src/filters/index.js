import Vue  from 'vue'
import _    from 'lodash'

Vue.filter("camelToText", (text) => {
  return text.replace(/([A-Z])/g, " $1");
});

Vue.filter("capitalize", (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter("truncateFloat", (num) => {
  return num.toFixed(1);
});

Vue.filter("truncateSeconds", (time) => {
  if (/^\d\d:\d\d:\d\d$/.test(time)) {
    return time.replace(/:\d\d$/, '');
  }
  return time;
});

Vue.filter("timeSince", (date) => {
    let seconds   = Math.floor((new Date() - date) / 1000);
    let interval  = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
});