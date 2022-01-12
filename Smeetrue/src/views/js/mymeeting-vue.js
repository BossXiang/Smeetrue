const app = Vue.createApp({
  data() {
    return {
      identity: "Host",
      isEditing: false,
      state: 0,
      month: 12,
      startWeekDay: 3,
      hostMeetingIDs: [2, 3, 20],
      meetingIDs: [2, 6, 8, 29],
      host: [],
      meet: [],
      currentIdx: 0,
    };
  },
  computed: {
    datesList() {
      dateList = [];
      this.host = [];
      this.meet = [];
      for (let i = 0; i < this.startWeekDay; i++) {
        dateList.push("");
        this.host.push(false);
        this.meet.push(false);
      }
      for (let i = 1; i <= 31; i++) {
        dateList.push(i);
        this.host.push(this.hostMeetingIDs.indexOf(i) != -1);
        this.meet.push(this.meetingIDs.indexOf(i) != -1);
      }
      dateList.push("");
      this.host.push(false);
      this.meet.push(false);
      return dateList;
    },
    isShowCalendar() {
      return this.state === 0;
    },
    isShowMeetingList() {
      return this.state === 1;
    },
    isShowMeetingInfo() {
      return this.state === 2;
    },
    isShowEmailBox() {
      return this.state === 3;
    },
    isHost() {
      return this.identity === "Host";
    },
    isUser() {
      return this.identity === "User";
    },
  },
  methods: {
    changeState(value) {
      this.state = value;
    },
    viewMeetings(date) {
      this.currentIdx = date;
      this.changeState(1);
    },
    setEditMode(value) {
      this.isEditing = value;
    },
  },
});

app.mount("#mymeeting");
