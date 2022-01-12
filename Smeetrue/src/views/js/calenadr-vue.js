const app = Vue.createApp({
  data() {
    return {
      state: 0,
      month: 12,
      startWeekDay: 3,
      invitees: [],
    };
  },
  computed: {
    datesList() {
      dateList = [];
      for (let i = 0; i < this.startWeekDay; i++) {
        dateList.push("");
      }
      for (let i = 1; i <= 31; i++) {
        dateList.push(i);
      }
      dateList.push("");

      return dateList;
    },
    isShowCalendar() {
      return this.state === 0;
    },
    isShowDateInfo() {
      return this.state === 1;
    },
    isShowRoomView() {
      return this.state === 2;
    },
    isShowBookPage() {
      return this.state === 3;
    },
  },
  methods: {
    changeState(value) {
      this.state = value;
    },
    addNewInvitee() {
      alert("test");
    },
  },
});

app.mount("#calendar");
